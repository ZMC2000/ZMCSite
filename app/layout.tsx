import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import AdminRibbon from "./components/admin-ribbon";
import { cookies } from "next/headers";
import { LanguageProvider, type Language } from "./i18n/language-context";
import { Tajawal } from "next/font/google";

const arabicFont = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "Zarif Medical Center",
  description: "Trusted healthcare in Beirut since 1954.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLanguage: Language =
    cookieStore.get("zmc-language")?.value === "ar" ? "ar" : "en";

  return (
    <html
      lang={initialLanguage}
      dir={initialLanguage === "ar" ? "rtl" : "ltr"}
      className={arabicFont.variable}
    >
      <body>
        <LanguageProvider initialLanguage={initialLanguage}>
          <Navbar />
          <AdminRibbon />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
