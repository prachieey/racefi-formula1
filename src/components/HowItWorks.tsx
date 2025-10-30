import { useState } from 'react';
import { Flag, Shield, Gauge, Trophy, ChevronRight } from 'lucide-react';

export default function HowItWorks() {
  const [activeLap, setActiveLap] = useState(0);

  const laps = [
    {
      id: 0,
      icon: Flag,
      title: 'Audit Lap',
      flag: 'Green Flag',
      description: 'Deploy your smart contract and RaceFi\'s AI pit crew immediately begins scanning for vulnerabilities.',
      features: ['Real-time code analysis', 'Vulnerability detection', 'Security scoring'],
      color: 'green',
    },
    {
      id: 1,
      icon: Shield,
      title: 'Pit-Wall Lap',
      flag: 'Yellow Flag',
      description: 'When threats are detected, RaceFi instantly alerts and guides you through secure patches.',
      features: ['Instant threat alerts', 'Guided remediation', 'Auto-patching options'],
      color: 'yellow',
    },
    {
      id: 2,
      icon: Gauge,
      title: 'SpeedMind Lap',
      flag: 'Blue Flag',
      description: 'Learn security through interactive racing challenges and earn XP as you master blockchain defense.',
      features: ['Interactive tutorials', 'Gamified challenges', 'XP & achievements'],
      color: 'blue',
    },
    {
      id: 3,
      icon: Trophy,
      title: 'Reward Lap',
      flag: 'Checkered Flag',
      description: 'Climb the leaderboard, earn badges, and showcase your security expertise to the community.',
      features: ['Global leaderboard', 'Exclusive badges', 'Team competitions'],
      color: 'white',
    },
  ];

  const colorClasses = {
    green: 'from-green-600/20 to-black border-green-600/30 text-green-500',
    yellow: 'from-yellow-600/20 to-black border-yellow-600/30 text-yellow-500',
    blue: 'from-blue-600/20 to-black border-blue-600/30 text-blue-500',
    white: 'from-gray-600/20 to-black border-gray-400/30 text-white',
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            The RaceFi <span className="text-red-600">Circuit</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Every transaction is a race. Every threat is a hazard. RaceFi is your pit crew,
            keeping you on track at Formula-1 speed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            {laps.map((lap) => (
              <button
                key={lap.id}
                onClick={() => setActiveLap(lap.id)}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  activeLap === lap.id
                    ? `bg-gradient-to-r ${colorClasses[lap.color as keyof typeof colorClasses]} shadow-lg`
                    : 'bg-gray-900/50 border-gray-700 hover:border-red-600/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        activeLap === lap.id ? 'bg-black/30' : 'bg-red-600/10'
                      }`}
                    >
                      <lap.icon className={`w-6 h-6 ${activeLap === lap.id ? '' : 'text-red-500'}`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-400">{lap.flag}</div>
                      <div className="text-xl font-bold">{lap.title}</div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-6 h-6 transition-transform ${
                      activeLap === lap.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              className={`bg-gradient-to-br ${
                colorClasses[laps[activeLap].color as keyof typeof colorClasses]
              } border-2 rounded-2xl p-8 h-full`}
            >
              <div className="flex items-center space-x-3 mb-6">
                {(() => {
                  const LapIcon = laps[activeLap].icon;
                  return <LapIcon className="w-12 h-12" />;
                })()}
                <div>
                  <div className="text-sm font-medium opacity-70">{laps[activeLap].flag}</div>
                  <h3 className="text-3xl font-bold">{laps[activeLap].title}</h3>
                </div>
              </div>

              <p className="text-lg mb-6 text-gray-300">{laps[activeLap].description}</p>

              <div className="space-y-3">
                <div className="text-sm font-bold uppercase tracking-wider opacity-70">
                  Key Features
                </div>
                {laps[activeLap].features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-black/30 rounded-lg border border-current/20">
                <div className="text-xs uppercase tracking-wider mb-2 opacity-70">
                  Performance Metric
                </div>
                <div className="flex items-end space-x-2">
                  <div className="text-4xl font-bold">
                    {activeLap === 0 ? '<100ms' : activeLap === 1 ? '24/7' : activeLap === 2 ? '95%' : 'Top 1%'}
                  </div>
                  <div className="text-sm opacity-70 mb-1">
                    {activeLap === 0
                      ? 'scan time'
                      : activeLap === 1
                      ? 'monitoring'
                      : activeLap === 2
                      ? 'completion'
                      : 'ranking'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-red-950/30 to-black border border-red-600/30 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-4">
            RaceFi: Your AI Pit Crew
          </h3>
          <p className="text-gray-400 text-lg mb-6 max-w-3xl mx-auto">
            Giving your blockchain the speed of Formula-1 and pit-stop security. Prediction, prevention,
            education, and gamification — all in one powerful platform.
          </p>
          <button className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all transform hover:scale-105 inline-flex items-center space-x-2">
            <span>Experience the Full Circuit</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
