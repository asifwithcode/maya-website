import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import HtmlLang from "@/components/site/HtmlLang";
import MayaFace from "@/components/site/MayaFace";
import PrintButton from "@/components/site/PrintButton";
import { GAMES, MOODS, SPECS } from "@/components/site/data";

export const metadata: Metadata = {
  title: "Maya user guide",
  description:
    "Set up Maya, learn the touch controls, moods, menu and games, pair her with the app, update firmware and reset her.",
};

// Everything here follows the current firmware (Firmware/src/main.cpp, MayaMenuUI, MayaGamesUI).
const TOC = [
  ["start", "Quick start"],
  ["controls", "Touch controls"],
  ["moods", "Moods"],
  ["menu", "The menu"],
  ["games", "Games"],
  ["pairing", "Pairing and Wi-Fi"],
  ["accessories", "Accessories"],
  ["firmware", "Firmware updates"],
  ["reset", "Factory reset"],
  ["care", "Care and safety"],
  ["specs", "Specifications"],
  ["help", "Troubleshooting"],
] as const;

const CONTROLS: [string, string, string][] = [
  ["Tap T1 (head)", "Pet her. She gets happy.", "Select, jump, flap, fire, drop"],
  ["Tap T1 3–4 times fast", "She gets annoyed", "—"],
  ["Tap T1 5+ times fast", "She gets angry", "—"],
  ["Tap T2 (side)", "Open the menu", "Menu: next item. Screens: back to the menu"],
  ["Hold T1 for 1 s", "—", "Leave the current screen or game"],
  ["Hold T2 for 1 s", "—", "Leave the games list, back to the menu"],
  ["Hold T1 + T2 for 2 s", "Go to sleep / wake up", "—"],
  ["Hold T2 for 2.5 s", "Setup / pairing mode, from anywhere", "Setup / pairing mode, from anywhere"],
];

const MENU: [string, string][] = [
  ["Maya face", "Back to her eyes."],
  ["Digital clock", "Time and date, synced from the internet."],
  ["Live weather", "Temperature, sky and humidity for your city."],
  ["Notifications", "Your 5 latest alerts from the app."],
  ["Pomodoro", "25 minutes focus, 5 minutes break."],
  ["Timer & lap", "Stopwatch with laps. T1 starts and stops."],
  ["Focus stats", "How much you focused today and this week."],
  ["Mini games", "The arcade. See Games below."],
  ["System info", "Wi-Fi, memory, uptime and firmware version."],
  ["Setup / Reset device", "Setup shows until Maya is paired. After that, this slot becomes Reset device."],
];

const GAME_CONTROLS: Record<string, string> = {
  dino: "T1 jump",
  flappy: "T1 flap",
  shooter: "T1 fire",
  stack: "T1 drop",
  pong: "T1 reverse",
  reflex: "T1 on the flash",
  brick: "T1 paddle",
};

const HELP: [string, string][] = [
  [
    "The screen stays black",
    "Use a 5 V USB charger that gives at least 1 A, and try another cable. Some thin cables only charge phones and drop the voltage.",
  ],
  [
    "Touch does nothing right after plugging in",
    "Maya ignores touch for the first 3 seconds while she calibrates. Keep your hands off her until she says hi.",
  ],
  [
    "She won't join my Wi-Fi",
    "Maya works on 2.4 GHz only. If your router mixes 2.4 and 5 GHz under one name, turn on a separate 2.4 GHz network.",
  ],
  ["Pairing fails or times out", "Hold T2 for 2.5 s to restart setup, keep the phone close, and try again from the app."],
  [
    "Weather or time is wrong",
    "Both come from the internet. Check System info for the Wi-Fi status, and set your city in the app.",
  ],
  ["An accessory is loose", "Push it straight down until it seats. If it still wobbles, write to us and we'll send a new one."],
];

function H2({ id, n, children }: { id: string; n: number; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-semibold tracking-tight sm:text-3xl">
      <span className="mr-3 font-script text-xl font-normal text-eye">{String(n).padStart(2, "0")}</span>
      {children}
    </h2>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <section className="border-t border-ink/10 py-12 first:border-0 first:pt-0 print:break-inside-avoid">{children}</section>;
}

const P = "mt-4 max-w-2xl leading-relaxed text-ink-soft";

export default function DocsPage() {
  return (
    <>
      <div className="print:hidden">
        <HtmlLang lang="en" />
        <Nav home={false} />
      </div>

      <header className="bg-cream pb-14 pt-28 print:bg-white print:pt-0">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:px-8 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-medium text-eye-deep">User guide · Firmware v1</span>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight sm:text-6xl">
              Getting to know <span className="font-script font-normal text-eye-deep">Maya</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-ink-soft">
              Everything you need, from the first plug-in to factory reset. Five minutes to read, and she&rsquo;ll
              teach you the rest herself.
            </p>
          </div>
          <PrintButton />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-8 lg:grid-cols-[13rem_1fr]">
        <aside className="print:hidden">
          <nav className="sticky top-24 hidden lg:block" aria-label="On this page">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">On this page</div>
            <ol className="mt-4 space-y-2 text-sm">
              {TOC.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-ink-soft transition-colors hover:text-eye-deep">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <details className="rounded-2xl border border-ink/10 p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold">On this page</summary>
            <ol className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {TOC.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-ink-soft">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </aside>

        <article className="min-w-0">
          <Section>
            <H2 id="start" n={1}>Quick start</H2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ["Plug in", "Connect the USB-C cable to any 5 V / 1 A charger or computer. Maya has no battery, so she stays plugged in."],
                ["Say hi", "She waves hello, then her eyes start looking around. Wait for that before you touch her."],
                ["Pair", "Open the Maya app and follow the steps. The app finds her over Bluetooth and gives her your Wi-Fi."],
              ].map(([t, d], i) => (
                <li key={t} className="rounded-2xl bg-bg-2 p-5">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-ink text-xs font-semibold text-paper">{i + 1}</div>
                  <div className="mt-3 font-semibold">{t}</div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{d}</p>
                </li>
              ))}
            </ol>
            <p className={P}>
              Maya works without Wi-Fi too: her face, moods, clock, timers and games all run on the device. Wi-Fi adds
              weather, notifications and time sync.
            </p>
          </Section>

          <Section>
            <H2 id="controls" n={2}>Touch controls</H2>
            <p className={P}>
              Maya has two hidden touch pads. <b className="text-ink">T1</b> is on top of her head, <b className="text-ink">T2</b> is
              on the side. A light touch is enough; you don&rsquo;t need to press.
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="bg-bg-2 text-xs uppercase tracking-wider text-ink-faint">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Touch</th>
                    <th className="px-4 py-3 font-semibold">On her face</th>
                    <th className="px-4 py-3 font-semibold">In menus and games</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {CONTROLS.map(([a, b, c]) => (
                    <tr key={a}>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold">{a}</td>
                      <td className="px-4 py-3 text-ink-soft">{b}</td>
                      <td className="px-4 py-3 text-ink-soft">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section>
            <H2 id="moods" n={3}>Moods</H2>
            <p className={P}>
              Maya&rsquo;s mood changes on its own through the day, and with how you treat her. Now and then she shows
              a little card in Bangla. Tap T1 or T2 to close it.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MOODS.map((m) => (
                <li key={m.id} className="flex flex-col items-center rounded-2xl bg-bg-2 p-4 text-center">
                  <MayaFace mood={m.id} className="h-16 w-16" still />
                  <div className="mt-3 text-sm font-semibold">{m.label}</div>
                  <div className="font-bangla text-xs text-ink-faint">{m.bn}</div>
                </li>
              ))}
            </ul>
            <p className={P}>
              <b className="text-ink">Bedtime:</b> hold T1 and T2 together for about 2 seconds and Maya goes to sleep. Poke
              her while she sleeps and she&rsquo;ll grumble at you, then doze off again. Hold both pads again to wake
              her.
            </p>
          </Section>

          <Section>
            <H2 id="menu" n={4}>The menu</H2>
            <p className={P}>
              Tap T2 on her face to open the carousel. Tap T2 again to turn to the next item, and T1 to open it. Inside
              any screen, T2 takes you back to the menu.
            </p>
            <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
              {MENU.map(([k, v]) => (
                <div key={k} className="bg-card p-4">
                  <dt className="text-sm font-semibold">{k}</dt>
                  <dd className="mt-1 text-sm text-ink-soft">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section>
            <H2 id="games" n={5}>Games</H2>
            <p className={P}>
              Open <b className="text-ink">Mini games</b> from the menu. T2 picks the next game and T1 starts it. Every game
              is played with T1. Hold T1 for a second to stop a game, or hold T2 to leave the arcade. High scores are
              saved on Maya and survive unplugging.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {GAMES.map((g) => (
                <li key={g.id} className="flex items-start justify-between gap-4 rounded-2xl bg-bg-2 p-4">
                  <div>
                    <div className="font-semibold">{g.name}</div>
                    <div className="mt-0.5 text-sm text-ink-soft">{g.text}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-card px-2.5 py-1 text-xs font-medium text-eye-deep">
                    {GAME_CONTROLS[g.id]}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section>
            <H2 id="pairing" n={6}>Pairing and Wi-Fi</H2>
            <p className={P}>
              A new Maya opens the setup screen with a QR code. In the app, tap <b className="text-ink">Pair New Maya</b>, scan
              the code, and choose your Wi-Fi. The app talks to her over Bluetooth, and the connection is encrypted end
              to end. Once paired, Maya belongs to your account, and nobody else can claim her.
            </p>
            <ul className="mt-5 max-w-2xl list-disc space-y-2 pl-5 text-ink-soft">
              <li>
                To get back to setup at any time, <b className="text-ink">hold T2 for 2.5 seconds</b>.
              </li>
              <li>
                No app nearby? Open <b className="text-ink">Wi-Fi setup</b>: Maya makes her own hotspot called{" "}
                <code className="rounded bg-bg-2 px-1.5 py-0.5 text-sm">MAYA-SETUP</code>. Its password is shown on her
                screen. Join it with your phone and enter your Wi-Fi in the page that opens.
              </li>
              <li>Maya needs 2.4 GHz Wi-Fi. 5 GHz-only networks won&rsquo;t show up.</li>
            </ul>
          </Section>

          <Section>
            <H2 id="accessories" n={7}>Accessories</H2>
            <p className={P}>
              Bunny ears, panda ears, crown, sprout, headphones and backpack all plug in without glue or tools. To
              change, pull the accessory straight up (or off her back, for the backpack) and push the new one in until
              it sits flat. Every accessory fits every Maya.
            </p>
            <p className={P}>
              Your box also has a 25 mm mini Maya keychain. It&rsquo;s small, so keep it away from young children.
            </p>
          </Section>

          <Section>
            <H2 id="firmware" n={8}>Firmware updates</H2>
            <p className={P}>
              Maya doesn&rsquo;t update over the air, so nothing changes without you knowing. When a new version is out,
              we&rsquo;ll email you a link to our web updater:
            </p>
            <ol className="mt-5 max-w-2xl list-decimal space-y-2 pl-5 text-ink-soft">
              <li>Connect Maya to a computer with a USB-C data cable.</li>
              <li>Open the updater in Chrome or Edge on a computer (not a phone).</li>
              <li>
                Click <b className="text-ink">Connect &amp; Flash MAYA</b>, pick her port, and wait until it says done. Don&rsquo;t
                unplug her during the update.
              </li>
            </ol>
            <p className={P}>
              If the updater asks whether to erase the device, choose <b className="text-ink">No</b> to keep your Wi-Fi,
              pairing and high scores. Erasing gives you a clean start, like a factory reset.
            </p>
          </Section>

          <Section>
            <H2 id="reset" n={9}>Factory reset</H2>
            <p className={P}>
              Resetting erases Wi-Fi, pairing, her name and high scores, and Maya starts again like new. Do this before you give
              her to someone else.
            </p>
            <ol className="mt-5 max-w-2xl list-decimal space-y-2 pl-5 text-ink-soft">
              <li>Open the menu (tap T2) and turn to <b className="text-ink">Reset device</b>.</li>
              <li>Tap T1 to open it.</li>
              <li>
                <b className="text-ink">Hold T1 for 1.5 seconds</b> until the ring fills. Tap T2 instead to cancel.
              </li>
            </ol>
            <p className={P}>After a reset, remove her from your account in the app too.</p>
          </Section>

          <Section>
            <H2 id="care" n={10}>Care and safety</H2>
            <ul className="mt-5 max-w-2xl list-disc space-y-2 pl-5 text-ink-soft">
              <li>Use a regulated 5 V USB power source only.</li>
              <li>
                Maya&rsquo;s body is PLA plastic. Keep her out of direct sun, hot cars and away from heaters. PLA softens
                above about 50 °C.
              </li>
              <li>Clean the screen with a dry microfiber cloth. For the body, use a soft dry brush. No water or solvents.</li>
              <li>Keep her dry. She&rsquo;s not made for bathrooms or outdoors.</li>
              <li>Not a toy for children under 3: the accessories and the keychain are small parts.</li>
            </ul>
          </Section>

          <Section>
            <H2 id="specs" n={11}>Specifications</H2>
            <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {SPECS.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-sm font-semibold">{k}</dt>
                  <dd className="text-sm text-ink-soft">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section>
            <H2 id="help" n={12}>Troubleshooting</H2>
            <div className="mt-6 space-y-3">
              {HELP.map(([q, a]) => (
                <details key={q} className="group rounded-2xl bg-bg-2 p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                    {q}
                    <span className="text-ink-faint transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-[1.75rem] bg-night p-7 text-white sm:flex-row sm:items-center">
              <div>
                <div className="text-lg font-semibold">Still stuck?</div>
                <div className="text-sm text-white/60">Write to us. A real person answers, usually within a day.</div>
              </div>
              <a
                href="mailto:contact@xentoryx.com"
                className="rounded-full bg-eye px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-eye-deep"
              >
                contact@xentoryx.com
              </a>
            </div>
            <p className="mt-8 text-sm text-ink-faint print:hidden">
              <Link href="/" className="text-eye-deep hover:underline">
                ← Back to Maya
              </Link>
            </p>
          </Section>
        </article>
      </div>

      <Footer />
    </>
  );
}
