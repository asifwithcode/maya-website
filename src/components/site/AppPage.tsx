import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import HtmlLang from "@/components/site/HtmlLang";
import { LangProvider } from "@/components/site/i18n";
import { pathFor } from "@/components/site/paths";
import { APP_RELEASE } from "@/lib/app-release";

const WA = "+880 1892-126867";
const EMAIL = "xentoryxlabs@gmail.com";

const TEXT = {
  bn: {
    eyebrow: "Xentoryx Labs · মায়া",
    title: "MAYA Companion অ্যাপ",
    intro: "মায়াকে Wi‑Fi-তে যুক্ত করা, মুড আর স্ক্রিন বদলানো, ফোকাস সেশন চালানো আর ফোনের নোটিফিকেশন মায়ার স্ক্রিনে দেখানোর অ্যাপ।",
    download: "অ্যান্ড্রয়েডের জন্য ডাউনলোড",
    meta: `ভার্সন ${APP_RELEASE.version} · Android ${APP_RELEASE.minAndroid} বা নতুন · ${APP_RELEASE.sizeMb} MB`,
    ios: "iPhone-এর অ্যাপ এখনো আসেনি।",
    stepsTitle: "কীভাবে ইন্সটল করবেন",
    steps: [
      "উপরের ডাউনলোড বোতামে চাপুন। APK ফাইলটা ফোনে নামবে।",
      "ফাইলটা খুলুন। ফোন যদি অজানা উৎস থেকে অ্যাপ ইন্সটলের অনুমতি চায়, অনুমতি দিন (Settings → Install unknown apps → আপনার ব্রাউজার)।",
      "Install চাপুন। তারপর অ্যাপ খুলে একটা অ্যাকাউন্ট বানান।",
      "মায়াকে USB-C দিয়ে চালু করুন। মায়ায় T2 (ডান পা) চেপে মেনু খুলুন, T2 চাপতে চাপতে Setup-এ গিয়ে T1 চাপুন। তারপর অ্যাপে Pair a Maya চেপে মায়াকে বাছুন আর Wi‑Fi পাঠান।",
    ],
    guide: "Bluetooth ও Wi‑Fi সেটআপের পুরো গাইড",
    helpTitle: "সাহায্য লাগলে",
    help: `ইন্সটল বা সেটআপে আটকে গেলে WhatsApp (${WA}) বা ${EMAIL}-এ জানান।`,
  },
  en: {
    eyebrow: "Xentoryx Labs · Maya",
    title: "The MAYA Companion app",
    intro: "Connect Maya to Wi‑Fi, change her mood and screen, run focus sessions and show your phone’s notifications on her screen.",
    download: "Download for Android",
    meta: `Version ${APP_RELEASE.version} · Android ${APP_RELEASE.minAndroid} or newer · ${APP_RELEASE.sizeMb} MB`,
    ios: "There is no iPhone app yet.",
    stepsTitle: "How to install",
    steps: [
      "Tap the download button above. The APK file downloads to your phone.",
      "Open the file. If your phone asks to allow installing apps from this source, allow it (Settings → Install unknown apps → your browser).",
      "Tap Install, then open the app and create an account.",
      "Power Maya with the USB-C cable. On Maya tap T2 (right foot) to open the menu, tap T2 until Setup and tap T1. Then tap Pair a Maya in the app, pick your Maya and send your Wi‑Fi.",
    ],
    guide: "Full Bluetooth & Wi‑Fi setup guide",
    helpTitle: "Need help?",
    help: `If installing or setup gets stuck, message us on WhatsApp (${WA}) or email ${EMAIL}.`,
  },
} as const;

/** /app (Bangla) and /en/app: what the app does and how to install it. The QR code in the
 *  quick-start booklet opens this page; the APK downloads only when the visitor taps the button. */
export default function AppPage({ lang }: { lang: "bn" | "en" }) {
  const t = TEXT[lang];
  const other = lang === "bn" ? "en" : "bn";
  return (
    <LangProvider lang={lang}>
      <HtmlLang lang={lang} />
      <Nav home={false} />

      <main className="bg-[#f5f5f7] px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-[760px]">
          <section className="rounded-[28px] bg-white px-6 py-12 text-center sm:px-14">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[22px] bg-[#1d1d1f] text-white">
              <svg viewBox="0 0 24 24" className="h-9 w-9" fill="currentColor" aria-hidden>
                <circle cx="8.5" cy="12" r="2.6" />
                <circle cx="15.5" cy="12" r="2.6" />
              </svg>
            </div>
            <p className="mt-6 text-[13px] font-medium text-[#0071e3]">{t.eyebrow}</p>
            <h1 className="mt-1 text-[34px] font-semibold tracking-tight text-[#1d1d1f] sm:text-[48px]">{t.title}</h1>
            <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-relaxed text-[#6e6e73] sm:text-[19px]">{t.intro}</p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <a href={APP_RELEASE.file} download className="btn-primary">
                {t.download}
              </a>
              <p className="text-[13px] text-[#86868b]">{t.meta}</p>
              <p className="text-[13px] text-[#86868b]">{t.ios}</p>
            </div>
          </section>

          <section className="mt-5 rounded-[28px] bg-white px-6 py-10 sm:px-14">
            <h2 className="text-[24px] font-semibold tracking-tight text-[#1d1d1f]">{t.stepsTitle}</h2>
            <ol className="mt-6 space-y-5">
              {t.steps.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0071e3] text-[14px] font-semibold text-white">
                    {lang === "bn" ? "১২৩৪"[i] : i + 1}
                  </span>
                  <p className="pt-1 text-[16px] leading-relaxed text-[#1d1d1f]">{s}</p>
                </li>
              ))}
            </ol>
            <Link href={`${pathFor(lang, "docs")}#pairing`} className="link-more mt-6 inline-block">
              {t.guide} <span aria-hidden>›</span>
            </Link>
          </section>

          <section className="mt-5 rounded-[28px] bg-white px-6 py-8 sm:px-14">
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">{t.helpTitle}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{t.help}</p>
          </section>

          <p className="mt-6 text-center text-[13px]">
            <Link href={pathFor(other, "app")} className="text-[#0071e3] hover:underline">
              {lang === "bn" ? "Read in English →" : "বাংলায় পড়ুন →"}
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </LangProvider>
  );
}
