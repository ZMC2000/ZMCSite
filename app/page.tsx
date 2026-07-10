import AboutIntro from "./components/about-intro";
import Header from "./components/header";
import ServicesSection from "./components/services-section";
import SupportServices from "./components/support-services";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <AboutIntro />
      <ServicesSection/>
      <SupportServices/>
    </main>
  );
}
