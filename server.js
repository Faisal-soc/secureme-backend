const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    status: "SecureMe backend is running",
  });
});

app.post("/api/ai", (req, res) => {
  const { message } = req.body;

  // Validate message
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  // Maximum message length
  if (message.length > 2000) {
    return res.status(400).json({
      error: "Message is too long. Maximum length is 2000 characters.",
    });
  }

  const text = message.toLowerCase().trim();

  let reply;

  if (
    text.includes("phishing") ||
    text.includes("تصيد") ||
    text.includes("التصيد")
  ) {
    reply =
      "التصيد الإلكتروني هو محاولة خداع المستخدم للحصول على معلومات حساسة مثل كلمات المرور أو بيانات الحسابات. لا تضغط على الروابط المشبوهة، وتحقق دائمًا من عنوان الموقع والمرسل قبل إدخال أي معلومات.";
  } else if (
    text.includes("password") ||
    text.includes("كلمة المرور")
  ) {
    reply =
      "استخدم كلمة مرور طويلة وفريدة لكل حساب، ويفضل استخدام مدير كلمات المرور. فعّل MFA متى كان متاحًا ولا تشارك كلمة المرور مع أي شخص.";
  } else if (
    text.includes("mfa") ||
    text.includes("مصادقة") ||
    text.includes("المصادقة")
  ) {
    reply =
      "MFA تضيف طبقة حماية إضافية للحساب. حتى لو حصل المهاجم على كلمة المرور، سيحتاج إلى عامل مصادقة إضافي. يفضل استخدام تطبيق Authenticator أو Security Key.";
  } else if (
    text.includes("malware") ||
    text.includes("برمجية خبيثة") ||
    text.includes("فيروس")
  ) {
    reply =
      "البرمجيات الخبيثة هي برامج مصممة لتنفيذ أنشطة ضارة مثل سرقة البيانات أو تعطيل الأنظمة. حافظ على تحديث النظام، واستخدم حلول الحماية، وتجنب الملفات والروابط غير الموثوقة.";
  } else {
    reply =
      "أنا SecureMe AI. أستطيع مساعدتك في أساسيات الأمن السيبراني مثل كلمات المرور، MFA، التصيد الإلكتروني، والبرمجيات الخبيثة.";
  }

  res.json({
    reply: reply,
  });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON request.",
    });
  }

  next(err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SecureMe backend running on port ${PORT}`);
});