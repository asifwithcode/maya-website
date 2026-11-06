import Nav from "./Nav";
import Hero from "./Hero";
import Manifesto from "./Manifesto";
import Moods from "./Moods";
import Features from "./Features";
import Screens from "./Screens";
import Editions from "./Editions";
import AppDownload from "./AppDownload";
import Specs from "./Specs";
import Reserve from "./Reserve";
import Footer from "./Footer";
import SmoothScroll from "./SmoothScroll";
import AutoReveal from "./AutoReveal";
import { LangProvider, type Lang } from "./i18n";
import HtmlLang from "./HtmlLang";
import { ContentProvider } from "./content";
import { getSiteContent } from "@/db/content";

/** The landing page, rendered at / (English) and /bn (Bangla). */
export default async function HomePage({ lang }: { lang: Lang }) {
  const content = await getSiteContent();
  return (
    <LangProvider lang={lang}>
      <ContentProvider content={content}>
      <HtmlLang lang={lang} />
      <div lang={lang}>
        <SmoothScroll />
        <AutoReveal />
        <Nav />
        <main>
          <Hero />
          <Manifesto />
          <Moods />
          <Features />
          <Screens />
          <Editions />
          <AppDownload />
          <Specs />
          <Reserve />
        </main>
        <Footer />
      </div>
      </ContentProvider>
    </LangProvider>
  );
}
