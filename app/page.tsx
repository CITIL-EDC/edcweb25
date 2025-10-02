import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import EventsSection from '@/components/EventsSection';

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <EventsSection />
    </main>
  );
}
