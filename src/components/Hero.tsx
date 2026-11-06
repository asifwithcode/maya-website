"use client";

import Image from "next/image";
import Magnetic from "./Magnetic";

export default function Hero() {
  return (
    <section className="relative sm:h-[86vh]">
      {/* Mobile: a plain image block, full width, with the text following
          it in normal document flow below (never overlapping the figure).
          Desktop (sm+): both become absolutely positioned inside this
          section so the text can sit in the photo's own empty right half. */}
      <div className="relative h-[52vh] min-h-[380px] w-full overflow-hidden bg-bg-2 sm:absolute sm:inset-0 sm:h-full">
        <Image
          src="/images/showcase.png"
          alt="MAYA sitting on a sunlit wooden desk, beside a plant and a small lamp"
          fill
          priority
          className="object-cover object-left"
          sizes="100vw"
        />
        {/* Soft fade over just the empty right half on desktop, where the
            photo already leaves room for the text to sit in. */}
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-white/75 via-white/20 to-transparent sm:block" />
      </div>

      <div
        className="flex w-full flex-col items-center px-6 py-12 text-center
                   sm:absolute sm:inset-y-0 sm:right-0 sm:w-[48%] sm:items-start
                   sm:justify-center sm:px-0 sm:py-0 sm:pl-10 sm:pr-14 sm:text-left
                   lg:pr-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))]"
      >
        <span className="text-base font-medium text-ink-soft">
          Season One &middot; 5 heads, 1 face
        </span>
        <h1 className="mt-3 font-script text-6xl font-normal leading-[1.15] text-ink sm:mt-4 sm:text-7xl lg:text-8xl">
          maya
        </h1>
        <p className="mt-4 max-w-md text-base text-ink-soft sm:mt-5 sm:text-xl">
          The face on your desk. Now something you can hold.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:justify-start">
          <Magnetic strength={0.25}>
            <a
              href="#gallery"
              className="inline-block rounded-full border border-ink/25 bg-white/70 px-7 py-3 text-base font-medium text-ink backdrop-blur-sm transition-colors hover:bg-white sm:bg-white/70"
            >
              Meet the five
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#preorder"
              className="inline-block rounded-full bg-ink px-7 py-3 text-base font-medium text-white transition-opacity hover:opacity-85"
            >
              Reserve a MAYA
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
