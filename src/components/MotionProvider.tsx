"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// "user" makes every Framer Motion animation on the page respect the
// visitor's OS-level prefers-reduced-motion setting automatically, instead
// of every component re-implementing that check.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
