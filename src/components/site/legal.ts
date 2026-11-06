// Privacy policy and terms for the website, in English and Bangla.
// Based on the in-app text (Maya Android App/.../legal/LegalScreen.kt), extended with what the
// website's order form collects. Keep both in step when either changes.

export type LegalDoc = {
  title: string;
  intro: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
};

const EMAIL = "xentoryxlabs@gmail.com";
const PHONE = "+880 1892-126867";

export const PRIVACY: Record<"en" | "bn", LegalDoc> = {
  en: {
    title: "Privacy Policy",
    intro:
      "This policy explains what information Xentoryx Labs collects when you order Maya on this website, use the Just Maya app, or use a Maya robot, and what we do with it.",
    updated: "Last updated: 6 November 2026",
    sections: [
      {
        heading: "Who we are",
        body: [
          "Maya, this website (maya.xentoryxlabs.site), the Just Maya app and their servers are run by Xentoryx Labs, Bangladesh.",
        ],
      },
      {
        heading: "Orders on this website",
        body: [
          "When you order, we collect your name, phone number, email address, delivery address and the edition you chose. We use them only to confirm your order, deliver it and contact you about it.",
          "You pay on delivery or by bKash. This website never asks for your bKash PIN or card details.",
        ],
      },
      {
        heading: "Your app account",
        body: [
          "When you register in the app we store your name, email address and a hashed version of your password. We never store your password in readable form. We use this to sign you in, to link robots to you and to let other people share a robot with you by email address.",
        ],
      },
      {
        heading: "Data from your robot",
        body: [
          "While a robot is paired, it sends us technical and usage data: its device ID and firmware version, whether it is online, Wi-Fi signal strength, free memory and uptime, its current mood and screen, the city and coordinates you choose for the weather display, the focus (Pomodoro) sessions you complete and your game high scores. This powers the dashboard and statistics in the app.",
          "The robot keeps your Wi-Fi name and password on the device itself to connect to your network. They are not sent to our servers.",
        ],
      },
      {
        heading: "Notification forwarding",
        body: [
          "Only if you turn on notification forwarding and grant Android's notification access, the app reads notifications from the apps you pick and shows them on your robot. They go to your robot and are not stored on our servers. You can turn this off or change the apps at any time.",
        ],
      },
      {
        heading: "Phone permissions",
        body: [
          "Bluetooth and nearby-device access are used to find and set up your robot. The camera is used only to scan the QR code on the robot's screen; the images stay on your phone. Location, if you allow it, is used to pick a city for the weather display.",
        ],
      },
      {
        heading: "Services we use",
        body: [
          "Your account and robot data are stored on our own servers. Weather and city search come from the Open-Meteo public service, using the coordinates you choose. Push notifications to your phone are sent through Firebase Cloud Messaging (Google), which receives your phone's notification token. Orders from this website are stored in a hosted database.",
          "We do not sell your information and we do not use it for advertising.",
        ],
      },
      {
        heading: "Security",
        body: [
          "Passwords are hashed with a modern algorithm, app sessions use short-lived tokens, and the robot talks to our servers over encrypted connections that check the server's certificate. Every message to and from a robot is signed so tampering can be detected, and each robot can only see its own messages. No system is perfectly secure, but we work to protect your data and fix problems quickly.",
        ],
      },
      {
        heading: "Keeping and deleting your data",
        body: [
          "We keep account data while your account exists. You can delete your account in the app under Settings → Manage Profile & Account → Delete Account. This removes your profile, signs you out everywhere and releases your robots so they can be set up again.",
          `To have your order details removed, contact us at ${EMAIL}. We may keep what the law requires for sales records.`,
        ],
      },
      {
        heading: "Children",
        body: [
          "App accounts are for adults. Children can enjoy Maya with a parent or guardian's account.",
        ],
      },
      {
        heading: "Changes and contact",
        body: [
          "If this policy changes, we update the date above and, for important changes, tell you in the app.",
          `Questions: ${EMAIL} · WhatsApp ${PHONE}`,
        ],
      },
    ],
  },
  bn: {
    title: "প্রাইভেসি পলিসি",
    intro:
      "এই ওয়েবসাইটে মায়া অর্ডার করলে, Just Just Maya অ্যাপ ব্যবহার করলে বা মায়া রোবট চালালে Xentoryx Labs কী তথ্য নেয় আর তা দিয়ে কী করে, সেটা এখানে লেখা আছে।",
    updated: "সর্বশেষ হালনাগাদ: ৬ নভেম্বর ২০২৬",
    sections: [
      {
        heading: "আমরা কারা",
        body: [
          "মায়া, এই ওয়েবসাইট (maya.xentoryxlabs.site), Just Just Maya অ্যাপ আর এদের সার্ভার চালায় Xentoryx Labs, বাংলাদেশ।",
        ],
      },
      {
        heading: "ওয়েবসাইটে অর্ডার",
        body: [
          "অর্ডার করার সময় আমরা আপনার নাম, ফোন নম্বর, ইমেইল, ডেলিভারির ঠিকানা আর কোন এডিশন নিলেন তা নিই। এগুলো শুধু অর্ডার কনফার্ম করা, ডেলিভারি দেওয়া আর অর্ডার নিয়ে যোগাযোগের জন্য ব্যবহার হয়।",
          "টাকা দেবেন ডেলিভারির সময় বা bKash-এ। এই ওয়েবসাইট কখনো আপনার bKash PIN বা কার্ডের তথ্য চায় না।",
        ],
      },
      {
        heading: "অ্যাপ অ্যাকাউন্ট",
        body: [
          "অ্যাপে রেজিস্টার করলে আমরা আপনার নাম, ইমেইল আর পাসওয়ার্ডের hash রাখি। পাসওয়ার্ড কখনো পড়ার মতো অবস্থায় রাখা হয় না। এগুলো দিয়ে সাইন ইন, রোবটকে আপনার সাথে যুক্ত করা আর ইমেইল দিয়ে অন্যের সাথে রোবট শেয়ার করা হয়।",
        ],
      },
      {
        heading: "রোবট থেকে আসা তথ্য",
        body: [
          "রোবট পেয়ার করা থাকলে সেটা আমাদের কাছে কিছু টেকনিক্যাল আর ব্যবহারের তথ্য পাঠায়: ডিভাইস আইডি ও firmware ভার্সন, অনলাইন আছে কিনা, Wi-Fi সিগন্যাল, ফ্রি মেমরি ও কতক্ষণ চলছে, এখনকার মুড ও স্ক্রিন, আবহাওয়ার জন্য আপনার বেছে নেওয়া শহর ও লোকেশন, শেষ করা ফোকাস (Pomodoro) সেশন আর গেমের হাই স্কোর। এগুলো দিয়েই অ্যাপের ড্যাশবোর্ড আর পরিসংখ্যান চলে।",
          "আপনার Wi-Fi-এর নাম আর পাসওয়ার্ড রোবটের ভেতরেই থাকে, নেটওয়ার্কে যুক্ত হওয়ার জন্য। এগুলো আমাদের সার্ভারে পাঠানো হয় না।",
        ],
      },
      {
        heading: "নোটিফিকেশন ফরওয়ার্ডিং",
        body: [
          "আপনি নিজে চালু করলে আর Android-এর notification access দিলে তবেই অ্যাপ আপনার বেছে নেওয়া অ্যাপগুলোর নোটিফিকেশন পড়ে রোবটের স্ক্রিনে দেখায়। এগুলো শুধু রোবটে যায়, আমাদের সার্ভারে জমা থাকে না। যেকোনো সময় বন্ধ করতে বা অ্যাপ বদলাতে পারবেন।",
        ],
      },
      {
        heading: "ফোনের পারমিশন",
        body: [
          "Bluetooth আর nearby-device পারমিশন লাগে রোবট খুঁজে সেটআপ করতে। ক্যামেরা লাগে শুধু রোবটের স্ক্রিনের QR কোড স্ক্যান করতে, ছবি ফোনেই থাকে। লোকেশন দিলে সেটা দিয়ে আবহাওয়ার শহর বাছা হয়।",
        ],
      },
      {
        heading: "যেসব সেবা ব্যবহার করি",
        body: [
          "আপনার অ্যাকাউন্ট আর রোবটের তথ্য আমাদের নিজেদের সার্ভারে থাকে। আবহাওয়া আর শহর খোঁজা আসে Open-Meteo-র পাবলিক সেবা থেকে, আপনার বেছে নেওয়া লোকেশন দিয়ে। ফোনে পুশ নোটিফিকেশন যায় Firebase Cloud Messaging (Google) দিয়ে, যেটা আপনার ফোনের নোটিফিকেশন টোকেন পায়। ওয়েবসাইটের অর্ডার একটা হোস্টেড ডেটাবেসে রাখা হয়।",
          "আমরা আপনার তথ্য বিক্রি করি না, বিজ্ঞাপনেও ব্যবহার করি না।",
        ],
      },
      {
        heading: "নিরাপত্তা",
        body: [
          "পাসওয়ার্ড আধুনিক পদ্ধতিতে hash করা হয়, অ্যাপের সেশন অল্প সময়ের টোকেনে চলে, আর রোবট আমাদের সার্ভারের সাথে encrypted সংযোগে কথা বলে, যেখানে সার্ভারের certificate যাচাই হয়। রোবটের প্রতিটা মেসেজ sign করা থাকে যাতে কেউ বদলালে ধরা পড়ে, আর প্রতিটা রোবট শুধু নিজের মেসেজ দেখতে পায়। কোনো সিস্টেমই পুরোপুরি নিরাপদ না, তবে আমরা তথ্য সুরক্ষায় কাজ করি আর সমস্যা দ্রুত ঠিক করি।",
        ],
      },
      {
        heading: "তথ্য রাখা ও মুছে ফেলা",
        body: [
          "অ্যাকাউন্ট যতদিন আছে, তথ্য ততদিন রাখা হয়। অ্যাপের Settings → Manage Profile & Account → Delete Account থেকে অ্যাকাউন্ট মুছতে পারবেন। এতে প্রোফাইল মুছে যায়, সব জায়গা থেকে সাইন আউট হয়, আর আপনার রোবট আবার সেটআপ করার জন্য মুক্ত হয়।",
          `অর্ডারের তথ্য মুছতে চাইলে ${EMAIL}-এ জানান। বিক্রির হিসাবের জন্য আইন যতটুকু রাখতে বলে, ততটুকু আমরা রাখতে পারি।`,
        ],
      },
      {
        heading: "শিশুরা",
        body: ["অ্যাপ অ্যাকাউন্ট প্রাপ্তবয়স্কদের জন্য। শিশুরা বাবা-মা বা অভিভাবকের অ্যাকাউন্ট দিয়ে মায়ার সাথে খেলতে পারে।"],
      },
      {
        heading: "পরিবর্তন ও যোগাযোগ",
        body: [
          "এই পলিসি বদলালে উপরের তারিখ বদলে দেব, আর বড় পরিবর্তন হলে অ্যাপে জানাব।",
          `প্রশ্ন থাকলে: ${EMAIL} · WhatsApp ${PHONE}`,
        ],
      },
    ],
  },
};

export const TERMS: Record<"en" | "bn", LegalDoc> = {
  en: {
    title: "Terms of Use",
    intro:
      "These terms apply when you order Maya on this website or use a Maya robot and the Just Maya app. By ordering or using them, you agree to these terms.",
    updated: "Last updated: 6 November 2026",
    sections: [
      {
        heading: "What Maya is",
        body: [
          "Maya is a desktop companion robot by Xentoryx Labs. With the app you can set up its Wi-Fi, change its mood and screen, run focus sessions, see statistics, share it with other people and, if you choose, show your phone's notifications on it. Features may be added, changed or removed over time.",
        ],
      },
      {
        heading: "Orders and delivery",
        body: [
          "Prices and editions are shown on this website. You pay on delivery or by bKash. Delivery charges depend on your location and are confirmed with you before delivery. We may cancel an order we cannot fulfil; if you have already paid, you get a full refund.",
          `For any problem with an order, contact us at ${EMAIL} or WhatsApp ${PHONE}.`,
        ],
      },
      {
        heading: "Your account",
        body: [
          "Give correct information, keep your password private and tell us quickly if someone else may have used your account. You are responsible for what happens under your account. You must be old enough to make a binding agreement in your country to hold an account.",
        ],
      },
      {
        heading: "Owning and sharing a robot",
        body: [
          "Claiming a robot links it to your account as its owner. You can invite other MAYA account holders; they can see its status and send everyday commands, but cannot rename it, unlink it or manage sharing. Unlinking frees it to be claimed again. Only claim robots you own or are allowed to manage.",
        ],
      },
      {
        heading: "Fair use",
        body: [
          "Do not use Maya or the app to break the law, harass or spy on anyone, send content you have no right to send, or interfere with our service or other people's robots. Do not try to get into accounts, robots or servers that are not yours, and do not forward other people's private messages to the robot without their consent.",
        ],
      },
      {
        heading: "Firmware updates",
        body: [
          "Maya's firmware may be updated to fix problems or add features. Updates are installed over USB by Xentoryx Labs and may change how Maya works.",
        ],
      },
      {
        heading: "What Maya is not",
        body: [
          "The app and our online services are provided as they are, without warranties beyond what the law requires. Maya is a companion and productivity gadget. It is not a safety, medical or security device or a reliable alarm, so do not rely on it where a failure could cause harm or loss.",
        ],
      },
      {
        heading: "Limits of our liability",
        body: [
          "As far as the law allows, Xentoryx Labs is not liable for indirect or consequential losses, lost data, missed notifications or lost productivity from using Maya or the app. Your rights under Bangladeshi consumer law are not affected.",
        ],
      },
      {
        heading: "Changes and contact",
        body: [
          "We may update these terms as Maya develops. We change the date above when we do, and for important changes we tell you in the app. Using Maya after a change means you accept the new terms.",
          `Questions: ${EMAIL} · WhatsApp ${PHONE}`,
        ],
      },
    ],
  },
  bn: {
    title: "ব্যবহারের শর্তাবলি",
    intro:
      "এই ওয়েবসাইট থেকে মায়া অর্ডার করলে বা মায়া রোবট আর Just Just Maya অ্যাপ ব্যবহার করলে এই শর্তগুলো প্রযোজ্য। অর্ডার বা ব্যবহার করা মানে আপনি এগুলোতে রাজি।",
    updated: "সর্বশেষ হালনাগাদ: ৬ নভেম্বর ২০২৬",
    sections: [
      {
        heading: "মায়া কী",
        body: [
          "মায়া Xentoryx Labs-এর একটা ডেস্ক কম্প্যানিয়ন রোবট। অ্যাপ দিয়ে এর Wi-Fi সেটআপ, মুড ও স্ক্রিন বদলানো, ফোকাস সেশন চালানো, পরিসংখ্যান দেখা, অন্যের সাথে শেয়ার করা, আর চাইলে ফোনের নোটিফিকেশন রোবটে দেখানো যায়। সময়ের সাথে ফিচার যোগ হতে, বদলাতে বা বাদ যেতে পারে।",
        ],
      },
      {
        heading: "অর্ডার ও ডেলিভারি",
        body: [
          "দাম আর এডিশন এই ওয়েবসাইটে দেওয়া আছে। টাকা দেবেন ডেলিভারির সময় বা bKash-এ। ডেলিভারি চার্জ এলাকাভেদে আলাদা, ডেলিভারির আগে আপনাকে জানিয়ে নেওয়া হবে। কোনো অর্ডার পূরণ করতে না পারলে আমরা বাতিল করতে পারি; আগে টাকা দিয়ে থাকলে পুরো টাকা ফেরত পাবেন।",
          `অর্ডার নিয়ে যেকোনো সমস্যায় ${EMAIL} বা WhatsApp ${PHONE}-এ যোগাযোগ করুন।`,
        ],
      },
      {
        heading: "আপনার অ্যাকাউন্ট",
        body: [
          "সঠিক তথ্য দিন, পাসওয়ার্ড গোপন রাখুন, আর অন্য কেউ অ্যাকাউন্ট ব্যবহার করেছে মনে হলে দ্রুত জানান। অ্যাকাউন্টে যা হয় তার দায় আপনার। অ্যাকাউন্ট খুলতে আপনার দেশে চুক্তি করার মতো বয়স হতে হবে।",
        ],
      },
      {
        heading: "রোবটের মালিকানা ও শেয়ার",
        body: [
          "রোবট claim করলে সেটা মালিক হিসেবে আপনার অ্যাকাউন্টে যুক্ত হয়। অন্য MAYA অ্যাকাউন্টধারীদের আমন্ত্রণ জানাতে পারেন; তারা স্ট্যাটাস দেখতে আর সাধারণ কমান্ড পাঠাতে পারবে, কিন্তু নাম বদলানো, unlink বা শেয়ার নিয়ন্ত্রণ করতে পারবে না। Unlink করলে রোবট আবার claim করার জন্য মুক্ত হয়। শুধু নিজের বা যেটা চালানোর অনুমতি আছে, সেই রোবটই claim করুন।",
        ],
      },
      {
        heading: "ন্যায্য ব্যবহার",
        body: [
          "মায়া বা অ্যাপ দিয়ে আইন ভাঙবেন না, কাউকে হয়রানি বা গোপনে নজরদারি করবেন না, এমন কিছু পাঠাবেন না যার অধিকার আপনার নেই, আর আমাদের সেবা বা অন্যের রোবটে বাধা দেবেন না। নিজের নয় এমন অ্যাকাউন্ট, রোবট বা সার্ভারে ঢোকার চেষ্টা করবেন না, আর অনুমতি ছাড়া অন্যের ব্যক্তিগত মেসেজ রোবটে পাঠাবেন না।",
        ],
      },
      {
        heading: "Firmware আপডেট",
        body: [
          "সমস্যা ঠিক করতে বা ফিচার যোগ করতে মায়ার firmware আপডেট হতে পারে। আপডেট Xentoryx Labs USB দিয়ে করে, আর এতে মায়ার কাজের ধরন বদলাতে পারে।",
        ],
      },
      {
        heading: "মায়া যা নয়",
        body: [
          "অ্যাপ আর আমাদের অনলাইন সেবা যেমন আছে তেমনভাবে দেওয়া হয়, আইন যতটুকু বাধ্য করে তার বাইরে কোনো নিশ্চয়তা ছাড়া। মায়া একটা কম্প্যানিয়ন আর প্রোডাক্টিভিটি গ্যাজেট। এটা কোনো নিরাপত্তা, চিকিৎসা বা সিকিউরিটি ডিভাইস বা নির্ভরযোগ্য অ্যালার্ম না, তাই যেখানে ব্যর্থ হলে ক্ষতি হতে পারে সেখানে এর উপর নির্ভর করবেন না।",
        ],
      },
      {
        heading: "আমাদের দায়ের সীমা",
        body: [
          "আইন যতটুকু অনুমতি দেয়, মায়া বা অ্যাপ ব্যবহারে পরোক্ষ ক্ষতি, তথ্য হারানো, নোটিফিকেশন মিস হওয়া বা কাজের ক্ষতির জন্য Xentoryx Labs দায়ী নয়। বাংলাদেশের ভোক্তা অধিকার আইনে আপনার যে অধিকার আছে, তা এতে কমে না।",
        ],
      },
      {
        heading: "পরিবর্তন ও যোগাযোগ",
        body: [
          "মায়া যত এগোবে, এই শর্ত বদলাতে পারে। বদলালে উপরের তারিখ বদলে দেব, আর বড় পরিবর্তন হলে অ্যাপে জানাব। পরিবর্তনের পরেও মায়া ব্যবহার করা মানে নতুন শর্তে রাজি।",
          `প্রশ্ন থাকলে: ${EMAIL} · WhatsApp ${PHONE}`,
        ],
      },
    ],
  },
};
