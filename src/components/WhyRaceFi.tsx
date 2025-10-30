import { BarChart3, Zap, Shield, Brain, Users, Trophy } from 'lucide-react';

export default function WhyRaceFi() {
  const benefits = [
    {
      icon: Zap,
      title: 'Lightning Speed',
      description: 'Sub-millisecond threat detection and response times. Faster than any competitor.',
      stat: '<1ms',
      color: 'yellow',
    },
    {
      icon: Shield,
      title: 'AI-Powered Defense',
      description: 'Machine learning models trained on millions of attack patterns for predictive security.',
      stat: '99.9%',
      color: 'red',
    },
    {
      icon: Brain,
      title: 'Predictive Intelligence',
      description: 'Stop threats before they happen with advanced AI pattern recognition.',
      stat: '24/7',
      color: 'blue',
    },
    {
      icon: Users,
      title: 'Community-Driven',
      description: 'Learn from a global network of security experts and contribute to the ecosystem.',
      stat: '50K+',
      color: 'green',
    },
    {
      icon: Trophy,
      title: 'Gamified Learning',
      description: 'Master security concepts through engaging challenges and competitive leaderboards.',
      stat: 'Top 1%',
      color: 'purple',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Comprehensive dashboards with actionable insights for your entire infrastructure.',
      stat: '100%',
      color: 'orange',
    },
  ];

  const colorClasses: Record<string, string> = {
    yellow: 'from-yellow-600/20 to-black border-yellow-600/30 text-yellow-500',
    red: 'from-red-600/20 to-black border-red-600/30 text-red-500',
    blue: 'from-blue-600/20 to-black border-blue-600/30 text-blue-500',
    green: 'from-green-600/20 to-black border-green-600/30 text-green-500',
    purple: 'from-purple-600/20 to-black border-purple-600/30 text-purple-500',
    orange: 'from-orange-600/20 to-black border-orange-600/30 text-orange-500',
  };

  const comparisonData = [
    { label: 'Traditional Security', energy: 45, speed: 30, coverage: 60 },
    { label: 'Competitor A', energy: 60, speed: 50, coverage: 70 },
    { label: 'Competitor B', energy: 55, speed: 60, coverage: 65 },
    { label: 'RaceFi', energy: 95, speed: 98, coverage: 99 },
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Why Choose <span className="text-red-600">RaceFi</span>?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The only blockchain security platform built with Formula-1 engineering principles:
            speed, precision, and continuous optimization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group bg-gradient-to-br ${
                colorClasses[benefit.color]
              } border rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-black/30 group-hover:scale-110 transition-transform`}
                >
                  <benefit.icon className="w-6 h-6" />
                </div>
                <div className={`text-3xl font-bold`}>{benefit.stat}</div>
              </div>

              <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
              <p className="text-gray-300 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600/30 rounded-2xl p-8 mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">
            RaceFi vs. The Competition
          </h3>

          <div className="space-y-6">
            {comparisonData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-bold ${
                      item.label === 'RaceFi' ? 'text-red-500 text-lg' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-400">
                      Security: <span className="text-white font-bold">{item.energy}%</span>
                    </span>
                    <span className="text-gray-400">
                      Speed: <span className="text-white font-bold">{item.speed}%</span>
                    </span>
                    <span className="text-gray-400">
                      Coverage: <span className="text-white font-bold">{item.coverage}%</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="h-8 bg-black/50 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${
                        item.label === 'RaceFi'
                          ? 'bg-gradient-to-r from-red-600 to-red-500'
                          : 'bg-gray-700'
                      } transition-all duration-1000`}
                      style={{ width: `${item.energy}%` }}
                    />
                  </div>
                  <div className="h-8 bg-black/50 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${
                        item.label === 'RaceFi'
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                          : 'bg-gray-700'
                      } transition-all duration-1000`}
                      style={{ width: `${item.speed}%` }}
                    />
                  </div>
                  <div className="h-8 bg-black/50 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${
                        item.label === 'RaceFi'
                          ? 'bg-gradient-to-r from-green-600 to-green-500'
                          : 'bg-gray-700'
                      } transition-all duration-1000`}
                      style={{ width: `${item.coverage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-red-950/30 rounded-xl border border-red-600/30 text-center">
            <p className="text-lg text-gray-300">
              <span className="text-red-500 font-bold">RaceFi delivers superior protection</span>{' '}
              across all metrics while maintaining the lowest response times in the industry.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">The RaceFi Advantage</h3>
            <ul className="space-y-3">
              {[
                'AI pit crew working 24/7 on your security',
                'Predictive threat detection before attacks happen',
                'Gamified education for your entire team',
                'Real-time dashboard with actionable insights',
                'Global community of security experts',
                'Continuous learning from millions of transactions',
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Built for Every Team</h3>
            <div className="space-y-4">
              {[
                { role: 'Developers', desc: 'Integrate with your CI/CD pipeline in minutes' },
                { role: 'Security Teams', desc: 'Comprehensive audit trails and compliance reports' },
                { role: 'Executives', desc: 'High-level dashboards and risk assessments' },
                { role: 'Community', desc: 'Learn, compete, and grow with global experts' },
              ].map((team, index) => (
                <div key={index} className="p-4 bg-black/50 rounded-lg border border-red-600/20">
                  <div className="font-bold text-red-500 mb-1">{team.role}</div>
                  <div className="text-sm text-gray-400">{team.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
