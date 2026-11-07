import type { Lang } from "./i18n";
import type { SiteContent } from "./content";
import { COMBO } from "./data";

export const SITE_URL = "https://themaya.site";

const PHOTOS = ["plain", "crown", "sprout", "panda", "bunny", "headphones", "backpack"].map(
  (n) => `${SITE_URL}/images/hero/maya-${n}.jpg`,
);
const heroPhoto = (slug: string) => `${SITE_URL}/images/hero/maya-${slug}.jpg`;

/**
 * schema.org JSON-LD for the home page: the seller (Organization, in Chittagong), the site and the
 * product as a ProductGroup with one Product + Offer per orderable edition (live price, stock and
 * delivery charge, return policy from the terms). Only facts the site states: no ratings or reviews,
 * no delivery times.
 */
export default function StructuredData({
  lang,
  content,
  stock,
}: {
  lang: Lang;
  content: SiteContent;
  /** units in stock per variant; undefined when the database could not be read */
  stock?: Record<string, number>;
}) {
  const isBn = lang === "bn";
  const company = content.copy?.company;
  const pageUrl = isBn ? SITE_URL : `${SITE_URL}/en`;
  const orgId = `${SITE_URL}/#organization`;
  const { pricing } = content;

  // "Chittagong, Bangladesh" is only the city; a longer address goes in streetAddress
  const address = company?.address?.trim() ?? "";
  const cityOnly = /^(chittagong|chattogram)(,\s*bangladesh)?$/i.test(address);
  const postal = {
    "@type": "PostalAddress",
    ...(address && !cityOnly ? { streetAddress: address } : {}),
    addressLocality: "Chittagong",
    addressRegion: "Chattogram",
    addressCountry: "BD",
  };

  const shipping = [
    { name: isBn ? "ঢাকার ভেতরে" : "Inside Dhaka", fee: pricing.delivery.dhaka, region: { addressCountry: "BD", addressRegion: "Dhaka" } },
    { name: isBn ? "ঢাকার বাইরে" : "Outside Dhaka", fee: pricing.delivery.outside, region: { addressCountry: "BD" } },
  ].map((s) => ({
    "@type": "OfferShippingDetails",
    name: s.name,
    shippingRate: { "@type": "MonetaryAmount", value: s.fee, currency: "BDT" },
    shippingDestination: { "@type": "DefinedRegion", ...s.region },
  }));

  // Terms → Returns: 7 days from delivery, unopened box, refund or exchange, customer pays the return courier
  const returnPolicy = {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "BD",
    returnPolicyCountry: "BD",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 7,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
    refundType: ["https://schema.org/FullRefund", "https://schema.org/ExchangeRefund"],
    itemCondition: "https://schema.org/NewCondition",
    merchantReturnLink: `${SITE_URL}${isBn ? "" : "/en"}/terms`,
  };

  const availability = (variant: string) => {
    if (!stock) return "https://schema.org/InStock";
    return (stock[variant] ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  };
  const offer = (variant: string, price: number) => ({
    "@type": "Offer",
    url: `${pageUrl}#order`,
    priceCurrency: "BDT",
    price,
    availability: availability(variant),
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": orgId },
    areaServed: { "@type": "Country", name: "BD" },
    acceptedPaymentMethod: "http://purl.org/goodrelations/v1#COD",
    shippingDetails: shipping,
    hasMerchantReturnPolicy: returnPolicy,
  });

  const groupId = `${SITE_URL}/#product`;
  const variants = [
    ...content.editions.map((e) => ({
      "@type": "Product",
      "@id": `${SITE_URL}/#edition-${e.slug}`,
      name: isBn ? `মায়া ${e.name.bn}` : `Maya ${e.name.en}`,
      description: isBn
        ? `${e.accessory.bn} আর ${e.eyes.bn} সহ মায়া ডেস্ক রোবট, সাথে মিলিয়ে মিনি কি-চেইন।`
        : `Maya desk robot with ${e.accessory.en.toLowerCase()} and ${e.eyes.en.toLowerCase()}, plus a matching mini keychain.`,
      image: heroPhoto(e.slug),
      sku: `MAYA-${e.variant.toUpperCase()}`,
      color: isBn ? e.name.bn : e.name.en,
      isVariantOf: { "@id": groupId },
      brand: { "@type": "Brand", name: "Maya" },
      offers: offer(e.variant, e.price ?? pricing.maya),
    })),
    {
      "@type": "Product",
      "@id": `${SITE_URL}/#edition-collection`,
      name: isBn ? "মায়া কমপ্লিট কালেকশন" : "Maya Complete Collection",
      description: isBn
        ? "একটা মায়া, ছয়টা এক্সেসরি আর ছয়টা মিনি কি-চেইন।"
        : "One Maya with all six accessories and all six mini keychains.",
      image: heroPhoto("plain"),
      sku: "MAYA-COLLECTION",
      color: isBn ? "কমপ্লিট কালেকশন" : "Complete Collection",
      isVariantOf: { "@id": groupId },
      brand: { "@type": "Brand", name: "Maya" },
      offers: offer(COMBO.variant, pricing.collector),
    },
  ];

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: company?.brandName || "Xentoryx Labs",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      ...(company?.email ? { email: company.email } : {}),
      ...(company?.phone ? { telephone: company.phone } : {}),
      address: postal,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: isBn ? "মায়া" : "Maya",
      alternateName: ["Maya", "মায়া", "Maya desk robot"],
      inLanguage: ["bn-BD", "en"],
      publisher: { "@id": orgId },
    },
    {
      "@type": "ProductGroup",
      "@id": groupId,
      name: isBn ? "মায়া (MAYA) ডেস্ক কম্প্যানিয়ন রোবট" : "MAYA Desk Companion Robot",
      alternateName: ["MAYA robot", "MAYA desktop robot", "Smart desk robot", "মায়া রোবট"],
      description: isBn
        ? "স্মার্ট ডেস্ক কম্প্যানিয়ন রোবট: গোল জীবন্ত মুখ, আটটা মুড, এগারোটা স্ক্রিন, সাতটা গেম আর বাংলা চিরকুট। অফিস বা পড়ার টেবিলের জন্য।"
        : "A smart desk companion robot with a round living face, 8 moods, 11 screens, 7 games and Bangla notes, made for your office or study desk.",
      image: PHOTOS,
      url: pageUrl,
      brand: { "@type": "Brand", name: "Maya" },
      manufacturer: { "@id": orgId },
      category: "Desk companion robot",
      productGroupID: "MAYA",
      variesBy: "https://schema.org/color",
      hasVariant: variants,
    },
  ];

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
