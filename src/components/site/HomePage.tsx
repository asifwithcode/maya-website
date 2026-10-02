import Nav from "./Nav";
import Hero from "./Hero";
import Manifesto from "./Manifesto";
import Moods from "./Moods";
import Features from "./Features";
import Screens from "./Screens";
import Editions from "./Editions";
import Specs from "./Specs";
import Reserve from "./Reserve";
import Footer from "./Footer";
import SmoothScroll from "./SmoothScroll";
import { LangProvider, type Lang } from "./i18n";
import HtmlLang from "./HtmlLang";

/** The landing page, rendered at / (English) and /bn (Bangla). */
export default function HomePage({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <HtmlLang lang={lang} />
      <div lang={lang}>
        <SmoothScroll />
        <Nav />
        <main>
          <Hero />
          <Manifesto />
          <Moods />
          <Features />
          <Screens />
          <Editions />
          <Specs />
          <Reserve />
        </main>
        <Footer />
      </div>
    </LangProvider>
  );
}
