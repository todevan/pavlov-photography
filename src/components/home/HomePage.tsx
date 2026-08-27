import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { EditorialHero } from "@/components/home/EditorialHero";
import { EditorialNavbar } from "@/components/home/EditorialNavbar";
import { Faq } from "@/components/home/Faq";
import { FooterCta } from "@/components/home/FooterCta";
import { Portfolio } from "@/components/home/Portfolio";
import { Reviews } from "@/components/home/Reviews";
import { Services } from "@/components/home/Services";
import { Terms } from "@/components/home/Terms";
import { Videography } from "@/components/home/Videography";
import { FloatingCallButton } from "@/components/ui/FloatingCallButton";
import { homeContent } from "@/data/home-content";
import { homeEditorialContent } from "@/data/home-editorial-content";

export function HomePage() {
  return (
    <div className="home-editorial">
      <EditorialNavbar links={homeEditorialContent.nav} />
      <main className="relative overflow-x-clip pb-24 md:pb-0">
        <EditorialHero content={homeEditorialContent.hero} />
        <About content={homeContent.about} />
        <Services content={homeContent.services} />
        <Videography content={homeContent.videography} />
        <Portfolio content={homeContent.portfolio} />
        <Terms content={homeContent.terms} />
        <Reviews content={homeContent.reviews} />
        <Faq content={homeContent.faq} />
        <Contact content={homeContent.contact} />
      </main>
      <FooterCta content={homeContent.footerCta} />
      <FloatingCallButton phone={homeContent.contact.phone} />
    </div>
  );
}
