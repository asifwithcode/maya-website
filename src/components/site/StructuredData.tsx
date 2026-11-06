import type { Lang } from "./i18n";
import type { SiteContent } from "./content";

export const SITE_URL = "https://themaya.site";

const PHOTOS = ["plain", "crown", "sprout", "panda", "bunny", "headphones", "backpack"].map(
  (n) => `${SITE_URL}/images/hero/maya-${n}.jpg`,
);

/** schema.org JSON-LD for the home page: who sells it (Organization), the site
    (WebSite) and the product with its live price, so Google can show rich results. */
export default function StructuredData({ lang, content }: { lang: Lang; content: SiteContent }) {
  const isBn = lang === "bn";
  const company = content.copy?.company;
  const pageUrl = isBn ? SITE_URL : `${SITE_URL}/en`;
  const orgId = `${SITE_URL}/#organization`;

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: "Xentoryx Labs",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      ...(company?.email ? { email: company.email } : {}),
      ...(company?.phone ? { telephone: company.phone } : {}),
      ...(company?.address ? { address: { "@type": "PostalAddress", streetAddress: company.address, addressCountry: "BD" } } : {}),
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
      "@type": "Product",
      "@id": `${SITE_URL}/#product`,
      name: isBn ? "মায়া — জীবন্ত মুখের ডেস্ক রোবট" : "Maya — the living desk robot",
      description: isBn
        ? "নরম ডেস্ক রোবট: গোল জীবন্ত মুখ, আটটা মুড, এগারোটা স্ক্রিন, সাতটা গেম আর বাংলা চিরকুট।"
        : "A soft desk companion robot with a round living face, 8 moods, 11 screens, 7 games and Bangla notes.",
      image: PHOTOS,
      brand: { "@type": "Brand", name: "Maya" },
      manufacturer: { "@id": orgId },
      category: "Desk robot",
      url: pageUrl,
      offers: {
        "@type": "Offer",
        url: `${pageUrl}#order`,
        priceCurrency: "BDT",
        price: content.pricing.maya,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": orgId },
        areaServed: "BD",
        acceptedPaymentMethod: "http://purl.org/goodrelations/v1#COD",
      },
    },
  ];

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
