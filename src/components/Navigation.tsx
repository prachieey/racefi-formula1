import { Flag, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  activeSection: string;
}

export default function Navigation({ activeSection }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'why', label: 'Why RaceFi' },
    { id: 'developers', label: 'Developers' },
    { id: 'community', label: 'Community' },
    { id: 'vision', label: 'Vision' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-red-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Flag className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-xl font-bold tracking-tight">RACEFI</div>
                <div className="text-xs text-gray-400">Built for Speed. Secured for Trust.</div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-red-600/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="h-6 w-px bg-gray-700 mx-2"></div>
              <a
                href="https://discord.gg/racefi"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded transition-colors"
              >
                Join Discord
              </a>
              <a
                href="https://calendly.com/racefi/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-transparent border-2 border-red-600 hover:bg-red-600/10 text-white text-sm font-medium rounded transition-colors"
              >
                Schedule Demo
              </a>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-red-600/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/95 backdrop-blur-lg pt-16">
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-red-600/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <a
                href="https://discord.gg/racefi"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left px-4 py-3 rounded-lg text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-center"
              >
                Join Discord
              </a>
              <a
                href="https://calendly.com/racefi/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left px-4 py-3 rounded-lg text-lg font-medium border-2 border-red-600 hover:bg-red-600/10 text-white transition-colors text-center"
              >
                Schedule Demo
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
