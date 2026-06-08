const { respond, tryCatch } = require("../utils/helpers");

/**
 * POST /api/chat  (protected)
 * Body: { message: "What are normal TSH levels?" }
 *
 * This endpoint calls GEMINI API. You need an API key from https://aistudio.google.com/
 *
 * If you don't have an OpenAI key yet, set GEMINI_API_KEY="" in .env
 * and the endpoint will return a fallback response.
 */


const chat = tryCatch(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return respond(res, 400, null, "message is required");
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return respond(res, 200, {
      reply: "AI is not configured yet. Please set GROQ_API_KEY in the .env file.",
      source: "fallback",
    });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // ✅ smallest & fastest model = lowest token usage
        messages: [
          {
            role: "system",
            content: `You are Aiva, a thyroid health assistant. Be concise. Max 3 sentences per reply.
              Help users understand thyroid results and symptoms.
              Always remind them to consult their doctor. Never diagnose or prescribe.`,
          },
          { role: "user", content: message },
        ],
        max_tokens: 200, // ✅ keep replies short = saves token quota
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      
      return respond(res, 200, {
        reply: "Sorry, the AI service is temporarily unavailable. Please try again later.",
        source: "error",
      });
    }

    const reply = data.choices?.[0]?.message?.content
      || "Sorry, I could not generate a response.";

    respond(res, 200, { reply, source: "groq" });
  } catch (err) {
    
    respond(res, 200, {
      reply: "Sorry, the AI service is temporarily unavailable. Please try again later.",
      source: "error",
    });
  }
});

module.exports = { chat };