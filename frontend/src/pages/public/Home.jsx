import { Helmet } from 'react-helmet-async';
import HeroSection from '../../components/home/HeroSection';
import StatsBar from '../../components/home/StatsBar';
import MaterialHighlights from '../../components/home/MaterialHighlights';
import QuickQuoteWidget from '../../components/home/QuickQuoteWidget';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import ProjectsTeaser from '../../components/home/ProjectsTeaser';
import Testimonials from '../../components/home/Testimonials';
import StoreInfo from '../../components/home/StoreInfo';
import CtaBanner from '../../components/home/CtaBanner';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Bhakat Hardware | Authorized AAC Blocks & Construction Supplies Midnapore</title>
        <meta
          name="description"
          content="Bhakat Hardware is Midnapore's premier distributor of AAC Blocks, construction chemicals (MYK Arment), tile adhesives (MYK Laticrete), and structural hardware. Est. 2008."
        />
        <meta
          name="keywords"
          content="Bhakat Hardware, AAC Blocks Midnapore, MYK Arment, MYK Laticrete, Building Materials Midnapore, West Bengal Construction Supplies"
        />
        <meta property="og:title" content="Bhakat Hardware | Certified Construction Materials" />
        <meta
          property="og:description"
          content="Direct factory authorized partner for AAC Blocks, waterproofing, and construction supplies in Midnapore, West Bengal."
        />
      </Helmet>

      <div className="w-full overflow-x-hidden">
        <HeroSection />
        <StatsBar />
        <MaterialHighlights />
        <QuickQuoteWidget />
        <WhyChooseUs />
        <ProjectsTeaser />
        <Testimonials />
        <StoreInfo />
        <CtaBanner />
      </div>
    </>
  );
}
