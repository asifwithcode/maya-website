import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import HtmlLang from "@/components/site/HtmlLang";
import MayaFace from "@/components/site/MayaFace";
import PrintButton from "@/components/site/PrintButton";
import { GAMES, MOODS, SPECS } from "@/components/site/data";
import { LangProvider } from "@/components/site/i18n";
import { APP_RELEASE } from "@/lib/app-release";

export const metadata: Metadata = {
  title: "Maya User Guide, Software & Comprehensive Troubleshooting | Xentoryx",
  description:
    "Complete technical guide for Maya desktop companion: unboxing, BLE pairing, dual capacitive touch controls, 8 moods, 10 menu screens, 7 arcade games, firmware updates, and comprehensive troubleshooting tips.",
  alternates: { canonical: "/en/docs", languages: { bn: "/docs", en: "/en/docs", "x-default": "/docs" } },
};

const TOC = [
  ["apps", "Software & Apps"],
  ["start", "Quick Start Guide"],
  ["controls", "Touch Controls & Gestures"],
  ["moods", "Moods & Personality"],
  ["menu", "Carousel Menu & Screens"],
  ["games", "Arcade Games"],
  ["pairing", "BLE Pairing & Wi-Fi"],
  ["accessories", "Accessories & Modular Snaps"],
  ["firmware", "Firmware Updates"],
  ["reset", "Factory Reset"],
  ["care", "Care & Maintenance"],
  ["specs", "Technical Specifications"],
  ["help", "Troubleshooting & FAQs"],
] as const;

const CONTROLS: { action: string; face: string; screens: string; tag: string }[] = [
  {
    action: "Tap T1 (Left Foot)",
    face: "Pet her! Cycles Happy, Wink, Adore, and Laugh expressions with Bangla dialogue.",
    screens: "Select item, Jump (Dino), Flap (Flappy), Fire (Shooter), Drop (Stack), Lap (Stopwatch).",
    tag: "Primary Tap",
  },
  {
    action: "Rapid Tap T1 (3–4 times)",
    face: "She gets annoyed with dizzy eyes and shakes her head.",
    screens: "—",
    tag: "Gesture",
  },
  {
    action: "Rapid Tap T1 (5+ times)",
    face: "She gets angry! Eyes burst with fury and she demands you stop poking her.",
    screens: "—",
    tag: "Gesture",
  },
  {
    action: "Hold T1 for 800 ms",
    face: "Deep affection reaction! Animated beating hearts and romantic eye glow.",
    screens: "—",
    tag: "Hold",
  },
  {
    action: "Tap T2 (Right Foot)",
    face: "Opens the 3D glowing carousel menu.",
    screens: "Menu: Step to next screen. Inside screens: Back / cancel.",
    tag: "Menu / Nav",
  },
  {
    action: "Hold T1 for 1.0 s",
    face: "—",
    screens: "Exit active screen or quit current arcade minigame back to menu.",
    tag: "Exit",
  },
  {
    action: "Hold T2 for 1.0 s",
    face: "—",
    screens: "Exit arcade games list back to main carousel menu.",
    tag: "Back",
  },
  {
    action: "Hold T1 + T2 together (1.8 s)",
    face: "Interactive Sleep Mode! Kawaii sleeping eyes, breathing glow, floating Zzz & stars.",
    screens: "Wakes Maya up instantly or puts her into gentle sleep from any screen.",
    tag: "Dual Touch",
  },
  {
    action: "ESP32 BOOT Button (Base)",
    face: "Hardware system restart / warm reboot.",
    screens: "Hardware system restart / warm reboot.",
    tag: "Hardware",
  },
];

const MENU_DETAILS = [
  {
    title: "1. Maya Face & Living Eyes",
    subtitle: "Active Companion Mode",
    desc: "The primary personality view featuring real-time parametric RoboEyes, realistic glancing, auto blinking, and touch-reactive emotions. Autonomous expression engine shifts moods periodically.",
  },
  {
    title: "2. Digital Clock & Calendar",
    subtitle: "NTP Internet Synchronized",
    desc: "Clean neon cyber aesthetic clock showing 12/24-hour time, day, and date. Automatically synchronizes with international time servers over Wi-Fi without manual adjustments.",
  },
  {
    title: "3. Live Weather & Forecast",
    subtitle: "Real-time City Metrics",
    desc: "Displays current outdoor temperature, weather condition icons (sunny, rainy, cloudy, stormy), relative humidity percentage, and target location set via the mobile app.",
  },
  {
    title: "4. Phone Notification Relay",
    subtitle: "Mirrored Alerts",
    desc: "Displays the 5 most recent alerts received on your connected Android device (calls, SMS, WhatsApp, reminders). Never miss an important alert while working.",
  },
  {
    title: "5. Pomodoro Focus Timer",
    subtitle: "Productivity Arc Engine",
    desc: "Standard 25-minute focused sprint followed by a 5-minute restorative break. Displayed with an animated glowing neon progress arc and subtle completion pulses.",
  },
  {
    title: "6. Stopwatch & Lap Counter",
    subtitle: "Millisecond Precision",
    desc: "High-precision timer for workout laps, sprints, or study pacing. Tap T1 to start, pause, or record new lap splits; tap T2 to reset.",
  },
  {
    title: "7. Focus Productivity Stats",
    subtitle: "Daily & Weekly Telemetry",
    desc: "Visual summary of your deep work minutes accumulated today and over the current week, helping you maintain productive study or coding streaks.",
  },
  {
    title: "8. Mini Games (Retro Arcade)",
    subtitle: "7 Built-in 60 FPS Games",
    desc: "Built-in arcade suite featuring Dino, Flappy, Space Shooter, Tower Stack, Circle Pong, Reflex Rush, and Brick Breaker with persistent high scores.",
  },
  {
    title: "9. System Info & Diagnostics",
    subtitle: "Hardware Telemetry",
    desc: "Real-time hardware status monitor showing Wi-Fi SSID, RSSI signal strength dBm, local IP address, available RAM heap, system uptime, and active firmware version.",
  },
  {
    title: "10. Setup / Factory Reset",
    subtitle: "Device Onboarding & Memory Wipe",
    desc: "Shows BLE pairing QR code before initial configuration. Once claimed, this screen converts into a safety-locked factory reset utility with hold-to-wipe confirmation.",
  },
];

const GAME_DETAILS = [
  {
    id: "dino",
    name: "Maya Dino Runner",
    genre: "Infinite Runner",
    controls: "Tap T1 to Jump",
    desc: "Help Dino leap over desert cacti and obstacles under cycling sun and moon lighting. Speed progressively accelerates.",
  },
  {
    id: "flappy",
    name: "Flappy Maya",
    genre: "Endless Tapper",
    controls: "Tap T1 to Flap",
    desc: "Fly through narrow gaps between floating obstacles. Precision timing is required as physics gravity pulls Maya downward.",
  },
  {
    id: "shooter",
    name: "Space Shooter",
    genre: "Retro Arcade",
    controls: "Tap T1 to Fire Lasers",
    desc: "Defend Maya's orbital station by blasting descending alien invaders and asteroid hazards with rapid-fire energy lasers.",
  },
  {
    id: "stack",
    name: "Tower Stack",
    genre: "Physics Timing",
    controls: "Tap T1 to Drop Block",
    desc: "Align horizontally oscillating blocks to construct the tallest skyscraper possible. Overhanging overhangs are sliced off!",
  },
  {
    id: "pong",
    name: "Circle Pong",
    genre: "360° Circular Action",
    controls: "Tap T1 to Reverse Paddle",
    desc: "Designed specifically for Maya's circular display! Keep the bouncing photon particle trapped inside the circular ring by reversing paddle direction.",
  },
  {
    id: "reflex",
    name: "Reflex Rush",
    genre: "Speed Reaction",
    controls: "Tap T1 on Flash",
    desc: "Test your human reaction speed down to the millisecond. Wait for the neon target to flash and strike T1 instantly.",
  },
  {
    id: "brick",
    name: "Brick Breaker",
    genre: "Classic Breakout",
    controls: "Tap T1 to Guide Paddle",
    desc: "Bounce the power orb to shatter multilayer neon brick barricades without letting the ball slip past your defensive paddle.",
  },
];

const TROUBLESHOOTING_CATEGORIES = [
  {
    category: "Power, Screen & Boot Issues",
    badge: "Hardware & Power",
    items: [
      {
        q: "The screen stays completely black and nothing turns on",
        a: "Ensure you are using a reliable 5V USB charger capable of delivering at least 1.0A (1000mA). Thin, cheap, or charge-only USB cables often cause voltage drops below the 4.7V required by the ESP32-C3 and GC9A01 display. Try a certified USB-C data cable and connect directly to a dedicated wall adapter or USB 3.0 port.",
      },
      {
        q: "Maya keeps rebooting in an endless loop (bootloop / brownout restart)",
        a: "Bootloops are almost always caused by insufficient current during Wi-Fi transmission bursts (where the ESP32 radio pulls up to 350mA peak). If powered via an unpowered USB hub, weak PC front-panel port, or long extension cable, brownout protection restarts the chip. Switch to a standard 5V / 2A phone charging brick.",
      },
      {
        q: "The display backlight lights up white/grey, but no face or graphics appear",
        a: "A blank illuminated screen indicates the display has power but SPI communication did not initialize cleanly. Unplug the USB-C cable, wait 5 seconds, and firmly reconnect it. If it still shows nothing, contact us on WhatsApp (+880 1892-126867) or at xentoryxlabs@gmail.com.",
      },
      {
        q: "Maya froze or is completely unresponsive to touch",
        a: "You can trigger a hardware reset without unplugging by momentarily pressing the micro BOOT button located on the ESP32 module (accessible near the rear/base). Alternatively, disconnect and reconnect the USB-C power supply.",
      },
    ],
  },
  {
    category: "Touch Sensors & Gestures",
    badge: "Capacitive Input",
    items: [
      {
        q: "Touch pads do nothing right after plugging in Maya",
        a: "This is completely normal and intentional. The TTP223 capacitive touch controllers execute an automatic baseline calibration for the first 3 seconds after receiving power. Keep your fingers completely off Maya's body and feet during this period. Once she waves hello and opens her eyes, touch inputs are active.",
      },
      {
        q: "Random phantom touches or ghost triggers happen by themselves",
        a: "Capacitive sensors are sensitive to electrical noise. Common causes include: using an ungrounded laptop power adapter, running on an unshielded noisy cheap charger, or placing Maya directly on a conductive metal desk mat. Place Maya on a clean, dry, non-conductive surface (wood, plastic, or cloth mousepad) and use a grounded power source.",
      },
      {
        q: "Touch pad feels insensitive or requires multiple taps to register",
        a: "Touch pads are located inside the left (T1) and right (T2) foot pads. Ensure you make firm, flat contact with the fleshy pad of your finger rather than just a fingernail tip. Also ensure your hands and the base are dry.",
      },
      {
        q: "Dual-touch sleep mode (T1 + T2 hold) is difficult to trigger",
        a: "Both T1 (left foot) and T2 (right foot) must be touched at the exact same moment and held continuously for 1.8 seconds. When held together, a circular progress ring will animate around the center. Hold steady until the ring completes 100%. Letting go before 1.8s cancels the sleep trigger.",
      },
    ],
  },
  {
    category: "Wi-Fi & Network Connectivity",
    badge: "Wireless Networking",
    items: [
      {
        q: "My home Wi-Fi network does not show up during setup",
        a: "Maya's ESP32-C3 hardware radio operates exclusively on 2.4 GHz (802.11 b/g/n). It does not support 5 GHz Wi-Fi frequencies. If your router uses a combined single SSID with band steering, temporarily enable a dedicated 2.4 GHz Wi-Fi network or guest network in your router settings.",
      },
      {
        q: "Wi-Fi connection fails or drops connection frequently",
        a: "Verify that your Wi-Fi password does not contain unsupported high-byte Unicode characters. Maya connects to standard WPA / WPA2-Personal networks; 802.1X Enterprise networks (such as university or corporate networks requiring a username and certificate) and public captive portal login pages are not supported.",
      },
      {
        q: "Can I set up Wi-Fi without the app?",
        a: "No. Maya gets your Wi-Fi only from the Maya Android app, over Bluetooth. If you don't have an Android phone, borrow one for the setup: once Maya is online she works without it.",
      },
      {
        q: "Can Maya be used completely without any Wi-Fi connection?",
        a: "Yes, 100%! Maya's animated eyes, 8 emotional moods, petting interactions, Bangla cards, Pomodoro focus timer, stopwatch, and all 7 arcade minigames run entirely on-device without internet. Wi-Fi is only required for live weather updates, NTP time synchronization, and phone notifications.",
      },
    ],
  },
  {
    category: "Mobile App & Bluetooth LE Pairing",
    badge: "Bluetooth & App",
    items: [
      {
        q: "The Maya App cannot discover Maya during scanning",
        a: "1) Ensure Bluetooth and Location services ('Nearby Devices' permission on Android 12+) are turned ON with all permissions granted. 2) Open Maya's pairing screen: tap T2 to open the menu, tap T2 until Setup, then tap T1 (see BLE Pairing & Wi-Fi Setup). 3) Keep your phone within 1 meter of Maya during discovery.",
      },
      {
        q: "Pairing fails, hangs at 'Connecting', or times out",
        a: "Open your Android device's system Bluetooth settings. If you previously paired Maya, locate 'MAYA' or 'ESP32' in the paired devices list and tap 'Forget / Unpair'. Then restart the Maya App, open Setup on Maya again from the menu, and retry.",
      },
      {
        q: "Wi-Fi details won't send to Maya over Bluetooth",
        a: "1) Open your phone's Bluetooth settings, find 'MAYA' in the paired devices list and tap 'Forget / Unpair'. 2) Turn Bluetooth off, wait a few seconds, then turn it back on. 3) Open the Maya App again and resend your Wi-Fi details. This clears a stale Bluetooth bond, which is the most common cause.",
      },
      {
        q: "Phone notifications are not arriving on Maya's display",
        a: "1) Ensure the Maya App has 'Notification Access' enabled in Android Settings > Apps > Special App Access > Notification Access. 2) Ensure Android battery optimization is set to 'Unrestricted' for Maya so background sync isn't killed. 3) Ensure Bluetooth remains connected between your phone and Maya.",
      },
    ],
  },
  {
    category: "Time, Weather & Sync Metrics",
    badge: "Data Sync",
    items: [
      {
        q: "The clock shows 00:00 or the wrong date/time",
        a: "Maya gets accurate time from international NTP (Network Time Protocol) servers over the internet. Check Menu > System Info to confirm Wi-Fi status is 'CONNECTED'. By default, Maya synchronizes to UTC+6 (Bangladesh Standard Time). You can configure local timezone offset via the mobile app.",
      },
      {
        q: "Live Weather displays '--' or shows the wrong city",
        a: "Weather data is retrieved from weather services via the internet. Open the Maya App, navigate to Settings, enter your correct city name (e.g., 'Dhaka', 'Chittagong'), and save. Maya updates weather within 60 seconds.",
      },
      {
        q: "Pomodoro focus stats did not sync with the app",
        a: "Maya logs focus statistics locally and pushes telemetry whenever Bluetooth or MQTT connection is active. Ensure your phone is in range or Maya is connected to Wi-Fi to sync daily study minutes.",
      },
    ],
  },
  {
    category: "Firmware Updates",
    badge: "Support",
    items: [
      {
        q: "How do I update Maya's firmware?",
        a: "You don't need to. Firmware updates are done by Xentoryx Labs over USB. If an update is released that you need, or Maya is not working right, contact us on WhatsApp (+880 1892-126867) or at xentoryxlabs@gmail.com and we will update her for you.",
      },
      {
        q: "Will an update erase my Wi-Fi or high scores?",
        a: "No. A normal update keeps your Wi-Fi, game high scores, Maya's name and her pairing with your app.",
      },
    ],
  },
  {
    category: "Accessories, Shell & Hardware Care",
    badge: "Physical Care",
    items: [
      {
        q: "An accessory (ears, crown, sprout) feels loose or wobbles",
        a: "Maya's accessories are precision-engineered to fit friction-fit socket mounts without adhesives. Align the accessory pin with the top socket and push straight down until it seats flush. If 3D printed tolerance feels loose over time, adding a tiny strip of paper tape to the accessory pin provides a snug fit.",
      },
      {
        q: "The back of Maya feels slightly warm to the touch",
        a: "Mild warmth around the lower rear housing is completely normal. The ESP32-C3 dual-core processor, Wi-Fi radio, and IPS display backlight draw approximately 0.8W–1.2W during continuous operation.",
      },
      {
        q: "Can I leave Maya plugged in 24/7 on my desk?",
        a: "Yes! Maya was specifically engineered as an always-on desktop companion. She features thermal throttled power management and interactive sleep mode to minimize display wear when not in active use.",
      },
    ],
  },
];

function H2({ id, n, children }: { id: string; n?: number; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight sm:text-3xl text-[#1d1d1f]">
      {n !== undefined && (
        <span className="mr-3 font-mono text-xl font-bold text-[#0071e3]">[{String(n).padStart(2, "0")}]</span>
      )}
      {children}
    </h2>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <section className="border-t border-black/10 py-12 first:border-0 first:pt-0 print:break-inside-avoid">{children}</section>;
}

const P = "mt-4 max-w-2xl leading-relaxed text-black/75 font-mono text-xs";

export default function DocsPage() {
  return (
    <LangProvider lang="en">
      <div className="print:hidden">
        <HtmlLang lang="en" />
        <Nav home={false} />
      </div>

      <header className="bg-[#f5f5f7] pb-14 pt-28 print:bg-white print:pt-0 border-b border-black/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:px-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#0071e3]">
              <span className="h-2 w-2 rounded-full bg-[#0071e3]" />
              <span>Official Technical Manual & Software Suite · Firmware v1.0.0</span>
            </div>
            <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1d1d1f]">
              Getting to know <span className="text-[#0071e3]">Maya</span>
            </h1>
            <p className="mt-4 max-w-xl text-base sm:text-lg text-black/70 font-mono text-xs leading-relaxed">
              Comprehensive handbook covering hardware setup, BLE pairing, capacitive foot touch gestures, 8 moods, 10 UI screens, 7 arcade games, and full diagnostic troubleshooting.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="rounded-full border border-black/20 bg-white px-4 py-2 font-mono text-xs font-bold text-[#1d1d1f] transition hover:bg-[#e8e8ed]"
            >
              বাংলা গাইড পড়ুন →
            </Link>
            <PrintButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-8 lg:grid-cols-[14rem_1fr]">
        <aside className="print:hidden">
          <nav className="sticky top-24 hidden lg:block" aria-label="On this page">
            <div className="font-mono text-xs font-bold text-black/40">Documentation Index</div>
            <ol className="mt-4 space-y-2 text-sm">
              {TOC.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="font-mono text-xs text-black/70 transition-colors hover:text-[#0071e3]">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <details className="rounded-2xl border border-black/10 p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold font-mono">Table of Contents</summary>
            <ol className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
              {TOC.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-black/70 hover:text-[#0071e3]">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </aside>

        <article className="min-w-0">

          {/* Section: Official Apps Download */}
          <Section>
            <div id="apps" className="scroll-mt-24 space-y-6">
              <div className="rounded-3xl border border-black/15 bg-[#f5f5f7] p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4 mb-6">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#0071e3]">
                      Software Ecosystem
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mt-1">
                      Download Official Companion Apps
                    </h2>
                  </div>
                  <span className="self-start rounded-full bg-[#1d1d1f] px-3 py-1 font-mono text-[11px] font-bold text-white">
                    v{APP_RELEASE.version}
                  </span>
                </div>

                <div className="grid max-w-xl gap-6">
                  {/* Android Companion */}
                  <div className="flex flex-col justify-between rounded-2xl border border-black/10 bg-[#ffffff] p-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] font-bold text-black/50">Mobile Companion</span>
                        <span className="font-mono text-[10px] font-bold text-[#0071e3]">Android 7.0+</span>
                      </div>
                      <h3 className="font-bold text-xl text-[#1d1d1f]">Maya for Android</h3>
                      <p className="font-mono text-xs text-black/70 mt-2 leading-relaxed">
                        Instant Bluetooth LE scanning and pairing, 2.4 GHz Wi-Fi provisioning, realtime notification relay (WhatsApp, SMS, calls), mood customization, and focus analytics.
                      </p>
                    </div>
                    <div className="mt-6">
                      <a
                        href={APP_RELEASE.file}
                        download
                        className="flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 font-mono text-xs font-bold text-white shadow-sm transition hover:bg-[#0071e3] hover:text-black"
                      >
                        <span>↓ Download APK Package</span>
                        <span className="text-[10px] opacity-70">28 MB</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Section: Quick Start */}
          <Section>
            <H2 id="start" n={1}>Quick Start Guide</H2>
            <p className={P}>
              Maya is ready to run right out of the box with zero complex assembly. Follow these four foundational steps:
            </p>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "1. Power Connection",
                  "Connect the included USB-C cable to any regulated 5V / 1A+ charger. Maya has no internal battery and is engineered as an always-on desktop companion.",
                ],
                [
                  "2. Sensor Auto-Calibration",
                  "Keep your hands off her body for the first 3 seconds after plugging in. Her dual capacitive sensors calibrate their baseline capacitance during boot.",
                ],
                [
                  "3. Interactive Greeting",
                  "Maya waves hello on her 240x240 circular IPS screen, opens her living eyes, and begins glancing around your workspace.",
                ],
                [
                  "4. Mobile BLE Pairing",
                  "Open the Maya app, tap 'Pair a Maya', pick your Maya from the list (or scan the QR on her Setup screen) and send her your 2.4 GHz Wi-Fi.",
                ],
              ].map(([t, d], i) => (
                <li key={t} className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-5 flex flex-col justify-between">
                  <div>
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-[#1d1d1f] text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    <div className="mt-3 font-bold text-sm text-[#1d1d1f]">{t}</div>
                    <p className="mt-2 text-xs font-mono leading-relaxed text-black/70">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-2xl border border-[#0071e3]/30 bg-[#0071e3]/5 p-5 font-mono text-xs text-black/80">
              <span className="font-bold text-[#0071e3]">Offline Freedom Note:</span> Wi-Fi is completely optional! Maya&apos;s living eyes, 8 emotional moods, petting responses, Pomodoro timer, stopwatch, and 7 arcade minigames work 100% offline. Connecting to Wi-Fi adds real-time internet weather, automatic NTP clock synchronization, and mobile notification relay.
            </div>
          </Section>

          {/* Section: Touch Controls */}
          <Section>
            <H2 id="controls" n={2}>Touch Controls & Gestures</H2>
            <p className={P}>
              Maya features two ultra-responsive capacitive touch sensors hidden inside her feet. <b className="text-[#1d1d1f]">T1 is located on her left foot</b> and <b className="text-[#1d1d1f]">T2 is on her right foot</b>. A gentle finger touch is all that is needed.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f5f5f7] text-xs font-semibold font-mono text-black/60">
                  <tr>
                    <th className="p-3 sm:p-4">Input Action</th>
                    <th className="p-3 sm:p-4">Tag</th>
                    <th className="p-3 sm:p-4">On Living Face</th>
                    <th className="p-3 sm:p-4">In Screens & Games</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 font-mono text-xs bg-[#ffffff]">
                  {CONTROLS.map((c) => (
                    <tr key={c.action} className="hover:bg-black/5 transition-colors">
                      <td className="p-3 sm:p-4 font-bold text-[#1d1d1f]">{c.action}</td>
                      <td className="p-3 sm:p-4">
                        <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-bold text-black/70">
                          {c.tag}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-black/80">{c.face}</td>
                      <td className="p-3 sm:p-4 text-black/70">{c.screens}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 font-mono text-xs">
              <div className="rounded-xl border border-black/10 bg-[#f5f5f7] p-4">
                <span className="font-bold text-[#1d1d1f]">Dual-Touch Sleep Engine (T1 + T2):</span>
                <p className="mt-1 text-black/70 leading-relaxed">
                  Hold both feet simultaneously for 1.8 seconds. A circular progress ring fills up. When complete, Maya enters interactive sleep with peaceful breathing, glowing Zzz, and twinkling stars. Repeat to wake her up!
                </p>
              </div>
              <div className="rounded-xl border border-black/10 bg-[#f5f5f7] p-4">
                <span className="font-bold text-[#1d1d1f]">Pairing screen (Setup):</span>
                <p className="mt-1 text-black/70 leading-relaxed">
                  Tap T2 to open the menu, keep tapping T2 to the last item, <b>Setup</b>, and tap T1. Setup is in the menu until Maya is set up; after that its place shows Reset Device.
                </p>
              </div>
            </div>
          </Section>

          {/* Section: Moods */}
          <Section>
            <H2 id="moods" n={3}>Moods & Living Personality</H2>
            <p className={P}>
              Maya is powered by an autonomous procedural eye engine with realistic saccades, pupil dilations, blinks, and eight dynamic emotional states:
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {MOODS.map((m) => (
                <div key={m.id} className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-inner">
                    <MayaFace mood={m.id} className="h-12 w-12" />
                  </div>
                  <div className="mt-3 font-bold text-sm text-[#1d1d1f] capitalize">{m.label}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-[#0071e3] font-semibold">{m.bn}</div>
                  <div className="mt-1 font-mono text-[10px] text-black/60 italic whitespace-pre-line leading-tight">
                    &ldquo;{m.line}&rdquo;
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 font-mono text-xs">
              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-5">
                <div className="font-bold text-sm text-[#1d1d1f] mb-2">Special Personality Behaviors</div>
                <ul className="list-disc space-y-1 pl-5 text-black/70">
                  <li><b>Autonomous Expressions:</b> While idling, Maya cycles between 10 spontaneous facial expressions every 4.5 to 8.5 seconds (Happy, Curious, Winks, Laugh, Shy, Surprised, etc.).</li>
                  <li><b>Long Idle &ldquo;Mon Kharap&rdquo; (Lonely Mode):</b> If left untouched for 75 seconds, Maya gets lonely, blushes shyly, and displays a heartwarming Bangla dialogue card requesting your attention.</li>
                  <li><b>Bangla Dialogue Cards:</b> Every 3rd affectionate pet on T1 triggers a humorous and loving Bangla dialogue message on screen.</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Section: Menu & Screens */}
          <Section>
            <H2 id="menu" n={4}>Carousel Menu & 10 UI Screens</H2>
            <p className={P}>
              Tap <b className="text-[#1d1d1f]">T2 (right foot)</b> to reveal the glowing 3D carousel menu. Each subsequent tap rotates to the next application card. Tap <b className="text-[#1d1d1f]">T1 (left foot)</b> to enter that screen. Inside any screen, hold T1 for 1 second to return.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {MENU_DETAILS.map((m) => (
                <div key={m.title} className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1d1d1f]">{m.title}</span>
                    <span className="rounded bg-black/10 px-2 py-0.5 text-[10px] font-bold text-black/60">
                      {m.subtitle}
                    </span>
                  </div>
                  <p className="mt-2 text-black/70 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Section: Games */}
          <Section>
            <H2 id="games" n={5}>Arcade Games Suite</H2>
            <p className={P}>
              Launch <b className="text-[#1d1d1f]">Mini games</b> from the carousel menu. Cycle through games with T2 and launch with T1. All games run at a fluid 60 FPS and are played using T1. High scores are permanently saved in Maya&rsquo;s onboard flash memory.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {GAME_DETAILS.map((g) => (
                <div key={g.id} className="flex flex-col justify-between rounded-2xl border border-black/10 bg-[#f5f5f7] p-5 font-mono text-xs">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1d1d1f]">{g.name}</span>
                      <span className="rounded-full bg-[#0071e3] px-2.5 py-0.5 text-[10px] font-bold text-black">
                        {g.genre}
                      </span>
                    </div>
                    <p className="mt-2 text-black/70 leading-relaxed">{g.desc}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3">
                    <span className="text-[11px] text-black/50">Control:</span>
                    <span className="rounded bg-[#1d1d1f] px-2.5 py-1 text-[11px] font-bold text-white">
                      {g.controls}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-xs text-black/60">
              <b>Tip:</b> In any game, hold T1 or T2 for 1.0 second to exit back to the arcade menu.
            </p>
          </Section>

          {/* Section: Pairing & Wi-Fi */}
          <Section>
            <H2 id="pairing" n={6}>BLE Pairing & Wi-Fi Setup</H2>
            <p className={P}>
              Maya gets your Wi-Fi from the Maya Android app over Bluetooth. This is the only way to set her up, and it takes about a minute.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2 font-mono text-xs">
              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-6">
                <span className="font-bold text-xs text-[#0071e3]">On Maya</span>
                <h3 className="font-bold text-base text-[#1d1d1f] mt-1">Open the pairing screen</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-4 text-black/75 leading-relaxed">
                  <li>Plug in Maya. A new Maya turns on Bluetooth pairing by herself.</li>
                  <li>Tap <b>T2</b> (right foot) to open the menu.</li>
                  <li>Keep tapping <b>T2</b> until the last item, <b>Setup &middot; PAIR WITH APP</b>.</li>
                  <li>Tap <b>T1</b> (left foot). Maya shows <b>PAIR WITH APP</b>, her Bluetooth name and a QR code. Leave her on this screen: touching a foot closes it.</li>
                </ol>
              </div>

              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-6">
                <span className="font-bold text-xs text-[#0071e3]">In the app</span>
                <h3 className="font-bold text-base text-[#1d1d1f] mt-1">Pair and send your Wi-Fi</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-4 text-black/75 leading-relaxed">
                  <li>Install the app from <a href="/en/app" className="text-[#0071e3] underline">themaya.site/app</a> and sign in.</li>
                  <li>On the dashboard tap <b>Pair a Maya</b>. Allow Bluetooth, Location and Nearby devices when asked.</li>
                  <li>Under <b>Discovered Maya Devices</b> tap your Maya, or tap <b>Scan Maya QR Code</b> and scan the QR on her screen.</li>
                  <li>Accept the Bluetooth <b>pairing request</b> on your phone.</li>
                  <li>Pick your 2.4 GHz Wi-Fi (or enter it manually), type the password and tap <b>Send Wi-Fi to Maya</b>.</li>
                  <li>Maya shows <b>CONNECTING</b>, then <b>HELLO</b>. The app says <b>Maya is Ready to Explore!</b></li>
                </ol>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-black/10 bg-[#ffffff] p-4 font-mono text-xs text-black/70 leading-relaxed">
              <b>Already set up?</b> Setup is no longer in the menu. If Maya can&rsquo;t reach her saved Wi-Fi for 90 seconds after you plug her in (new router or password), she turns on Bluetooth pairing by herself: pair again from the app. To give Maya to someone else, use <b>Reset Device</b> first.
            </div>

            <div className="mt-4 rounded-xl border border-black/10 bg-[#ffffff] p-4 font-mono text-xs text-black/70">
              <b>Wi-Fi Specifications:</b> 2.4 GHz only (802.11 b/g/n, HT20, WPA/WPA2-PSK). 5 GHz Wi-Fi and enterprise networks requiring username/password authentication are not supported.
            </div>
          </Section>

          {/* Section: Accessories */}
          <Section>
            <H2 id="accessories" n={7}>Accessories & Modular Snaps</H2>
            <p className={P}>
              Maya is fully modular. Her bunny ears, panda ears, royal crown, sprout, DJ headphones, and mini backpack snap in smoothly with snug friction mounts:
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3 font-mono text-xs">
              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-4">
                <div className="font-bold text-sm text-[#1d1d1f]">1. Installing</div>
                <p className="mt-1 text-black/70 leading-relaxed">
                  Align the accessory base pin with the socket on Maya&rsquo;s head (or rear socket for the backpack) and push straight down until flush.
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-4">
                <div className="font-bold text-sm text-[#1d1d1f]">2. Swapping</div>
                <p className="mt-1 text-black/70 leading-relaxed">
                  Grip the accessory firmly and pull straight upward. Avoid twisting side-to-side to protect the 3D-printed alignment pins.
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-4">
                <div className="font-bold text-sm text-[#1d1d1f]">3. Small parts</div>
                <p className="mt-1 text-black/70 leading-relaxed">
                  The accessories are small. Keep them away from children under 3 years old.
                </p>
              </div>
            </div>
          </Section>

          {/* Section: Firmware */}
          <Section>
            <H2 id="firmware" n={8}>Firmware Updates</H2>
            <p className={P}>
              You never have to install anything on a computer. Maya&rsquo;s firmware is updated by Xentoryx Labs over USB.
              If a new update is out or Maya is not behaving as she should, get in touch:
            </p>
            <ul className="mt-5 max-w-2xl list-disc space-y-2 pl-5 font-mono text-xs text-black/70">
              <li>WhatsApp: <b>+880 1892-126867</b></li>
              <li>Email: <b>xentoryxlabs@gmail.com</b></li>
            </ul>
            <p className="mt-3 font-mono text-xs text-black/60">
              A normal update keeps your Wi-Fi, high scores and Maya&rsquo;s name.
            </p>
          </Section>

          {/* Section: Reset */}
          <Section>
            <H2 id="reset" n={9}>Factory Reset Procedure</H2>
            <p className={P}>
              A factory reset completely wipes stored Wi-Fi credentials, Bluetooth bonds, custom robot names, and game high scores, returning Maya to out-of-the-box factory state:
            </p>
            <ol className="mt-5 max-w-2xl list-decimal space-y-2 pl-5 font-mono text-xs text-black/70">
              <li>Tap T2 (right foot) to open the menu and step to <b>Reset device</b>.</li>
              <li>Tap T1 (left foot) to open the reset confirmation view.</li>
              <li>
                <b className="text-[#1d1d1f]">Hold T1 continuously for 1.5 seconds</b>. A numeric percentage counter counts from 0% to 100% while the glowing ring sweeps closed.
              </li>
              <li>Release once 100% is reached. Maya clears her flash memory partitions and reboots into clean setup mode.</li>
            </ol>
            <p className="mt-3 font-mono text-xs text-black/60">
              <b>Cancel:</b> Releasing T1 before 1.5 seconds or tapping T2 instantly cancels the reset and returns to the menu.
            </p>
          </Section>

          {/* Section: Care */}
          <Section>
            <H2 id="care" n={10}>Care & Maintenance</H2>
            <ul className="mt-5 max-w-2xl list-disc space-y-2 pl-5 font-mono text-xs text-black/70">
              <li><b>Power Standard:</b> Always use a regulated 5V USB power supply (1A to 2.4A). Never connect high-voltage non-standard adapters.</li>
              <li><b>Heat Sensitivity:</b> Maya&rsquo;s chassis is crafted from high-precision matte PLA. Keep her away from direct summer sunlight, radiators, or hot parked cars. PLA begins softening above 50 °C (122 °F).</li>
              <li><b>Display Cleaning:</b> Wipe the circular glass display with a clean, dry microfiber cloth. Avoid spraying water or chemical solvents directly onto the device.</li>
              <li><b>Chassis Care:</b> Dust the body with a soft dry nylon brush. Never submerge in water or place in damp environments like bathrooms.</li>
              <li><b>Child Safety:</b> Not suitable for unsupervised children under 3 years due to small accessories.</li>
            </ul>
          </Section>

          {/* Section: Specs */}
          <Section>
            <H2 id="specs" n={11}>Technical Specifications</H2>
            <dl className="mt-6 divide-y divide-black/10 border-y border-black/10 font-mono text-xs">
              {SPECS.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr]">
                  <dt className="font-bold text-[#1d1d1f]">{k}</dt>
                  <dd className="text-black/70">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* Section: Troubleshooting */}
          <Section>
            <H2 id="help" n={12}>Comprehensive Troubleshooting & Diagnostics</H2>
            <p className={P}>
              Encountering an issue? Check our detailed troubleshooting guide organized by category below:
            </p>

            <div className="mt-8 space-y-8">
              {TROUBLESHOOTING_CATEGORIES.map((cat) => (
                <div key={cat.category} className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-black/10 pb-2">
                    <span className="font-mono text-xs font-bold text-[#0071e3]">
                      {cat.badge}
                    </span>
                    <h3 className="font-bold text-lg text-[#1d1d1f]">{cat.category}</h3>
                  </div>

                  <div className="space-y-3">
                    {cat.items.map((item) => (
                      <details key={item.q} className="group rounded-2xl border border-black/10 bg-[#f5f5f7] p-5 font-mono text-xs">
                        <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-sm text-[#1d1d1f]">
                          {item.q}
                          <span className="text-[#0071e3] transition-transform group-open:rotate-45 text-base font-bold ml-2">
                            +
                          </span>
                        </summary>
                        <p className="mt-3 leading-relaxed text-black/75 border-t border-black/5 pt-2">
                          {item.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-3xl bg-[#1d1d1f] p-7 text-white sm:flex-row sm:items-center">
              <div>
                <div className="text-lg font-bold">Still need technical assistance?</div>
                <div className="text-xs font-mono text-white/70">Our engineering and hardware support team responds within 24 hours.</div>
              </div>
              <a
                href="mailto:xentoryxlabs@gmail.com"
                className="rounded-full bg-[#0071e3] px-6 py-3 font-mono text-xs font-bold text-black transition hover:bg-white"
              >
                xentoryxlabs@gmail.com
              </a>
            </div>

            <p className="mt-8 font-mono text-xs text-black/50 print:hidden">
              <Link href="/en" className="text-[#0071e3] font-bold hover:underline">
                ← Back to Home
              </Link>
            </p>
          </Section>
        </article>
      </div>

      <Footer />
    </LangProvider>
  );
}
