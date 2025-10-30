import { useState, useEffect } from 'react';
import { Zap, Shield, TrendingUp, ChevronRight, Briefcase } from 'lucide-react';
import JoinRaceModal from './JoinRaceModal';
import AuditLapModal from './AuditLapModal';

export default function Hero() {
  const [carPosition, setCarPosition] = useState(0);
  const [showJoinRaceModal, setShowJoinRaceModal] = useState(false);
  const [showAuditLapModal, setShowAuditLapModal] = useState(false);
  const [engineSound, setEngineSound] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarPosition((prev) => {
        if (prev >= 100) return 0;
        return prev + 0.5;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const handleStartJourney = () => {
    setEngineSound(true);
    setTimeout(() => setEngineSound(false), 1000);
    setShowAuditLapModal(true);
  };

  const handleViewPositions = () => {
    setEngineSound(true);
    setTimeout(() => setEngineSound(false), 1000);
    setShowJoinRaceModal(true);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-black to-black" />

      <div
        className={`absolute top-1/2 transition-all duration-1000 ${
          engineSound ? 'blur-sm scale-110' : ''
        }`}
        style={{
          left: `${carPosition}%`,
          transform: 'translateY(-50%)',
        }}
      >
        <div className="text-red-600 text-6xl animate-pulse">
          <svg width="120" height="60" viewBox="0 0 120 60" fill="currentColor">
            <path d="M10,30 Q30,20 50,30 L90,30 L110,40 L100,50 L20,50 L10,40 Z" />
            <circle cx="30" cy="50" r="8" fill="#1a1a1a" />
            <circle cx="85" cy="50" r="8" fill="#1a1a1a" />
            <path d="M50,20 L70,20 L75,30 L45,30 Z" fill="#dc2626" opacity="0.8" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 inline-flex items-center space-x-2 bg-red-600/10 border border-red-600/30 rounded-full px-4 py-2">
          <Zap className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-sm text-red-400 font-medium">AI-Powered Blockchain Security</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter">
          <span className="bg-gradient-to-r from-white via-red-100 to-red-600 bg-clip-text text-transparent">
            RACEFI
          </span>
        </h1>

        <p className="text-3xl md:text-4xl font-bold mb-4 text-red-500">
          Built for Speed. Secured for Trust.
        </p>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Your AI pit crew for blockchain security. Lightning-fast detection, instant protection,
          and gamified learning — all at Formula-1 speed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={handleStartJourney}
            className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/50 flex items-center space-x-2"
          >
            <Shield className="w-5 h-5" />
            <span>Start Your Journey</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleViewPositions}
            className="px-8 py-4 bg-transparent border-2 border-red-600 hover:bg-red-600/10 rounded-lg font-bold text-lg transition-all flex items-center space-x-2"
          >
            <Briefcase className="w-5 h-5" />
            <span>View Open Positions</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Zap, label: 'Real-Time Protection', value: '<1ms Response' },
            { icon: Shield, label: 'Threats Blocked', value: '1M+ Daily' },
            { icon: TrendingUp, label: 'Uptime', value: '99.99%' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/20 rounded-xl p-6 backdrop-blur-sm"
            >
              <stat.icon className="w-8 h-8 text-red-500 mb-3 mx-auto" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <AuditLapModal isOpen={showAuditLapModal} onClose={() => setShowAuditLapModal(false)} />
      <JoinRaceModal isOpen={showJoinRaceModal} onClose={() => setShowJoinRaceModal(false)} />
    </div>
  );
}
