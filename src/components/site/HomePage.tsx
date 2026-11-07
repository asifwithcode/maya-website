import Nav from "./Nav";
import { VisionHero, VisionStatement, VisionExpand, VisionEditions } from "./VisionStory";
import Moods from "./Moods";
import Features from "./Features";
import Screens from "./Screens";
import Editions from "./Editions";
import AppDownload from "./AppDownload";
import Specs from "./Specs";
import Reserve from "./Reserve";
import Faq from "./Faq";
import Footer from "./Footer";
import SmoothScroll from "./SmoothScroll";
import AutoReveal from "./AutoReveal";
import { LangProvider, type Lang } from "./i18n";
import HtmlLang from "./HtmlLang";
import StructuredData from "./StructuredData";
import { ContentProvider } from "./content";
import { getSiteContent } from "@/db/content";
import { hasDatabase } from "@/db";
import { getStockMap } from "@/lib/shop";

/** The landing page, rendered at / (English) and /bn (Bangla). */
export default async function HomePage({ lang }: { lang: Lang }) {
  const content = await getSiteContent();
  // live stock for the structured data; undefined (= in stock) if the database is unreachable
  const stock = hasDatabase() ? await getStockMap().catch(() => undefined) : undefined;
  return (
    <LangProvider lang={lang}>
      <ContentProvider content={content}>
      <HtmlLang lang={lang} />
      <StructuredData lang={lang} content={content} stock={stock} />
      <div lang={lang}>
        <SmoothScroll />
        <AutoReveal />
        <Nav />
        <main>
          <VisionHero />
          <VisionStatement />
          <VisionExpand />
          <VisionEditions />
          <Moods />
          <Features />
          <Screens />
          <Editions />
          <AppDownload />
          <Specs />
          <Faq />
          <Reserve />
        </main>
        <Footer />
      </div>
      </ContentProvider>
    </LangProvider>
  );
}
