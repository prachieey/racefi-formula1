import { X, Flag, CheckCircle, Clock, Award, Zap, Shield, BarChart2, Users, Trophy } from 'lucide-react';

interface RaceRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RaceRoadmapModal({ isOpen, onClose }: RaceRoadmapModalProps) {
  if (!isOpen) return null;

  const roadmap = [
    {
      id: 1,
      title: 'Qualifying Round',
      description: 'Complete initial security challenges and assessments',
      icon: Flag,
      status: 'completed',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 2,
      title: 'Sprint Race',
      description: 'Fast-paced security challenges with time limits',
      icon: Zap,
      status: 'current',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      id: 3,
      title: 'Endurance Challenge',
      description: 'Longer, more complex security scenarios',
      icon: Shield,
      status: 'upcoming',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 4,
      title: 'Team Championship',
      description: 'Collaborate with others in team-based challenges',
      icon: Users,
      status: 'upcoming',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 5,
      title: 'Grand Finale',
      description: 'Ultimate security challenge with exclusive rewards',
      icon: Trophy,
      status: 'upcoming',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'current':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-red-600/30 rounded-2xl max-w-3xl w-full p-8 shadow-2xl shadow-red-600/20 my-8">
        <button
          onClick={onClose}
          className="fixed top-4 right-4 p-2 hover:bg-red-600/10 rounded-lg transition-colors bg-gray-900/80 backdrop-blur-sm z-50"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-4">
            <BarChart2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">RaceFi Grand Prix Roadmap</h2>
          <p className="text-gray-400">Your journey to becoming a security champion</p>
        </div>

        <div className="space-y-8">
          {roadmap.map((stage, index) => (
            <div 
              key={stage.id} 
              className={`relative pl-10 border-l-2 ${
                index === roadmap.length - 1 ? 'border-transparent' : 'border-gray-800'
              }`}
            >
              <div className="absolute -left-2.5 w-5 h-5 flex items-center justify-center">
                {getStatusIcon(stage.status)}
              </div>
              
              <div className={`p-4 rounded-lg ${stage.bgColor} ${stage.status === 'current' ? 'ring-2 ring-yellow-500/50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${stage.bgColor}`}>
                      <stage.icon className={`w-5 h-5 ${stage.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{stage.title}</h3>
                      <p className="text-sm text-gray-400">{stage.description}</p>
                    </div>
                  </div>
                  {stage.status === 'completed' && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      Completed
                    </span>
                  )}
                  {stage.status === 'current' && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-red-600/20">
          <p className="text-center text-sm text-gray-400">
            Progress through each stage to unlock new challenges and rewards
          </p>
        </div>
      </div>
    </div>
  );
}
