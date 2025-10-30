import { X, Gift, Lock, Zap } from 'lucide-react';
import { useState } from 'react';

interface ExclusiveRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExclusiveRewardsModal({ isOpen, onClose }: ExclusiveRewardsModalProps) {
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  if (!isOpen) return null;

  const rewards = [
    {
      id: 'nft-badge-1',
      name: 'Security Master NFT',
      description: 'Exclusive NFT badge for top performers',
      cost: 50000,
      icon: '🎖️',
      rarity: 'Legendary',
      available: true,
    },
    {
      id: 'premium-features',
      name: 'Premium Features',
      description: 'Unlock advanced audit tools & analytics',
      cost: 25000,
      icon: '⭐',
      rarity: 'Epic',
      available: true,
    },
    {
      id: 'custom-avatar',
      name: 'Custom Avatar',
      description: 'Design your own unique profile avatar',
      cost: 15000,
      icon: '🎨',
      rarity: 'Rare',
      available: true,
    },
    {
      id: 'vip-status',
      name: 'VIP Status (1 Month)',
      description: 'Get VIP badge and exclusive perks',
      cost: 35000,
      icon: '👑',
      rarity: 'Epic',
      available: true,
    },
    {
      id: 'speed-boost',
      name: 'Speed Boost (7 Days)',
      description: '2x XP multiplier for one week',
      cost: 20000,
      icon: '⚡',
      rarity: 'Rare',
      available: true,
    },
    {
      id: 'team-banner',
      name: 'Custom Team Banner',
      description: 'Personalize your team profile',
      cost: 12000,
      icon: '🏁',
      rarity: 'Uncommon',
      available: true,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'from-yellow-600 to-orange-600';
      case 'Epic':
        return 'from-purple-600 to-pink-600';
      case 'Rare':
        return 'from-blue-600 to-cyan-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-red-600/30 rounded-2xl max-w-3xl w-full p-8 shadow-2xl shadow-red-600/20 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-red-600/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-4">
            <Gift className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Exclusive Rewards</h2>
          <p className="text-gray-400">Redeem your XP for premium rewards</p>
        </div>

        {/* Rewards Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              onClick={() => setSelectedReward(reward.id)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedReward === reward.id
                  ? 'border-red-600 bg-red-950/30'
                  : 'border-gray-700 bg-black/40 hover:border-red-600/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{reward.icon}</div>
                <div className={`px-2 py-1 rounded text-xs font-bold bg-gradient-to-r ${getRarityColor(reward.rarity)} text-white`}>
                  {reward.rarity}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{reward.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{reward.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-yellow-500">{reward.cost.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">XP</span>
                </div>
                {reward.available ? (
                  <span className="text-xs text-green-500 font-semibold">Available</span>
                ) : (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Your XP Balance */}
        <div className="p-5 bg-red-950/30 rounded-xl border border-red-600/30 mb-8 text-center">
          <div className="text-sm text-gray-400 mb-1">Your XP Balance</div>
          <div className="text-3xl font-bold text-yellow-500 flex items-center justify-center space-x-2">
            <Zap className="w-6 h-6" />
            <span>45,250 XP</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            disabled={!selectedReward}
            className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center space-x-2 ${
              selectedReward
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Redeem Reward</span>
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
