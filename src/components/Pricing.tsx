"use client";

import Reveal from "./Reveal";

const TIERS = [
  {
    name: "Single",
    price: "$28",
    tagline: "Pick one head to start.",
    features: ["One MAYA body", "Your choice of head", "Ships in Season One"],
    variant: "Classic",
    featured: false,
  },
  {
    name: "Collector's Set",
    price: "$119",
    compareAt: "$140",
    tagline: "All five heads, one body.",
    features: [
      "One MAYA body",
      "All 5 interchangeable heads",
      "Numbered Season One card",
      "Ships first, before single orders",
    ],
    variant: "Surprise me",
    featured: true,
  },
];

export default function Pricing() {
  function scrollToForm(variant: string) {
    const form = document.getElementById("preorderForm") as HTMLFormElement | null;
    document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => {
      if (!form) return;
      const variantSelect = form.elements.namedItem("variant") as HTMLSelectElement | null;
      if (variantSelect) variantSelect.value = variant;
      (form.elements.namedItem("name") as HTMLInputElement | null)?.focus();
    }, 500);
  }

  return (
    <section id="pricing" className="scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        <Reveal className="mb-16 text-center sm:mb-20">
          <span className="block text-base font-medium text-ink-faint">Pricing</span>
          <h2 className="mx-auto mt-2 max-w-lg text-5xl font-semibold tracking-tight sm:text-6xl">
            One face, priced two ways.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink-soft">
            Season One prices, placeholder until we lock the real print &amp;
            shipping cost &mdash; reserving now doesn&rsquo;t charge you anything.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col rounded-3xl p-8 ${
                  tier.featured ? "border-2 border-ink" : "border border-ink/10"
                }`}
              >
                {tier.featured && (
                  <span className="mb-3 text-sm font-semibold text-eye-deep">Best value</span>
                )}
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{tier.tagline}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tight">{tier.price}</span>
                  {tier.compareAt && (
                    <span className="text-sm text-ink-faint line-through">{tier.compareAt}</span>
                  )}
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-[0.95rem]">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-ink-soft">
                      <span className="text-ink">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollToForm(tier.variant)}
                  className={`mt-8 rounded-full py-3 text-[0.95rem] font-semibold transition-opacity hover:opacity-80 ${
                    tier.featured ? "bg-ink text-white" : "border border-ink/15 text-ink"
                  }`}
                >
                  Reserve the {tier.name}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
