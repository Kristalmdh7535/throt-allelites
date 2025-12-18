import HeroSection from "../components/HeroSection";
import FeaturedBikes from "../components/FeaturedBikes";
import ServicesSection from "../components/Services";
import ContactForm from "../components/ContactForm";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedBikes />
      <ServicesSection />
      <ContactForm/>
    </>
  );
}