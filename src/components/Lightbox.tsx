"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

type LightboxCtx = {
  open: (src: string, alt: string) => void;
};

const Ctx = createContext<LightboxCtx | null>(null);

export function useLightbox() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLightbox must be used inside LightboxProvider");
  return ctx;
}

export default function LightboxProvider({ children }: { children: ReactNode }) {
  const [img, setImg] = useState<{ src: string; alt: string } | null>(null);

  const open = useCallback((src: string, alt: string) => setImg({ src, alt }), []);
  const close = useCallback(() => setImg(null), []);

  useEffect(() => {
    if (!img) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [img, close]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {img && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-screen/92 p-8"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute right-6 top-6 text-3xl text-white/90 hover:text-white"
              aria-label="Close"
            >
              &times;
            </button>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[82vh] w-full max-w-[560px]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={800}
                className="h-full w-full rounded-[20px] object-contain shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
