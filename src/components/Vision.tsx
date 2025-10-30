import { useState } from 'react';
import { Flag, Rocket, Target, Globe, Cpu, Network } from 'lucide-react';

export default function Vision() {
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);

  const roadmap = [
    {
      quarter: 'Q1 2024',
      status: 'completed',
      title: 'Launch',
      icon: Flag,
      color: 'green',
      achievements: [
        'RaceFi platform launch',
        'Real-time threat detection',
        'Dashboard v1.0',
        '10K+ users onboarded',
      ],
    },
    {
      quarter: 'Q2 2024',
      status: 'completed',
      title: 'Acceleration',
      icon: Rocket,
      color: 'blue',
      achievements: [
        'SpeedMind gamification',
        'Multi-chain support',
        'API v2.0 release',
        'Community leaderboards',
      ],
    },
    {
      quarter: 'Q3 2024',
      status: 'current',
      title: 'Expansion',
      icon: Target,
      color: 'red',
      achievements: [
        'AI predictive models',
        'Team competitions',
        'Enterprise features',
        'Mobile app beta',
      ],
    },
    {
      quarter: 'Q4 2024',
      status: 'upcoming',
      title: 'Global Scale',
      icon: Globe,
      color: 'purple',
      achievements: [
        'Global CDN deployment',
        '100+ blockchain support',
        'DAO governance launch',
        'Advanced analytics',
      ],
    },
    {
      quarter: 'Q1 2025',
      status: 'upcoming',
      title: 'AI Evolution',
      icon: Cpu,
      color: 'yellow',
      achievements: [
        'Self-learning AI models',
        'Zero-day threat prediction',
        'Automated patch deployment',
        'Cross-chain intelligence',
      ],
    },
    {
      quarter: 'Q2 2025',
      status: 'upcoming',
      title: 'Web3 Infrastructure',
      icon: Network,
      color: 'cyan',
      achievements: [
        'Decentralized security network',
        'Community-powered threat DB',
        'RaceFi token launch',
        'Global security alliance',
      ],
    },
  ];

  const statusColors = {
    completed: 'from-green-600/20 to-black border-green-600/50',
    current: 'from-red-600/30 to-black border-red-600',
    upcoming: 'from-gray-800 to-black border-gray-600/30',
  };

  const iconColors = {
    green: 'text-green-500',
    blue: 'text-blue-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    yellow: 'text-yellow-500',
    cyan: 'text-cyan-500',
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            The <span className="text-red-600">RaceFi</span> Vision
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Building the fastest, most intelligent blockchain security platform in the world.
            Our roadmap is a race track to the future.
          </p>
        </div>

        <div className="mb-20">
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-600 via-red-600/50 to-gray-600/30" />

            <div className="space-y-12">
              {roadmap.map((milestone, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setHoveredMilestone(index)}
                  onMouseLeave={() => setHoveredMilestone(null)}
                >
                  <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <div
                        className={`bg-gradient-to-br ${
                          statusColors[milestone.status as keyof typeof statusColors]
                        } border-2 rounded-2xl p-6 transition-all duration-300 ${
                          hoveredMilestone === index ? 'scale-105 shadow-2xl' : ''
                        }`}
                      >
                        <div className="text-sm text-gray-400 mb-2">{milestone.quarter}</div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2 justify-end">
                          {index % 2 === 0 && <span>{milestone.title}</span>}
                          <milestone.icon
                            className={`w-6 h-6 ${
                              iconColors[milestone.color as keyof typeof iconColors]
                            }`}
                          />
                          {index % 2 !== 0 && <span>{milestone.title}</span>}
                        </h3>

                        <div className={`space-y-2 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                          {milestone.achievements.map((achievement, achIndex) => (
                            <div
                              key={achIndex}
                              className="flex items-center space-x-2 text-sm text-gray-300"
                            >
                              {index % 2 !== 0 && (
                                <div className={`w-2 h-2 rounded-full ${
                                  milestone.status === 'completed'
                                    ? 'bg-green-500'
                                    : milestone.status === 'current'
                                    ? 'bg-red-500 animate-pulse'
                                    : 'bg-gray-600'
                                }`} />
                              )}
                              <span className="flex-1">{achievement}</span>
                              {index % 2 === 0 && (
                                <div className={`w-2 h-2 rounded-full ${
                                  milestone.status === 'completed'
                                    ? 'bg-green-500'
                                    : milestone.status === 'current'
                                    ? 'bg-red-500 animate-pulse'
                                    : 'bg-gray-600'
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>

                        {milestone.status === 'current' && (
                          <div className="mt-4 pt-4 border-t border-red-600/30">
                            <div className="text-xs text-red-500 font-bold uppercase tracking-wider">
                              In Progress
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-2/12 flex justify-center">
                      <div
                        className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                          milestone.status === 'completed'
                            ? 'bg-green-600 border-green-500'
                            : milestone.status === 'current'
                            ? 'bg-red-600 border-red-500 animate-pulse'
                            : 'bg-gray-800 border-gray-600'
                        } ${hoveredMilestone === index ? 'scale-125 shadow-2xl' : ''}`}
                      >
                        <milestone.icon
                          className={`w-8 h-8 ${
                            milestone.status === 'upcoming' ? 'text-gray-400' : 'text-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="w-5/12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-2xl p-8">
            <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              To make blockchain security as fast and reliable as Formula-1 pit stops. Every
              transaction deserves the protection of a world-class AI pit crew.
            </p>
            <p className="text-gray-400">
              We're building the infrastructure that makes Web3 safe for everyone — from individual
              developers to enterprise teams managing billions in assets.
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-2xl p-8">
            <h3 className="text-3xl font-bold mb-6">Our Values</h3>
            <div className="space-y-3">
              {[
                { icon: Rocket, text: 'Speed without compromise' },
                { icon: Flag, text: 'Security first, always' },
                { icon: Globe, text: 'Community-driven innovation' },
                { icon: Target, text: 'Continuous improvement' },
              ].map((value, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <value.icon className="w-5 h-5 text-red-500" />
                  <span className="text-gray-300">{value.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 rounded-2xl p-12 text-center shadow-2xl shadow-red-600/20">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Join the Race to Secure Web3
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Be part of the team building the future of blockchain security. Whether you're a
            developer, security researcher, or blockchain enthusiast — there's a place for you at RaceFi.
          </p>

          <div className="mt-8 pt-8 border-t border-white/20">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold mb-1">50K+</div>
                <div className="text-sm opacity-80">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">1M+</div>
                <div className="text-sm opacity-80">Threats Blocked</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">99.99%</div>
                <div className="text-sm opacity-80">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
