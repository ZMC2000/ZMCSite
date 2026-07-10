import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import AdminRibbon from "./components/admin-ribbon";

export const metadata: Metadata = {
  title: "Zarif Medical Center",
  description: "Trusted healthcare in Beirut since 1954.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <AdminRibbon />
        {children}
        <Footer />
      </body>
    </html>
  );
}
