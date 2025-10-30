import { X, Rocket, Zap, Shield, TrendingUp, Lock } from 'lucide-react';
import { useState } from 'react';

interface JoinRaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinRaceModal({ isOpen, onClose }: JoinRaceModalProps) {
  const [raceType, setRaceType] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setRaceType('');
    }, 2000);
  };

  const races = [
    {
      id: 'sprint',
      name: '🏃 Sprint Race',
      description: 'Quick 15-min security audit',
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-600/10',
      features: ['Fast scanning', 'Basic threats', 'Instant report']
    },
    {
      id: 'endurance',
      name: '🏁 Endurance Race',
      description: 'Deep 1-hour comprehensive audit',
      icon: Shield,
      color: 'text-red-500',
      bgColor: 'bg-red-600/10',
      features: ['Full analysis', 'All vulnerabilities', 'Detailed report']
    },
    {
      id: 'championship',
      name: '👑 Championship',
      description: 'Complete security certification',
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-600/10',
      features: ['Expert review', 'Compliance check', 'Certificate']
    },
    {
      id: 'learning',
      name: '📚 Learning Track',
      description: 'Gamified security education',
      icon: Lock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-600/10',
      features: ['Interactive lessons', 'Challenges', 'Leaderboard']
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-red-600/30 rounded-2xl max-w-2xl w-full p-8 shadow-2xl shadow-red-600/20 my-8">
        <button
          onClick={onClose}
          className="fixed top-4 right-4 p-2 hover:bg-red-600/10 rounded-lg transition-colors bg-gray-900/80 backdrop-blur-sm z-50"
        >
          <X className="w-6 h-6" />
        </button>

        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-4">
                <Rocket className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Join the Race</h2>
              <p className="text-gray-400">Choose your security racing experience</p>
            </div>

            {/* Race Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {races.map((race) => {
                const IconComponent = race.icon;
                return (
                  <div
                    key={race.id}
                    onClick={() => setRaceType(race.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 ${
                      raceType === race.id
                        ? 'border-red-600 bg-red-600/10'
                        : 'border-gray-700 bg-gray-900/50 hover:border-red-600/50'
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-10 h-10 ${race.bgColor} rounded-lg mb-3`}>
                      <IconComponent className={`w-5 h-5 ${race.color}`} />
                    </div>
                    <h3 className="font-bold text-white mb-1">{race.name}</h3>
                    <p className="text-xs text-gray-400 mb-3">{race.description}</p>
                    <div className="space-y-1">
                      {race.features.map((feature, idx) => (
                        <div key={idx} className="text-xs text-gray-500">
                          ✓ {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Race Type Selection Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <button
                type="submit"
                disabled={!raceType}
                className={`w-full px-6 py-3 rounded-lg font-bold transition-all transform ${
                  raceType
                    ? 'bg-red-600 hover:bg-red-700 hover:scale-105 cursor-pointer'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                Start Your Race
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-red-600/20">
              <div className="text-xs text-gray-400 text-center">
                By joining, you'll get access to:
                <div className="mt-2 space-y-1">
                  <div>✓ Real-time threat monitoring</div>
                  <div>✓ AI-powered security audits</div>
                  <div>✓ Gamified learning platform</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600/20 rounded-full mb-4 animate-bounce">
              <Rocket className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-green-500">Welcome to the Pit!</h3>
            <p className="text-gray-400">Your RaceFi journey begins now</p>
          </div>
        )}
      </div>
    </div>
  );
}
