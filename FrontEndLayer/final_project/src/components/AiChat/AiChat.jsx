import React, { useEffect, useRef, useState, useCallback } from "react";
import { getConversations, getConversationMessages, postChat, deleteConversation } from "../../services/chatService";
import toast from "react-hot-toast";

const AI_ROLE = "assistant";
const USER_ROLE = "user";
const DAILY_MESSAGE_LIMIT = 50; // Quota protection
const MESSAGE_COOLDOWN = 3000; // 3 seconds between messages

const SUGGESTED_QUESTIONS = [
  "What do my TSH levels mean?",
  "What are common hypothyroidism symptoms?",
  "How often should I check my thyroid?",
  "What foods affect thyroid function?",
  "What's the difference between T3 and T4?",
  "When should I see an endocrinologist?",
];

export default function AiChat() {
  // ── State ──
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [lastSendTime, setLastSendTime] = useState(0);
  const [messagesUsedToday, setMessagesUsedToday] = useState(0);

  const chatRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  // ── Daily message counter ──
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("chatUsage") || "{}");
    if (stored.date === today) {
      setMessagesUsedToday(stored.count || 0);
    } else {
      localStorage.setItem("chatUsage", JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const incrementUsage = () => {
    const today = new Date().toDateString();
    const newCount = messagesUsedToday + 1;
    setMessagesUsedToday(newCount);
    localStorage.setItem("chatUsage", JSON.stringify({ date: today, count: newCount }));
  };

  // ── Load conversations on mount ──
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoadingHistory(true);
    try {
      const convs = await getConversations();
      setConversations(convs);
    } catch (err) {
      console.error("[AiChat] Failed to load conversations:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // ── Load messages when conversation changes ──
  const openConversation = async (conversationId) => {
    setActiveConversationId(conversationId);
    setShowSidebar(false);
    try {
      const msgs = await getConversationMessages(conversationId);
      setMessages(msgs);
      // Cache in localStorage
      localStorage.setItem(`chat_${conversationId}`, JSON.stringify(msgs));
    } catch (err) {
      console.error("[AiChat] Failed to load messages:", err);
      // Try localStorage cache
      const cached = localStorage.getItem(`chat_${conversationId}`);
      if (cached) setMessages(JSON.parse(cached));
    }
  };

  // ── Create new conversation ──
  const startNewConversation = () => {
    const newId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setActiveConversationId(newId);
    setMessages([
      {
        role: AI_ROLE,
        content: "Hello! I'm Aiva, your thyroid health assistant. How can I help you today?",
        createdAt: new Date().toISOString(),
      },
    ]);
    setShowSidebar(false);
    inputRef.current?.focus();
  };

  // ── Delete conversation ──
  const handleDeleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    try {
      await deleteConversation(conversationId);
      localStorage.removeItem(`chat_${conversationId}`);
      setConversations((prev) => prev.filter((c) => c.conversationId !== conversationId));
      if (activeConversationId === conversationId) {
        startNewConversation();
      }
      toast.success("Conversation deleted");
    } catch (err) {
      toast.error("Failed to delete conversation");
    }
  };

  // ── Image handling ──
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only images are supported");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result); // base64
      setImagePreview(URL.createObjectURL(file));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // ── Send message ──
  const handleSend = useCallback(async (overrideMessage) => {
    const text = (overrideMessage || inputValue).trim();
    if (!text && !selectedImage) return;

    // Quota check
    if (messagesUsedToday >= DAILY_MESSAGE_LIMIT) {
      toast.error(`Daily limit reached (${DAILY_MESSAGE_LIMIT} messages). Try again tomorrow.`);
      return;
    }

    // Cooldown check
    const now = Date.now();
    if (now - lastSendTime < MESSAGE_COOLDOWN) {
      toast.error("Please wait a moment before sending another message");
      return;
    }

    setLastSendTime(now);
    setInputValue("");
    const currentImage = selectedImage;
    removeImage();

    // Add user message optimistically
    const userMsg = {
      role: USER_ROLE,
      content: text || "[Shared an image]",
      imageUrl: currentImage ? "upload" : null,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setIsTyping(true);
    try {
      const reply = await postChat(text, activeConversationId, currentImage);
      const aiMsg = {
        role: AI_ROLE,
        content: reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      incrementUsage();

      // Refresh conversation list
      loadConversations();
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1)); // Remove optimistic user message
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, selectedImage, activeConversationId, messagesUsedToday, lastSendTime]);

  // ── Keyboard ──
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Scroll ──
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // ── Auto-start new conversation if none active ──
  useEffect(() => {
    if (!isLoadingHistory && !activeConversationId) {
      startNewConversation();
    }
  }, [isLoadingHistory]);

  const remainingMessages = DAILY_MESSAGE_LIMIT - messagesUsedToday;

  return (
    <div className="background-DB min-h-screen flex items-center justify-center">
      <div className="w-full max-w-5xl mx-4 pt-24 pb-8 md:pt-28 md:pb-12">
        <div className="background-card overflow-hidden flex flex-col md:flex-row" style={{ height: "75vh" }}>

          {/* ═══════════════════════════════════════════════════════════
           *  SIDEBAR — Conversation History
           * ═══════════════════════════════════════════════════════════ */}
          {/* Mobile overlay */}
          {showSidebar && (
            <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setShowSidebar(false)} />
          )}

          <div className={`
            ${showSidebar ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            fixed md:static z-30 md:z-auto
            w-72 h-full bg-white/80 border-r border-gray-100
            flex flex-col transition-transform duration-200
          `}>
            {/* Sidebar header */}
            <div className="p-4 border-b border-gray-100">
              <button
                onClick={startNewConversation}
                className="w-full py-2.5 bg-[#00B3A1] text-white font-1 rounded-xl hover:bg-[#009e8e] transition-all text-sm flex items-center justify-center gap-2"
              >
                <i className="fas fa-plus"></i> New Chat
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <i className="fas fa-spinner fa-spin text-[#00B3A1]"></i>
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-center text-gray-400 font-5 text-xs py-8">
                  No conversations yet
                </p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.conversationId}
                    onClick={() => openConversation(conv.conversationId)}
                    className={`p-3 rounded-xl cursor-pointer group transition-all ${activeConversationId === conv.conversationId
                        ? "bg-[#00B3A1]/10 border border-[#00B3A1]/20"
                        : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-1 text-sm text-gray-800 truncate">
                          {conv.title}
                        </p>
                        <p className="font-5 text-xs text-gray-400 truncate mt-0.5">
                          {conv.lastMessage}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConversation(conv.conversationId, e)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
                      >
                        <i className="fas fa-trash-can text-xs"></i>
                      </button>
                    </div>
                    <p className="font-5 text-[10px] text-gray-400 mt-1">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Quota indicator */}
            <div className="p-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs font-5 text-gray-400">
                <span>Today's usage</span>
                <span className={remainingMessages <= 10 ? "text-amber-500 font-semibold" : ""}>
                  {messagesUsedToday}/{DAILY_MESSAGE_LIMIT}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${remainingMessages <= 10 ? "bg-amber-400" : "bg-[#00B3A1]"
                    }`}
                  style={{ width: `${(messagesUsedToday / DAILY_MESSAGE_LIMIT) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
           *  MAIN CHAT AREA
           * ═══════════════════════════════════════════════════════════ */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <button
                onClick={() => setShowSidebar(true)}
                className="md:hidden w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <i className="fas fa-bars"></i>
              </button>
              <div className="w-9 h-9 rounded-xl bg-[#00B3A1]/10 flex items-center justify-center">
                <img src="/assets/AI-girl.png" className="w-8 h-8 rounded-lg" alt="Aiva" />
              </div>
              <div className="min-w-0">
                <p className="font-1 text-base text-gray-800">Aiva</p>
                <p className="font-5 text-xs text-gray-400">Thyroid health assistant</p>
              </div>
            </div>

            {/* Messages area */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* Welcome + suggested questions (only in new conversation) */}
              {messages.length === 1 && messages[0].role === AI_ROLE && (
                <div className="space-y-4">
                  {/* Welcome message */}
                  <div className="flex justify-start">
                    <div className="bg-gray-50 p-4 rounded-2xl rounded-bl-sm max-w-[80%]">
                      <p className="font-5 text-sm text-gray-700">
                        {messages[0].content}
                      </p>
                    </div>
                  </div>

                  {/* Suggested questions */}
                  <div className="pl-2">
                    <p className="font-5 text-xs text-gray-400 mb-2">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSend(q)}
                          className="px-3 py-1.5 bg-white border border-[#00B3A1]/20 rounded-full text-xs font-5 text-[#00B3A1] hover:bg-[#00B3A1]/10 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Regular messages */}
              {messages.length > 1 &&
                messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === AI_ROLE ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${msg.role === AI_ROLE
                          ? "bg-gray-50 rounded-bl-sm"
                          : "bg-[#00B3A1] text-white rounded-br-sm"
                        }`}
                    >
                      <p className="font-5 text-sm leading-relaxed">{msg.content}</p>
                      <p
                        className={`font-5 text-[10px] mt-1 ${msg.role === AI_ROLE ? "text-gray-400" : "text-white/60"
                          }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 p-4 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#00B3A1] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-[#00B3A1] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-[#00B3A1] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Image preview */}
            {imagePreview && (
              <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-2">
                <img src={imagePreview} className="w-12 h-12 rounded-lg object-cover" alt="Preview" />
                <div className="flex-1 min-w-0">
                  <p className="font-5 text-xs text-gray-500 truncate">Image attached</p>
                  <p className="font-5 text-[10px] text-amber-500">
                    <i className="fas fa-info-circle mr-1"></i>
                    Image analysis uses more quota
                  </p>
                </div>
                <button onClick={removeImage} className="text-gray-400 hover:text-red-500 transition-colors">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}

            {/* Input bar */}
            <div className="p-3 border-t border-gray-100">
              <div className="flex items-end gap-2">
                {/* Attach button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTyping}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#00B3A1] hover:border-[#00B3A1]/30 transition-all flex-shrink-0 disabled:opacity-40"
                >
                  <i className="fas fa-image text-sm"></i>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Text input */}
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your thyroid health..."
                  disabled={isTyping}
                  rows={1}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-5 text-gray-800 outline-none resize-none focus:border-[#00B3A1] focus:ring-2 focus:ring-[#00B3A1]/20 transition-all placeholder:text-gray-400 disabled:opacity-40"
                  style={{ maxHeight: "120px" }}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                />

                {/* Send button */}
                <button
                  onClick={() => handleSend()}
                  disabled={isTyping || (!inputValue.trim() && !selectedImage)}
                  className="w-10 h-10 rounded-xl bg-[#00B3A1] text-white flex items-center justify-center hover:bg-[#009e8e] transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isTyping ? (
                    <i className="fas fa-spinner fa-spin text-sm"></i>
                  ) : (
                    <i className="fas fa-paper-plane text-sm"></i>
                  )}
                </button>
              </div>

              {/* Quota warning */}
              {remainingMessages <= 10 && remainingMessages > 0 && (
                <p className="font-5 text-[10px] text-amber-500 mt-1.5 text-center">
                  <i className="fas fa-exclamation-triangle mr-1"></i>
                  {remainingMessages} messages remaining today
                </p>
              )}
              {remainingMessages <= 0 && (
                <p className="font-5 text-[10px] text-red-500 mt-1.5 text-center">
                  Daily message limit reached. Try again tomorrow.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}