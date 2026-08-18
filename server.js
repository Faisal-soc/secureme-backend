```javascript
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
    version: "3.0"
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

    const systemPrompt =
      "You are SecureMe AI, a cybersecurity assistant. " +
      "Answer the user's question directly and helpfully. " +
      "Answer in the same language used by the user. " +
      "If the user writes Arabic, answer in clear natural Arabic. " +
      "If the user writes English, answer in English. " +
      "You can answer general questions and cybersecurity questions. " +
      "For cybersecurity topics, provide defensive and educational guidance. " +
      "Do not provide instructions intended to steal credentials, deploy malware, " +
      "bypass authentication, or compromise systems without authorization. " +
      "Do not repeatedly say that you can help; actually answer the question.";

    const prompt =
      systemPrompt +
      "\n\nUser question:\n" +
      message;

    const geminiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      "gemini-2.5-flash:generateContent?key=" +
      encodeURIComponent(GEMINI_API_KEY);

    const response = await fetch(geminiUrl, {
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
        error: "AI service error"
      });
    }

    const reply =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;

    if (!reply) {
      console.error("Unexpected Gemini response:", data);

      return res.status(502).json({
        error: "No AI response received"
      });
    }

    return res.status(200).json({
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
```
