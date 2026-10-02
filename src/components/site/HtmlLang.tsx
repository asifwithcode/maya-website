"use client";

import { useEffect } from "react";

/** Keeps <html lang> right: inline script on full loads, effect on client-side navigation. */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `document.documentElement.lang="${lang}"` }} />;
}
