const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

/*
 * Security headers
 */
app.use(helmet());

/*
 * CORS
 * Flutter Android + iOS native apps do not depend on browser CORS.
 * We keep CORS enabled for possible web clients.
 */
app.use(cors());

/*
 * Limit JSON request body size
 */
app.use(express.json({ limit: "10kb" }));

/*
 * Health check
 */
app.get("/", (req, res) => {
  res.json({
    status: "SecureMe backend is running",
  });
});

/*
 * AI endpoint
 */
app.post("/api/ai", (req, res) => {
  const { message } = req.body;

  /*
   * Input validation
   */
  if (typeof message !== "string") {
    return res.status(400).json({
      error: "Message must be a string",
    });
  }

  const cleanMessage = message.trim();

  if (!cleanMessage) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  /*
   * Maximum message length
   */
  if (cleanMessage.length > 2000) {
    return res.status(400).json({
      error: "Message is too long",
    });
  }

  const text = cleanMessage.toLowerCase();

  let reply;

  /*
   * Phishing
   */
  if (
    text.includes("phishing") ||
    text.includes("التصيد") ||
    text.includes("تصيد")
  ) {
    reply =
      "التصيد الإلكتروني هو محاولة خداع المستخدم للحصول على معلومات حساسة مثل كلمات المرور أو بيانات الحسابات. لا تضغط على الروابط المشبوهة، وتحقق دائمًا من عنوان الموقع والمرسل، وفعّل المصادقة متعددة العوامل MFA.";
  }

  /*
   * Passwords
   */
  else if (
    text.includes("password") ||
    text.includes("كلمة المرور") ||
    text.includes("كلمه المرور")
  ) {
    reply =
      "استخدم كلمة مرور طويلة وفريدة لكل حساب، ويفضل استخدام مدير كلمات مرور. فعّل MFA عندما يكون متاحًا، ولا تشارك كلمة المرور مع أي شخص.";
  }

  /*
   * MFA
   */
  else if (
    text.includes("mfa") ||
    text.includes("multi-factor") ||
    text.includes("authentication") ||
    text.includes("المصادقة") ||
    text.includes("المصادقه")
  ) {
    reply =
      "MFA تضيف طبقة حماية إضافية للحساب. حتى لو حصل المهاجم على كلمة المرور، سيحتاج إلى عامل مصادقة إضافي. يفضل استخدام تطبيق Authenticator أو Security Key عند توفره.";
  }

  /*
   * Malware
   */
  else if (
    text.includes("malware") ||
    text.includes("virus") ||
    text.includes("برمجية خبيثة") ||
    text.includes("برمجيات خبيثة") ||
    text.includes("فيروس") ||
    text.includes("فايروس")
  ) {
    reply =
      "البرمجيات الخبيثة هي برامج مصممة لتنفيذ أنشطة ضارة مثل سرقة البيانات أو تعطيل الأنظمة. حافظ على تحديث النظام، استخدم حلول الحماية، وتجنب الملفات والروابط غير الموثوقة.";
  }

  /*
   * Default response
   */
  else {
    reply =
      "أنا SecureMe AI. أستطيع مساعدتك في أساسيات الأمن السيبراني مثل كلمات المرور، MFA، التصيد الإلكتروني، والبرمجيات الخبيثة.";
  }

  res.json({
    reply,
  });
});

/*
 * Render provides the PORT environment variable.
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `SecureMe backend running on port ${PORT}`
  );
});