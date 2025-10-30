import { X, Users, Trophy, Zap } from 'lucide-react';
import { useState } from 'react';

interface TeamCompetitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamCompetitionsModal({ isOpen, onClose }: TeamCompetitionsModalProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  if (!isOpen) return null;

  const teams = [
    {
      id: 'alpha',
      name: 'Alpha Squad',
      members: 12,
      wins: 45,
      totalXP: 125000,
      rank: 1,
      badge: '🥇',
    },
    {
      id: 'beta',
      name: 'Beta Racers',
      members: 8,
      wins: 38,
      totalXP: 98000,
      rank: 2,
      badge: '🥈',
    },
    {
      id: 'gamma',
      name: 'Gamma Force',
      members: 15,
      wins: 32,
      totalXP: 87000,
      rank: 3,
      badge: '🥉',
    },
    {
      id: 'delta',
      name: 'Delta Team',
      members: 10,
      wins: 28,
      totalXP: 72000,
      rank: 4,
      badge: '⚡',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-red-600/30 rounded-2xl max-w-2xl w-full p-8 shadow-2xl shadow-red-600/20 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-red-600/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-4">
            <Users className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Team Competitions</h2>
          <p className="text-gray-400">Join or create a team and compete for glory</p>
        </div>

        {/* Teams List */}
        <div className="space-y-4 mb-8">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedTeam === team.id
                  ? 'border-red-600 bg-red-950/30'
                  : 'border-gray-700 bg-black/40 hover:border-red-600/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-3xl">{team.badge}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{team.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{team.members} members</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span>{team.wins} wins</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>{team.totalXP.toLocaleString()} XP</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-500">#{team.rank}</div>
                  <div className="text-xs text-gray-400">Rank</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            disabled={!selectedTeam}
            className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
              selectedTeam
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            Join Team
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-all"
          >
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
}
