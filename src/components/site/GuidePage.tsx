import Nav from "./Nav";
import Footer from "./Footer";
import Guide from "./Guide";
import HtmlLang from "./HtmlLang";
import { LangProvider, type Lang } from "./i18n";

/** The user guide, rendered at /docs (English) and /bn/docs (Bangla). */
export default function GuidePage({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <HtmlLang lang={lang} />
      <div lang={lang}>
        <div className="print:hidden">
          <Nav home={false} path="/docs" />
        </div>
        <Guide />
        <Footer />
      </div>
    </LangProvider>
  );
}
