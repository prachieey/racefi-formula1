import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Dashboard from './components/Dashboard';
import WhyRaceFi from './components/WhyRaceFi';
import ForDevelopers from './components/ForDevelopers';
import Community from './components/Community';
import Vision from './components/Vision';
import Navigation from './components/Navigation';
import TrackBackground from './components/TrackBackground';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'how-it-works', 'dashboard', 'why', 'developers', 'community', 'vision'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <TrackBackground />
      <Navigation activeSection={activeSection} />

      <main>
        <section id="home">
          <Hero />
        </section>

        <section id="how-it-works">
          <HowItWorks />
        </section>

        <section id="dashboard">
          <Dashboard />
        </section>

        <section id="why">
          <WhyRaceFi />
        </section>

        <section id="developers">
          <ForDevelopers />
        </section>

        <section id="community">
          <Community />
        </section>

        <section id="vision">
          <Vision />
        </section>
      </main>
    </div>
  );
}

export default App;
