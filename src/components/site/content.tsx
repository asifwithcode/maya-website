"use client";

import { createContext, useContext, type ReactNode } from "react";

export type Pricing = {
  maya: number;
  collector: number;
  accessory: number;
  mini: number;
  delivery: { dhaka: number; outside: number };
};

export type SiteEdition = {
  slug: string;
  variant: string;
  name: { en: string; bn: string };
  accessory: { en: string; bn: string };
  eyes: { en: string; bn: string };
  tint: string;
  price: number | null;
};

export type SiteContent = { pricing: Pricing; editions: SiteEdition[] };

const ContentContext = createContext<SiteContent | null>(null);

/** CMS content (prices, editions) fetched on the server and handed to the client sections. */
export function ContentProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const c = useContext(ContentContext);
  if (!c) throw new Error("useContent needs <ContentProvider>");
  return c;
}

/** What buying every accessory and mini separately would cost. */
export const separately = (p: Pricing, editionCount: number) => p.maya + (editionCount - 1) * (p.accessory + p.mini);
