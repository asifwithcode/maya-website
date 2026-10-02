"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Mood } from "./data";

const PINK = "#f7b8c8";
const EYES: [number, number][] = [
  [86, 122],
  [154, 122],
];

// One eye, drawn around (0,0). `side` is -1 for the left eye, 1 for the right.
function Eye({ mood, side }: { mood: Mood; side: -1 | 1 }) {
  switch (mood) {
    case "happy":
      return <path d="M-24 10 Q0 -26 24 10" fill="none" stroke={PINK} strokeWidth={13} strokeLinecap="round" />;
    case "love":
      return (
        <motion.path
          d="M0 22 C-34 0 -30 -26 -13 -26 C-5 -26 0 -19 0 -14 C0 -19 5 -26 13 -26 C30 -26 34 0 0 22 Z"
          fill="#ff7d9c"
          animate={{ scale: [1, 1.14, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      );
    case "sleepy":
      return <path d="M-22 4 Q0 18 22 4" fill="none" stroke={PINK} strokeWidth={10} strokeLinecap="round" />;
    case "surprised":
      return (
        <motion.circle
          r={27}
          fill={PINK}
          animate={{ scale: [0.85, 1.05, 1] }}
          transition={{ duration: 0.5 }}
        />
      );
    case "bored":
      return <rect x={-22} y={2} width={44} height={24} rx={10} fill={PINK} />;
    case "annoyed":
      return <rect x={-22} y={-4} width={44} height={26} rx={9} fill={PINK} />;
    case "angry":
      return (
        <path
          d={side < 0 ? "M-20 -12 L20 4 L20 24 L-20 24 Z" : "M-20 4 L20 -12 L20 24 L-20 24 Z"}
          fill={PINK}
          stroke={PINK}
          strokeWidth={8}
          strokeLinejoin="round"
        />
      );
    case "dizzy":
      return (
        <motion.path
          d="M0 0 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 1 1 8 8 a12 12 0 1 1 -12 -12 a16 16 0 1 1 16 16 a20 20 0 1 1 -20 -20"
          fill="none"
          stroke={PINK}
          strokeWidth={5}
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      );
    default:
      return (
        <motion.rect
          x={-20}
          y={-30}
          width={40}
          height={60}
          rx={18}
          fill={PINK}
          animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
          transition={{ duration: 4.2, times: [0, 0.9, 0.93, 0.96, 1], repeat: Infinity }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      );
  }
}

// Where the eyes drift for each mood (the firmware's "saccades").
const GAZE: Partial<Record<Mood, { x: number[]; y: number[]; duration: number }>> = {
  idle: { x: [0, -12, -12, 10, 10, 0], y: [0, 0, 4, 4, -3, 0], duration: 7 },
  bored: { x: [0, -8, -8, 6, 0], y: [8, 10, 10, 8, 8], duration: 8 },
  annoyed: { x: [14, 14, 16, 14], y: [0, 0, 0, 0], duration: 3 },
  sleepy: { x: [0, 0], y: [6, 10], duration: 2.5 },
  angry: { x: [-2, 2], y: [0, 0], duration: 0.12 },
};

// `still` skips the fade-in on first render (docs, print).
export default function MayaFace({ mood, className, still }: { mood: Mood; className?: string; still?: boolean }) {
  const gaze = GAZE[mood];
  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label={`Maya looks ${mood}`}>
      <defs>
        <radialGradient id="maya-glass" cx="35%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#1d1b22" />
          <stop offset="60%" stopColor="#050506" />
        </radialGradient>
      </defs>
      <circle cx={120} cy={120} r={120} fill="url(#maya-glass)" />
      <AnimatePresence mode="wait" initial={!still}>
        <motion.g
          key={mood}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.22 }}
          style={{ transformOrigin: "120px 120px" }}
        >
          <motion.g
            animate={gaze ? { x: gaze.x, y: gaze.y } : { x: 0, y: 0 }}
            transition={gaze ? { duration: gaze.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } : undefined}
          >
            {EYES.map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <Eye mood={mood} side={i === 0 ? -1 : 1} />
              </g>
            ))}
          </motion.g>
          {mood === "sleepy" && (
            <motion.text
              x={176}
              y={78}
              fill={PINK}
              fontSize={22}
              fontWeight={700}
              animate={{ opacity: [0, 1, 0], y: [84, 64, 50] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              z
            </motion.text>
          )}
        </motion.g>
      </AnimatePresence>
      <ellipse cx={82} cy={46} rx={46} ry={16} fill="#fff" opacity={0.06} transform="rotate(-18 82 46)" />
    </svg>
  );
}
