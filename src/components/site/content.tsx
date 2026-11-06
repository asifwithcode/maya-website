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

export type SiteCopy = {
  hero: {
    badgeEn: string;
    badgeBn: string;
    batchEn: string;
    bullets: string[];
  };
  manifesto: {
    kickerEn: string;
    kickerBn: string;
    titleEn: string;
    titleBn: string;
    titleSoftEn: string;
    titleSoftBn: string;
    textEn: string;
    textBn: string;
  };
  features: {
    kickerEn: string;
    kickerBn: string;
    titleEn: string;
    titleBn: string;
    titleSoftEn: string;
    titleSoftBn: string;
    items: {
      fig: string;
      badge: string;
      titleEn: string;
      titleBn: string;
      descEn: string;
      descBn: string;
    }[];
  };
  specs: {
    kickerEn: string;
    kickerBn: string;
    titleEn: string;
    titleBn: string;
    inBoxEn: string;
    inBoxBn: string;
    rows: {
      labelEn: string;
      labelBn: string;
      valEn: string;
      valBn: string;
    }[];
    box: { en: string; bn: string }[];
  };
  company: {
    brandName: string;
    taglineEn: string;
    taglineBn: string;
    email: string;
    phone: string;
    address: string;
    copyright: string;
  };
};

export type SiteContent = {
  pricing: Pricing;
  editions: SiteEdition[];
  copy?: SiteCopy;
};

const ContentContext = createContext<SiteContent | null>(null);

/** CMS content (prices, editions, dynamic copy) fetched on the server and handed to the client sections. */
export function ContentProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

const defaultContent: SiteContent = {
  pricing: { maya: 3490, collector: 4490, accessory: 390, mini: 490, delivery: { dhaka: 70, outside: 130 } },
  editions: [],
};

export function useContent() {
  const c = useContext(ContentContext);
  return c ?? defaultContent;
}

/** What buying every accessory and mini separately would cost. */
export const separately = (p: Pricing, editionCount: number) => p.maya + (editionCount - 1) * (p.accessory + p.mini);
