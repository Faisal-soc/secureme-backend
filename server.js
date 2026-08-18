const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "SecureMe backend is running",
  });
});

app.post("/api/ai", (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  const text = message.toLowerCase();

  let reply;

  if (
    text.includes("phishing") ||
    text.includes("تصيد") ||
    text.includes("التصيد")
  ) {
    reply =
      "التصيد الإلكتروني هو محاولة خداع المستخدم للحصول على معلومات حساسة مثل كلمات المرور أو بيانات الحسابات. لا تضغط على الروابط المشبوهة، وتحقق دائمًا من عنوان الموقع والمرسل.";
  } else if (
    text.includes("password") ||
    text.includes("كلمة المرور")
  ) {
    reply =
      "استخدم كلمة مرور طويلة وفريدة لكل حساب، ويفضل استخدام مدير كلمات مرور. فعّل MFA متى كان متاحًا ولا تشارك كلمة المرور مع أي شخص.";
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

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`SecureMe backend running on http://localhost:${PORT}`);
});