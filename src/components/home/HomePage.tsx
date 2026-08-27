import { BeforeAfterFeature } from "@/components/home/BeforeAfterFeature";
import { EditorialContact } from "@/components/home/EditorialContact";
import { EditorialFaq } from "@/components/home/EditorialFaq";
import { EditorialHero } from "@/components/home/EditorialHero";
import { EditorialNavbar } from "@/components/home/EditorialNavbar";
import { EditorialReviews } from "@/components/home/EditorialReviews";
import { EditorialServices } from "@/components/home/EditorialServices";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SelectedWork } from "@/components/home/SelectedWork";
import { VideoFeature } from "@/components/home/VideoFeature";
import { WhyChooseMe } from "@/components/home/WhyChooseMe";
import { homeEditorialContent } from "@/data/home-editorial-content";

export function HomePage() {
  return (
    <div className="home-editorial">
      <EditorialNavbar links={homeEditorialContent.nav} />
      <main className="relative overflow-x-clip">
        <EditorialHero content={homeEditorialContent.hero} />
        <EditorialServices services={homeEditorialContent.services} />
        <SelectedWork items={homeEditorialContent.selectedWork} />
        <WhyChooseMe content={homeEditorialContent.why} />
        <BeforeAfterFeature content={homeEditorialContent.beforeAfter} />
        <VideoFeature content={homeEditorialContent.video} />
        <HowItWorks steps={homeEditorialContent.process} />
        <EditorialReviews content={homeEditorialContent.reviews} />
        <EditorialFaq items={homeEditorialContent.faq} />
        <EditorialContact content={homeEditorialContent.contact} />
      </main>
    </div>
  );
}
