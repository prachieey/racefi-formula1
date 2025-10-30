import { X, Zap, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface WeeklyChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WeeklyChallengesModal({ isOpen, onClose }: WeeklyChallengesModalProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  if (!isOpen) return null;

  const challenges = [
    {
      id: 'threat-hunter',
      title: 'Threat Hunter',
      description: 'Block 500 threats this week',
      progress: 342,
      total: 500,
      reward: 5000,
      difficulty: 'Easy',
      icon: '🎯',
      status: 'active',
    },
    {
      id: 'speed-racer',
      title: 'Speed Racer',
      description: 'Complete 10 audits in under 5 minutes',
      progress: 7,
      total: 10,
      reward: 7500,
      difficulty: 'Medium',
      icon: '⚡',
      status: 'active',
    },
    {
      id: 'security-master',
      title: 'Security Master',
      description: 'Find 50 critical vulnerabilities',
      progress: 23,
      total: 50,
      reward: 10000,
      difficulty: 'Hard',
      icon: '🛡️',
      status: 'active',
    },
    {
      id: 'team-effort',
      title: 'Team Effort',
      description: 'Contribute 100,000 XP with your team',
      progress: 67000,
      total: 100000,
      reward: 12500,
      difficulty: 'Hard',
      icon: '👥',
      status: 'active',
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
            <Zap className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Weekly Challenges</h2>
          <p className="text-gray-400">Complete challenges and earn exclusive rewards</p>
        </div>

        {/* Challenges List */}
        <div className="space-y-4 mb-8">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => setSelectedChallenge(challenge.id)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedChallenge === challenge.id
                  ? 'border-red-600 bg-red-950/30'
                  : 'border-gray-700 bg-black/40 hover:border-red-600/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-3xl">{challenge.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{challenge.title}</h3>
                    <p className="text-sm text-gray-400">{challenge.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-lg font-bold text-yellow-500 mb-1">{challenge.reward} XP</div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    challenge.difficulty === 'Easy' ? 'bg-green-600/20 text-green-500' :
                    challenge.difficulty === 'Medium' ? 'bg-yellow-600/20 text-yellow-500' :
                    'bg-red-600/20 text-red-500'
                  }`}>
                    {challenge.difficulty}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs text-gray-400">{challenge.progress}/{challenge.total}</span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-yellow-500 rounded-full transition-all"
                    style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            disabled={!selectedChallenge}
            className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center space-x-2 ${
              selectedChallenge
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Accept Challenge</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
