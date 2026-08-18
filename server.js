const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    status: "SecureMe backend is running",
  });
});

app.post("/api/ai", (req, res) => {
  const { message } = req.body;

  // Validate input
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  const text = message.trim().toLowerCase();

  // Phishing
  if (
    text.includes("phishing") ||
    text.includes("التصيد") ||
    text.includes("التصيّد") ||
    text.includes("تصيد")
  ) {
    return res.json({
      reply:
        "التصيد الإلكتروني هو محاولة خداع المستخدم للحصول على معلومات حساسة مثل كلمات المرور أو بيانات الحسابات. لحماية نفسك: لا تضغط على الروابط المشبوهة، تحقق من عنوان الموقع والمرسل، فعّل MFA، ولا تدخل بياناتك في صفحات غير موثوقة.",
    });
  }

  // Passwords
  if (
    text.includes("password") ||
    text.includes("كلمة المرور") ||
    text.includes("كلمه المرور") ||
    text.includes("كلمة سر") ||
    text.includes("كلمه سر")
  ) {
    return res.json({
      reply:
        "لإنشاء كلمة مرور قوية، استخدم كلمة مرور طويلة وفريدة لكل حساب، ويفضل أن تكون 12 حرفًا أو أكثر مع مزيج من الأحرف والأرقام والرموز. لا تستخدم معلومات شخصية، ولا تعيد استخدام كلمة المرور نفسها في أكثر من حساب. ويمكنك استخدام مدير كلمات مرور موثوق.",
    });
  }

  // MFA
  if (
    text.includes("mfa") ||
    text.includes("2fa") ||
    text.includes("two factor") ||
    text.includes("المصادقة") ||
    text.includes("المصادقه") ||
    text.includes("التحقق بخطوتين") ||
    text.includes("التحقق الثنائي")
  ) {
    return res.json({
      reply:
        "MFA أو المصادقة متعددة العوامل تضيف طبقة حماية إضافية للحساب. حتى لو حصل المهاجم على كلمة المرور، سيحتاج إلى عامل تحقق إضافي. يفضل استخدام تطبيق Authenticator أو Security Key عندما يكون ذلك متاحًا.",
    });
  }

  // Malware
  if (
    text.includes("malware") ||
    text.includes("virus") ||
    text.includes("فيروس") ||
    text.includes("فايروس") ||
    text.includes("برمجية خبيثة") ||
    text.includes("برمجيات خبيثة") ||
    text.includes("البرمجيات الخبيثة")
  ) {
    return res.json({
      reply:
        "البرمجيات الخبيثة Malware هي برامج مصممة لتنفيذ أنشطة ضارة مثل سرقة البيانات أو التجسس أو تعطيل الأنظمة. للحماية، حدّث نظام التشغيل والبرامج، استخدم حلول الحماية، وتجنب تحميل الملفات أو البرامج من مصادر غير موثوقة.",
    });
  }

  // Default response
  return res.json({
    reply:
      "أنا SecureMe AI. أستطيع مساعدتك في أساسيات الأمن السيبراني مثل كلمات المرور، MFA، التصيد الإلكتروني، والبرمجيات الخبيثة.",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SecureMe backend running on port ${PORT}`);
});