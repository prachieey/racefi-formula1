import { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, Zap } from 'lucide-react';
import TeamCompetitionsModal from './TeamCompetitionsModal';
import WeeklyChallengesModal from './WeeklyChallengesModal';
import ExclusiveRewardsModal from './ExclusiveRewardsModal';

export default function Community() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showChallengesModal, setShowChallengesModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  const leaderboardData = [
    {
      rank: 1,
      name: 'CryptoGuardian',
      xp: 12450,
      badges: 24,
      avatar: '🏆',
      streak: 45,
      country: '🇺🇸',
    },
    {
      rank: 2,
      name: 'BlockDefender',
      xp: 11890,
      badges: 22,
      avatar: '🥈',
      streak: 38,
      country: '🇬🇧',
    },
    {
      rank: 3,
      name: 'SecureNode',
      xp: 10320,
      badges: 19,
      avatar: '🥉',
      streak: 32,
      country: '🇨🇦',
    },
    {
      rank: 4,
      name: 'ChainProtector',
      xp: 9875,
      badges: 18,
      avatar: '🛡️',
      streak: 28,
      country: '🇩🇪',
    },
    {
      rank: 5,
      name: 'SmartAuditor',
      xp: 9234,
      badges: 17,
      avatar: '⚡',
      streak: 25,
      country: '🇯🇵',
    },
  ];

  const badges = [
    { name: 'Security Master', icon: '🛡️', color: 'red', rarity: 'Legendary' },
    { name: 'Threat Hunter', icon: '🎯', color: 'orange', rarity: 'Epic' },
    { name: 'Speed Demon', icon: '⚡', color: 'yellow', rarity: 'Rare' },
    { name: 'Team Player', icon: '👥', color: 'blue', rarity: 'Uncommon' },
    { name: 'First Win', icon: '🏆', color: 'green', rarity: 'Common' },
  ];

  const achievements = [
    { title: '1000 Threats Blocked', progress: 847, total: 1000, icon: '🛡️' },
    { title: '100 Day Streak', progress: 67, total: 100, icon: '🔥' },
    { title: '50 Challenges Won', progress: 43, total: 50, icon: '🏁' },
  ];

  const features = [
    {
      icon: Users,
      title: 'Team Competitions',
      desc: 'Form racing teams and compete',
      stat: '2,500+ teams',
    },
    {
      icon: TrendingUp,
      title: 'Weekly Challenges',
      desc: 'New challenges every week',
      stat: 'Next in 2 days',
    },
    {
      icon: Trophy,
      title: 'Exclusive Rewards',
      desc: 'Earn NFT badges & premium',
      stat: '100+ rewards',
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-3">
            RaceFi <span className="text-red-600">Community</span>
          </h2>
          <p className="text-lg text-gray-400">
            Join a global network of security racers
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Leaderboard - Main Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600/30 rounded-2xl p-8">
              {/* Header with Period Filter */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold flex items-center space-x-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span>Global Leaderboard</span>
                </h3>

                <div className="flex space-x-2">
                  {['day', 'week', 'month', 'all'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedPeriod === period
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leaderboard List */}
              <div className="space-y-4">
                {leaderboardData.map((player) => (
                  <div
                    key={player.rank}
                    className={`p-5 rounded-xl border transition-all ${
                      player.rank <= 3
                        ? 'bg-gradient-to-r from-red-950/40 to-black border-red-600/40'
                        : 'bg-black/40 border-gray-700/40 hover:border-red-600/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Rank & Avatar */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={`text-2xl font-bold w-12 text-center ${
                            player.rank === 1
                              ? 'text-yellow-500'
                              : player.rank === 2
                              ? 'text-gray-400'
                              : player.rank === 3
                              ? 'text-orange-600'
                              : 'text-gray-500'
                          }`}
                        >
                          #{player.rank}
                        </div>
                        <div className="text-3xl">{player.avatar}</div>

                        {/* Player Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-bold text-white">{player.name}</span>
                            <span className="text-lg">{player.country}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Zap className="w-4 h-4 text-yellow-500" />
                              <span className="text-white font-semibold">{player.xp.toLocaleString()}</span>
                              <span>XP</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Trophy className="w-4 h-4 text-red-500" />
                              <span className="text-white font-semibold">{player.badges}</span>
                              <span>Badges</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Streak & Medal */}
                      <div className="flex items-center space-x-3">
                        {player.streak > 30 && (
                          <span className="text-xs bg-orange-600/20 text-orange-500 px-3 py-1 rounded-full border border-orange-600/30 whitespace-nowrap">
                            🔥 {player.streak}d
                          </span>
                        )}
                        {player.rank <= 3 && (
                          <div className="w-8">
                            {player.rank === 1 ? (
                              <Trophy className="w-8 h-8 text-yellow-500" />
                            ) : player.rank === 2 ? (
                              <Medal className="w-8 h-8 text-gray-400" />
                            ) : (
                              <Award className="w-8 h-8 text-orange-600" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Your Rank Card */}
              <div className="mt-8 p-5 bg-red-950/30 rounded-xl border border-red-600/30 text-center">
                <div className="text-sm text-gray-400 mb-2">Your Current Rank</div>
                <div className="text-3xl font-bold text-red-500 mb-1">#127</div>
                <div className="text-xs text-gray-400 flex items-center justify-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+23 from last week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Badges Section */}
            <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-5 flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>Your Badges</span>
              </h3>

              <div className="space-y-3">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="p-3 bg-black/50 rounded-lg border border-gray-700/50 flex items-center space-x-3 hover:border-red-600/30 transition-all"
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{badge.name}</div>
                      <div className="text-xs text-gray-500">{badge.rarity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-5">Achievements</h3>

              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="text-xl flex-shrink-0">{achievement.icon}</span>
                        <span className="text-sm font-medium text-white truncate">{achievement.title}</span>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-yellow-500 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (index === 0) setShowTeamModal(true);
                if (index === 1) setShowChallengesModal(true);
                if (index === 2) setShowRewardsModal(true);
              }}
              className="bg-gradient-to-br from-gray-900 to-black border border-red-600/30 rounded-2xl p-6 hover:border-red-600/60 transition-all transform hover:scale-105 cursor-pointer text-left"
            >
              <item.icon className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
              <div className="text-red-500 font-bold text-sm">{item.stat}</div>
            </button>
          ))}
        </div>

        {/* Modals */}
        <TeamCompetitionsModal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} />
        <WeeklyChallengesModal isOpen={showChallengesModal} onClose={() => setShowChallengesModal(false)} />
        <ExclusiveRewardsModal isOpen={showRewardsModal} onClose={() => setShowRewardsModal(false)} />
      </div>
    </div>
  );
}
