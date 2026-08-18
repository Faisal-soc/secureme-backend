```javascript
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
    version: "2.0",
  });
});

function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[؟?!.,،]/g, " ")
    .replace(/\s+/g, " ");
}

function contains(text, words) {
  return words.some((word) => text.includes(word));
}

function answer(message) {
  const text = normalize(message);

  // Greetings
  if (
    contains(text, [
      "مرحبا",
      "مرحبًا",
      "هلا",
      "اهلا",
      "أهلا",
      "السلام عليكم",
      "hello",
      "hi",
      "hey",
    ])
  ) {
    return "مرحبًا 👋 أنا SecureMe AI. اسألني عن الأمن السيبراني، كلمات المرور، MFA، التصيد، البرمجيات الخبيثة، الشبكات، الخصوصية، حماية الحسابات أو أي موضوع تقني.";
  }

  // Account protection
  if (
    contains(text, [
      "حسابي",
      "حساباتي",
      "اختراق",
      "اخترق",
      "حماية الحساب",
      "حماية حساب",
      "account",
      "hack",
      "hacked",
    ])
  ) {
    return "لحماية حساباتك: استخدم كلمة مرور قوية وفريدة لكل حساب، فعّل MFA، استخدم مدير كلمات مرور موثوق، حدّث أجهزتك وبرامجك، تجنب الروابط المشبوهة، وراجع جلسات تسجيل الدخول والأجهزة المرتبطة بحساباتك بشكل دوري.";
  }

  // Passwords
  if (
    contains(text, [
      "password",
      "كلمة المرور",
      "كلمه المرور",
      "كلمة سر",
      "كلمه سر",
      "كلمات المرور",
    ])
  ) {
    return "كلمة المرور القوية تكون طويلة وفريدة لكل حساب. يفضل استخدام 12 حرفًا أو أكثر، وعدم استخدام معلومات شخصية أو إعادة استخدام نفس كلمة المرور. مدير كلمات المرور يساعدك على إنشاء كلمات مرور قوية وحفظها بأمان.";
  }

  // MFA
  if (
    contains(text, [
      "mfa",
      "2fa",
      "two factor",
      "multi factor",
      "المصادقة",
      "المصادقه",
      "التحقق بخطوتين",
      "التحقق الثنائي",
    ])
  ) {
    return "MFA تضيف طبقة حماية إضافية للحساب. حتى لو حصل شخص على كلمة المرور، سيحتاج إلى عامل تحقق إضافي. استخدم تطبيق Authenticator أو Security Key عندما يكون ذلك متاحًا، ولا تشارك رموز التحقق مع أي شخص.";
  }

  // Phishing
  if (
    contains(text, [
      "phishing",
      "التصيد",
      "التصيّد",
      "تصيد",
      "رسالة مشبوهة",
      "رابط مشبوه",
      "رابط غريب",
    ])
  ) {
    return "التصيد الإلكتروني هو محاولة خداعك للحصول على معلومات حساسة مثل كلمات المرور أو بيانات الحساب. تحقق من عنوان المرسل والرابط، لا تضغط على الروابط المشبوهة، ولا تدخل بياناتك في صفحة وصلت إليها من رسالة غير موثوقة.";
  }

  // Malware
  if (
    contains(text, [
      "malware",
      "virus",
      "ransomware",
      "trojan",
      "فيروس",
      "فايروس",
      "برمجية خبيثة",
      "برمجيات خبيثة",
      "فدية",
    ])
  ) {
    return "البرمجيات الخبيثة تشمل أنواعًا مثل الفيروسات وأحصنة طروادة وبرامج الفدية. للحماية حافظ على تحديث النظام، استخدم برنامج حماية موثوق، لا تثبت برامج من مصادر مجهولة، وتجنب الملفات والمرفقات المشبوهة.";
  }

  // Privacy
  if (
    contains(text, [
      "privacy",
      "الخصوصية",
      "خصوصية",
      "بياناتي",
      "البيانات الشخصية",
    ])
  ) {
    return "لحماية خصوصيتك، قلل المعلومات التي تشاركها، راجع أذونات التطبيقات، استخدم كلمات مرور قوية وMFA، تجنب شبكات Wi-Fi غير الموثوقة، وراجع إعدادات الخصوصية في حساباتك.";
  }

  // Network
  if (
    contains(text, [
      "network",
      "شبكة",
      "الشبكة",
      "wifi",
      "واي فاي",
      "dns",
      "tcp",
      "ip",
      "firewall",
      "جدار ناري",
    ])
  ) {
    return "أمن الشبكات يعتمد على حماية الاتصالات والأجهزة والخدمات. من الأساسيات: استخدام Firewall، تأمين Wi-Fi، تحديث أجهزة الشبكة، مراقبة الاتصالات غير المعتادة، وفهم DNS وTCP/IP وHTTP/HTTPS.";
  }

  // SOC
  if (
    contains(text, [
      "soc",
      "siem",
      "splunk",
      "security operations",
      "محلل أمن",
      "المركز الأمني",
      "تنبيه أمني",
      "alert",
      "incident",
      "حادث أمني",
    ])
  ) {
    return "في بيئة SOC تتم مراقبة الأحداث الأمنية وتحليل التنبيهات والتحقق من وجود نشاط مشبوه. عادةً يبدأ المحلل بجمع الأدلة، فهم ما حدث، تحديد المستخدم والجهاز والوقت، ثم تصنيف الحادث وتوثيقه والتصعيد عند الحاجة.";
  }

  // Malware / cyber attacks
  if (
    contains(text, [
      "cyber attack",
      "cybersecurity",
      "cyber security",
      "الأمن السيبراني",
      "هجوم سيبراني",
      "هجمات",
      "هجوم",
      "امن المعلومات",
      "أمن المعلومات",
    ])
  ) {
    return "الأمن السيبراني يهتم بحماية الأنظمة والشبكات والبيانات من التهديدات. من أهم الأساسيات: إدارة الهوية، MFA، التحديثات، النسخ الاحتياطية، التوعية بالتصيد، مراقبة السجلات، واكتشاف النشاط غير المعتاد.";
  }

  // Scam
  if (
    contains(text, [
      "scam",
      "احتيال",
      "نصب",
      "محتال",
      "احتيالي",
    ])
  ) {
    return "إذا شككت في عملية احتيال، لا ترسل أموالًا أو رموز تحقق أو كلمات مرور. توقف عن التواصل مع الجهة المشبوهة، تحقق من المصدر عبر قناة رسمية، واحتفظ بالأدلة مثل الرسائل والروابط.";
  }

  // Password breach
  if (
    contains(text, [
      "breach",
      "leak",
      "تسريب",
      "تسرب",
      "تسريبات",
      "انكشف",
      "تم تسريب",
    ])
  ) {
    return "إذا كنت تعتقد أن حسابك تعرض لتسريب، غيّر كلمة المرور فورًا من الموقع الرسمي، لا تستخدم كلمة المرور نفسها في حسابات أخرى، فعّل MFA، وراجع جلسات الدخول والأجهزة المرتبطة بالحساب.";
  }

  // Generic cybersecurity answer
  return `سؤالك: "${message}"

أستطيع مساعدتك في هذا الموضوع من منظور الأمن السيبراني. للحصول على إجابة أدق، اذكر لي المشكلة أو الشيء الذي تريد فهمه بشكل أكبر.

أستطيع مساعدتك في:
• حماية الحسابات
• كلمات المرور
• MFA
• التصيد والاحتيال
• البرمجيات الخبيثة
• الخصوصية
• أمن الشبكات
• SOC وSIEM
• التنبيهات والحوادث الأمنية
• أساسيات الأمن السيبراني`;
}

app.post("/api/ai", (req, res) => {
  const { message } = req.body;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  if (message.length > 5000) {
    return res.status(400).json({
      error: "Message is too long",
    });
  }

  try {
    const reply = answer(message);

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("AI error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SecureMe backend running on port ${PORT}`);
});
```
