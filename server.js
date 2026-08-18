const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
  res.json({
    status: "SecureMe backend is running",
    version: "4.0"
  });
});

app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({
        error: "Message is too long"
      });
    }

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");

      return res.status(500).json({
        error: "Gemini API key is not configured"
      });
    }

    const systemPrompt = `
You are SecureMe AI, a helpful and intelligent cybersecurity assistant.

Answer the user's actual question directly.

Important behavior:
- Do not start every answer with "I can help you".
- Do not give generic introductions.
- Do not repeat the same response.
- Understand the user's question before answering.
- Answer naturally like a real AI assistant.
- Answer in the same language as the user.
- If the user writes Arabic, answer in natural clear Arabic.
- If the user writes English, answer in English.
- You can answer general questions as well as cybersecurity questions.
- For cybersecurity topics, provide useful defensive and educational guidance.
- Explain technical concepts clearly and practically.
- If the question is simple, give a simple answer.
- If the user asks for details, provide useful details.
- Ask for clarification only when genuinely necessary.
- Never claim that you performed an action that you did not perform.

Cybersecurity safety:
- Do not provide instructions for stealing credentials.
- Do not provide instructions for deploying malware.
- Do not provide unauthorized account compromise instructions.
- Do not provide instructions to bypass authentication or security controls on systems without authorization.
- Defensive security, authorized testing, labs, CTFs, and educational examples are allowed.

User question:
`;

    const prompt = systemPrompt + "\n" + message.trim();

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      "gemini-3.6-flash:generateContent?key=" +
      encodeURIComponent(GEMINI_API_KEY);

    console.log("Sending request to Gemini...");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1200
        }
      })
    });

    const data = await response.json();

    console.log("Gemini HTTP status:", response.status);

    if (!response.ok) {
      console.error("Gemini API error:", JSON.stringify(data));

      return res.status(502).json({
        error: "Gemini API error",
        status: response.status,
        details:
          data?.error?.message ||
          "Unknown Gemini API error"
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error(
        "Unexpected Gemini response:",
        JSON.stringify(data)
      );

      return res.status(502).json({
        error: "No AI response received",
        details: "Gemini returned an unexpected response"
      });
    }

    return res.json({
      reply: reply.trim()
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    "SecureMe backend running on port " + PORT
  );
});