import { Menu, X, Flag, Zap, BarChart2, Code, Users, Eye, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavigationProps {
  activeSection: string;
}

export default function Navigation({ activeSection }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: <Flag className="w-4 h-4" /> },
    { id: 'how-it-works', label: 'How It Works', icon: <Zap className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'why', label: 'Why RaceFi', icon: <Flag className="w-4 h-4" /> },
    { id: 'developers', label: 'Developers', icon: <Code className="w-4 h-4" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> },
    { id: 'vision', label: 'Vision', icon: <Eye className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-0 bg-f1-black/90 backdrop-blur-md shadow-lg' : 'py-2 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-f1-accent rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative px-4 py-2 bg-f1-black rounded-lg ring-1 ring-f1-accent/50">
                <span className="font-display text-2xl font-extrabold bg-gradient-to-r from-f1-white to-f1-highlight bg-clip-text text-transparent">
                  RACEFI
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-2 group ${
                  activeSection === item.id
                    ? 'text-f1-highlight'
                    : 'text-f1-white/80 hover:text-f1-highlight'
                }`}
              >
                <span className="text-f1-accent group-hover:animate-pulse">
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {activeSection === item.id && (
                  <span className="w-1.5 h-1.5 bg-f1-accent rounded-full animate-pulse"></span>
                )}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-f1-white hover:text-f1-highlight hover:bg-f1-accent/10 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:hidden bg-f1-black/95 backdrop-blur-lg border-t border-f1-accent/20`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`flex items-center px-4 py-3 rounded-md text-base font-medium group ${
                activeSection === item.id
                  ? 'text-f1-highlight bg-f1-accent/10'
                  : 'text-f1-white/80 hover:text-f1-highlight hover:bg-f1-accent/5'
              }`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className={`mr-3 ${activeSection === item.id ? 'text-f1-accent' : 'text-f1-white/60'}`}>
                {item.icon}
              </span>
              {item.label}
              {activeSection === item.id && (
                <span className="ml-auto w-2 h-2 bg-f1-accent rounded-full animate-pulse"></span>
              )}
            </a>
          ))}
          <div className="pt-2 px-2">
            <a
              href="https://discord.gg/racefi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-f1-white bg-gradient-to-r from-f1-accent to-f1-orange hover:from-f1-accent/90 hover:to-f1-orange/90 shadow-md hover:shadow-f1-accent/30 transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Join Community
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
