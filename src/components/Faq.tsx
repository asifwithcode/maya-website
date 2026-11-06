"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";

const ITEMS = [
  {
    q: "Is this a real payment, or just a waitlist?",
    a: "Just a waitlist for now. Reserving a spot costs nothing — when Season One is ready to actually ship, we'll email everyone on the list first, in order, before it opens more widely.",
  },
  {
    q: "Can I swap heads after I get one?",
    a: "Yes — every head is friction-fit to the same body, so it lifts off and swaps on without tools. Reserving one head now doesn't lock you out of the others later.",
  },
  {
    q: "What's it made of?",
    a: "3D-printed PLA, finished by hand. It's a desk companion, not a bath toy — keep it out of direct sun and off anything hot, and it'll hold its color for years.",
  },
  {
    q: "Does it connect to the MAYA app or device?",
    a: "No — it's a physical companion piece, not an electronic one. No battery, no pairing, no screen. It just sits there being MAYA-shaped.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 sm:px-10">
        <Reveal className="mb-12 text-center sm:mb-16">
          <span className="block text-base font-medium text-ink-faint">Questions</span>
          <h2 className="mt-2 text-5xl font-semibold tracking-tight sm:text-6xl">Before you reserve</h2>
        </Reveal>

        <Reveal>
          <div className="divide-y divide-ink/10">
            {ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={item.q}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold"
                  >
                    {item.q}
                    <span
                      className="flex-shrink-0 text-xl font-normal text-ink-faint transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[56ch] pb-5 text-sm leading-relaxed text-ink-soft">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
