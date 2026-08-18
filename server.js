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
    version: "3.1"
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
      return res.status(500).json({
        error: "Gemini API key is not configured"
      });
    }

    const systemPrompt = `
You are SecureMe AI, a helpful and intelligent cybersecurity assistant.

Answer the user's actual question directly. Do not start every answer with generic phrases such as "I can help you with..." or "I can assist you with...".

Answer naturally and conversationally.

Always answer in the same language as the user.
If the user writes Arabic, respond in natural Arabic.
If the user writes English, respond in English.

You can answer general questions, not only cybersecurity questions.

For cybersecurity questions:
- Explain concepts clearly.
- Give practical defensive advice.
- Help users understand security tools, logs, alerts, authentication, malware, phishing, MFA, passwords, networking, SIEM, SOC, and related topics.
- For legitimate labs and authorized environments, provide educational technical guidance.

Do not provide instructions intended to steal credentials, deploy malware, bypass authentication, compromise systems without authorization, or harm others.

Keep answers useful and relevant to the user's question.
`;

    const prompt = systemPrompt + "\nUser question:\n" + message;

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      "gemini-2.5-flash:generateContent?key=" +
      encodeURIComponent(GEMINI_API_KEY);

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
          maxOutputTokens: 1000
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return res.status(502).json({
        error: "AI service error",
        details: data?.error?.message || "Unknown Gemini error"
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error("Unexpected Gemini response:", data);

      return res.status(502).json({
        error: "No AI response received"
      });
    }

    return res.json({
      reply: reply.trim()
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("SecureMe backend running on port " + PORT);
});