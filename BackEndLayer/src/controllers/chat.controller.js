const { respond, tryCatch } = require("../utils/helpers");
const ChatMessage = require("../models/ChatMessage");

const USER_ROLE = "user";
const AI_ROLE = "assistant";
const CONTEXT_LIMIT = 6; // Only send last 6 messages as context to save quota

/**
 * POST /api/chat
 * Body: { message, conversationId, imageBase64? }
 *
 * Sends a user message to Groq AI and returns the response.
 * Also saves both user message and AI response to MongoDB.
 */
const sendMessage = tryCatch(async (req, res) => {
  const { message, conversationId, imageBase64 } = req.body;
  const patientId = req.user.id;

  if (!message) {
    return respond(res, 400, null, "message is required");
  }

  if (!conversationId) {
    return respond(res, 400, null, "conversationId is required");
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return respond(res, 200, {
      reply: "AI is not configured yet. Please set GROQ_API_KEY in the .env file.",
      source: "fallback",
    });
  }

  // 1. Save user message to DB
  await ChatMessage.create({
    patientId,
    conversationId,
    role: USER_ROLE,
    content: message,
    imageUrl: imageBase64 ? imageBase64.substring(0, 50) + "..." : null, // Store reference, not full base64
  });

  // 2. Load recent messages for context (only last N to save quota)
  const recentMessages = await ChatMessage.find({
    patientId,
    conversationId,
  })
    .sort({ createdAt: -1 })
    .limit(CONTEXT_LIMIT)
    .lean();

  // Reverse to get chronological order
  recentMessages.reverse();

  // 3. Build messages array for Groq API
  const systemMessage = {
    role: "system",
    content: `You are Aiva, a thyroid health assistant for ThyroCare. 
Be concise. Max 3 sentences per reply.
Help users understand thyroid test results, symptoms, and lifestyle adjustments.
Always remind them to consult their doctor. Never diagnose or prescribe medication.`,
  };

  const contextMessages = recentMessages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // 4. Choose model based on whether image is attached
  const hasImage = !!imageBase64;
  const model = hasImage
    ? "llama-3.2-11b-vision-preview" // Vision model for images (uses more quota)
    : "llama-3.1-8b-instant"; // Cheapest text model

  // 5. Build the message content
  let lastUserContent;
  if (hasImage) {
    lastUserContent = [
      { type: "text", text: message },
      {
        type: "image_url",
        image_url: { url: imageBase64 },
      },
    ];
  } else {
    lastUserContent = message;
  }

  // Replace last user message with image content if applicable
  const apiMessages = [
    systemMessage,
    ...contextMessages.slice(0, -1), // All except last
    {
      role: USER_ROLE,
      content: lastUserContent,
    },
  ];

  // 6. Call Groq API
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: apiMessages,
          max_tokens: hasImage ? 300 : 200,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[chat] Groq API error:", data);
      return respond(res, 200, {
        reply:
          "Sorry, the AI service is temporarily unavailable. Please try again later.",
        source: "error",
      });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    // 7. Save AI response to DB
    await ChatMessage.create({
      patientId,
      conversationId,
      role: AI_ROLE,
      content: reply,
    });

    respond(res, 200, { reply, source: "groq" });
  } catch (err) {
    console.error("[chat] Network error:", err.message);
    respond(res, 200, {
      reply:
        "Sorry, the AI service is temporarily unavailable. Please try again later.",
      source: "error",
    });
  }
});

/**
 * GET /api/chat/conversations
 * Returns a list of all conversations for the current user.
 */
const getConversations = tryCatch(async (req, res) => {
  const patientId = req.user.id;

  // Group by conversationId, get latest message per conversation
  const conversations = await ChatMessage.aggregate([
    { $match: { patientId: mongoose.Types.ObjectId(patientId) } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$conversationId",
        lastMessage: { $first: "$content" },
        lastRole: { $first: "$role" },
        updatedAt: { $first: "$createdAt" },
        messageCount: { $sum: 1 },
      },
    },
    { $sort: { updatedAt: -1 } },
  ]);

  // Generate title from first user message in each conversation
  const result = await Promise.all(
    conversations.map(async (conv) => {
      const firstUserMsg = await ChatMessage.findOne({
        patientId,
        conversationId: conv._id,
        role: USER_ROLE,
      })
        .sort({ createdAt: 1 })
        .lean();

      return {
        conversationId: conv._id,
        title: firstUserMsg
          ? firstUserMsg.content.substring(0, 50) +
          (firstUserMsg.content.length > 50 ? "..." : "")
          : "New Conversation",
        lastMessage: conv.lastMessage.substring(0, 60),
        updatedAt: conv.updatedAt,
        messageCount: conv.messageCount,
      };
    })
  );

  respond(res, 200, result);
});

/**
 * GET /api/chat/conversations/:id
 * Returns all messages for a specific conversation.
 */
const getConversation = tryCatch(async (req, res) => {
  const patientId = req.user.id;
  const { id } = req.params;

  const messages = await ChatMessage.find({
    patientId,
    conversationId: id,
  })
    .sort({ createdAt: 1 })
    .select("role content imageUrl createdAt")
    .lean();

  respond(res, 200, messages);
});

/**
 * DELETE /api/chat/conversations/:id
 * Deletes all messages in a conversation.
 */
const deleteConversation = tryCatch(async (req, res) => {
  const patientId = req.user.id;
  const { id } = req.params;

  const result = await ChatMessage.deleteMany({
    patientId,
    conversationId: id,
  });

  respond(
    res,
    200,
    { deletedCount: result.deletedCount },
    "Conversation deleted"
  );
});

module.exports = {
  sendMessage,
  getConversations,
  getConversation,
  deleteConversation,
};