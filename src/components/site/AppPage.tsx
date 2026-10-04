import Nav from "./Nav";
import Footer from "./Footer";
import AppDownload from "./AppDownload";
import HtmlLang from "./HtmlLang";
import { LangProvider, type Lang } from "./i18n";

/** The app download page, rendered at /app (English) and /bn/app (Bangla). */
export default function AppPage({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <HtmlLang lang={lang} />
      <div lang={lang}>
        <Nav home={false} path="/app" />
        <AppDownload apkUrl={process.env.MAYA_APK_URL || null} version={process.env.MAYA_APK_VERSION || null} />
        <Footer />
      </div>
    </LangProvider>
  );
}
