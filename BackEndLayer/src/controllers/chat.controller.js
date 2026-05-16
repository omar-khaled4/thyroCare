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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are Aiva, a thyroid health virtual assistant for the ThyroCare platform.
            You help patients understand their thyroid test results, symptoms, and general thyroid health.
            Keep answers concise and easy to understand. Always remind users to consult their doctor for medical decisions.
            Do not provide diagnoses or prescribe medications.`,
          },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("OpenAI raw response:", JSON.stringify(data, null, 2));
    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    respond(res, 200, { reply, source: "openai" });
  } catch (err) {
    respond(res, 200, {
      reply:
        "Sorry, the AI service is temporarily unavailable. Please try again later.",
      source: "error",
    });
  }
});

module.exports = { chat };
