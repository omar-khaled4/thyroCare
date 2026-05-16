const { respond, tryCatch } = require("../utils/helpers");

/**
 * POST /api/chat  (protected)
 * Body: { message: "What are normal TSH levels?" }
 *
 * This endpoint calls OpenAI API. You need an API key from https://platform.openai.com/api-keys
 *
 * If you don't have an OpenAI key yet, set OPENAI_API_KEY="" in .env
 * and the endpoint will return a fallback response.
 */
const chat = tryCatch(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return respond(res, 400, null, "message is required");
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // Fallback if no API key is set
  if (!apiKey) {
    return respond(res, 200, {
      reply:
        "AI is not configured yet. Please set OPENAI_API_KEY in the .env file.",
      source: "fallback",
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `You are Aiva, a thyroid health virtual assistant for the ThyroCare platform.
          You help patients understand their thyroid test results, symptoms, and general thyroid health.
          Keep answers concise and easy to understand. Always remind users to consult their doctor for medical decisions.
          Do not provide diagnoses or prescribe medications.` }]
          },
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || "Sorry, I could not generate a response.";

    respond(res, 200, { reply, source: "gemini" });
  } catch (err) {
    respond(res, 200, {
      reply:
        "Sorry, the AI service is temporarily unavailable. Please try again later.",
      source: "error",
    });
  }
});

module.exports = { chat };
