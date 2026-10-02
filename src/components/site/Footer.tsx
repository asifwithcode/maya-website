"use client";

import Link from "next/link";
import { useT } from "./i18n";

export default function Footer() {
  const { t } = useT();
  return (
    <footer className="overflow-hidden bg-night px-5 pb-10 pt-6 text-white/45 sm:px-8 print:hidden">
      <div className="mx-auto max-w-7xl">
        <div aria-hidden="true" className="select-none font-script text-[28vw] leading-[0.85] text-white/[0.04] md:text-[20vw]">
          maya
        </div>
        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {t.footer.rights}</span>
          <nav className="flex gap-6">
            <Link href="/docs" className="hover:text-white">
              {t.footer.guide}
            </Link>
            <a href="mailto:contact@xentoryx.com" className="hover:text-white">
              contact@xentoryx.com
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
