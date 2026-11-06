import Reveal from "./Reveal";

const ITEMS = [
  {
    n: "01",
    title: "Matte PLA body",
    desc: "A soft, low-sheen plastic that photographs — and feels — closer to ceramic than plastic usually does.",
  },
  {
    n: "02",
    title: "Hand-fit heads",
    desc: "Each topper is friction-fit by hand after printing, then checked for a snug seat before it ships.",
  },
  {
    n: "03",
    title: "Palm-sized",
    desc: "Small enough for a keyboard corner or a shelf, sized to sit rather than stand guard over your desk.",
  },
];

export default function Craft() {
  return (
    <section id="craft" className="scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <Reveal className="mb-16 text-center sm:mb-20">
          <span className="block text-base font-medium text-ink-faint">How It&rsquo;s Made</span>
          <h2 className="mx-auto mt-2 max-w-xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Printed one at a time, not molded by the thousand.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08} className="border-t border-ink/10 pt-6">
              <span className="text-sm text-ink-faint">{item.n}</span>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink-soft">{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
