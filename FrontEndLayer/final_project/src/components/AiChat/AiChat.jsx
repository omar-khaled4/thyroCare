import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postChat } from "../../services/chatService";
import toast from "react-hot-toast";
import style from "./AiChat.module.css";

/**
 * AIMessage shape  — OpenAI-compatible role/content pair used throughout
 * the chat pipeline.
 */
const USER_ROLE = "user";
const AI_ROLE = "assistant";

export default function AiChat() {
  const navigate = useNavigate();

  /* ── scroll infrastructure ── */
  const chatRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  /* ── message state ──
   * Each message: { role: "user" | "assistant", content: string }
   * Initialised with a single AI welcome message. */
  const [messages, setMessages] = useState([
    { role: AI_ROLE, content: "Hello! I'm Aiva, your thyroid health assistant. How can I help you today?" }
  ]);

  /* ── send / loading / error ── */
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false); // typing indicator visibility
  const [sendError, setSendError] = useState(null);

  /* ── scroll helpers ── */
  const scrollToBottom = () => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = chatRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollBtn(!nearBottom);
  };

  // Scroll to bottom whenever messages array changes (new message arrives)
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ── clear chat ── */
  const clearChat = () => {
    setMessages([]);
    setSendError(null);
    toast.success("Chat cleared");
  };

  /* ── send message ── */
  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setSendError(null);
    setInputValue("");

    // 1 · optimistic: append user message immediately
    const newMessages = [...messages, { role: USER_ROLE, content: trimmed }];
    setMessages(newMessages);

    // 2 · show typing indicator
    setIsTyping(true);
    try {
      // 3 · POST /chat
      const reply = await postChat(trimmed);

      // 4 · append AI response
      setMessages((prev) => [...prev, { role: AI_ROLE, content: reply }]);
    } catch (err) {
      // 5 · rollback user message and show inline error
      setMessages((prev) => prev.filter((_, i) => i !== messages.length));
      setSendError(err.message || "Sorry, something went wrong. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  /* ── keyboard: Enter to send ── */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="background-DB flex items-center justify-center p-5 mt-0 font-1">
        <div className="background-card bg-white! w-130 h-[70vh] flex flex-col relative shadow-[6px_6px_25px_rgba(0,0,0,0.25)]!">

          {/* ── header ── */}
          <div className="z-10 sticky top-0 left-0 right-0 bg-[#f1f1f1] border-b border-gray-400 flex justify-between px-5 py-2 items-center rounded-t-[22px]">
            <div className="flex justify-between items-center">
              <img src="/src/assets/AI-girl.png" className="h-12 rounded-full" alt="Aiva avatar" />
              <div className="ml-3">
                <p className="text-2xl">Aiva</p>
                <p className="color-1 text-sm">Your Artificial Intelligence Virtual Assistant for thyroid health</p>
              </div>
            </div>
            <span onClick={clearChat} className="cursor-pointer text-2xl text-red-600" aria-label="Clear chat">
              <i className="fa-solid fa-trash-can"></i>
            </span>
          </div>

          {/* ── messages area ── */}
          <div
            ref={chatRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-3 py-4 "
          >
            {sendError && (
              <div className="mb-3 p-3 bg-red-100 border border-red-400 rounded-lg text-red-800 text-sm">
                {sendError}
                <button onClick={() => setSendError(null)} className="ml-2 underline">Dismiss</button>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex justify-${message.role === AI_ROLE ? "start" : "end"} mb-3`}>
                <div className={`${message.role === AI_ROLE ? "bg-[#f1f1f1]" : "background-1 text-white"
                  } p-2 w-[75%] rounded-[15px] ${message.role === AI_ROLE ? "rounded-bl-none" : "rounded-br-none"
                  }`}>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}

            {/* ── typing indicator ── */}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-[#f1f1f1] p-3 w-[75%] rounded-[15px] rounded-bl-none">
                  <span className="inline-block gap-1">
                    <span className="animate-bounce delay-75 text-[#00B3A1]">●</span>
                    <span className="animate-bounce delay-150 text-[#00B3A1]">●</span>
                    <span className="animate-bounce delay-300 text-[#00B3A1]">●</span>
                  </span>
                </div>
              </div>
            )}

            {showScrollBtn && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#00B3A1] text-white w-10 h-10 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition text-xl cursor-pointer"
              >
                <i className="fa-solid fa-arrow-down"></i>
              </button>
            )}
          </div>

          {/* ── input bar ── */}
          <div className="z-10 flex justify-between px-3 py-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-1 text-sm border border-gray-400 rounded-[10px] h-10 bg-[#00000000] color-1 placeholder-gray-400"
              placeholder="Type your question here ..."
              disabled={isTyping}
              required
            />
            <span
              onClick={isTyping ? undefined : handleSend}
              className={`background-1 text-white h-10 w-10 rounded-[10px] flex items-center justify-center text-xl ml-2 cursor-pointer transition-opacity ${isTyping ? "opacity-40 pointer-events-none" : "hover:bg-[#009284]"
                }`}
            >
              {isTyping ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                <i className="fa-solid fa-paper-plane"></i>
              )}
            </span>
          </div>

        </div>
      </div>
    </>
  );
}