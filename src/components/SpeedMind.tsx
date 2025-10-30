import { useState, useEffect } from 'react';
import { Gamepad2, Zap, Play, RotateCcw, X, Brain } from 'lucide-react';

interface LearningPopup {
  id: string;
  title: string;
  description: string;
  tip: string;
  icon: string;
}

export default function SpeedMind() {
  const [gameActive, setGameActive] = useState(false);
  const [carPosition, setCarPosition] = useState(50);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<LearningPopup | null>(null);

  const lessons: LearningPopup[] = [
    {
      id: 'left',
      title: 'Private Relay',
      description: 'Protect your IP address by routing traffic through private servers',
      tip: 'Use Private Relay to hide your location and identity from websites',
      icon: '🛡️',
    },
    {
      id: 'right',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your accounts',
      tip: '2FA prevents unauthorized access even if your password is compromised',
      icon: '🔐',
    },
    {
      id: 'up',
      title: 'Smart Contract Audit',
      description: 'Verify code safety before interacting with blockchain apps',
      tip: 'Always audit smart contracts to identify vulnerabilities',
      icon: '✅',
    },
    {
      id: 'down',
      title: 'Threat Detection',
      description: 'Real-time monitoring of suspicious activities',
      tip: 'Enable threat alerts to stay informed about security risks',
      icon: '⚠️',
    },
  ];

  const handleStart = () => {
    setGameActive(true);
    setScore(0);
    setLevel(1);
    setCarPosition(50);
  };

  const handleReset = () => {
    setGameActive(false);
    setScore(0);
    setLevel(1);
    setCarPosition(50);
  };

  const handleMouseClick = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (!gameActive) return;

    let newPosition = carPosition;
    let lesson: LearningPopup | null = null;

    switch (direction) {
      case 'left':
        newPosition = Math.max(10, carPosition - 15);
        lesson = lessons[0];
        break;
      case 'right':
        newPosition = Math.min(90, carPosition + 15);
        lesson = lessons[1];
        break;
      case 'up':
        newPosition = Math.max(10, carPosition - 15);
        lesson = lessons[2];
        break;
      case 'down':
        newPosition = Math.min(90, carPosition + 15);
        lesson = lessons[3];
        break;
    }

    setCarPosition(newPosition);
    setScore((prev) => prev + 100);
    setLevel((prev) => (prev < 5 ? prev + 1 : 5));

    if (lesson) {
      setCurrentLesson(lesson);
      setShowPopup(true);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!gameActive) return;

    const key = e.key.toLowerCase();
    
    // Check if it's an arrow key or WASD
    if (!['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 'd', 'w', 's'].includes(key)) {
      return;
    }

    e.preventDefault();

    let lesson: LearningPopup | null = null;
    let newPosition = carPosition;

    switch (key) {
      case 'arrowleft':
      case 'a':
        newPosition = Math.max(10, carPosition - 15);
        lesson = lessons[0];
        break;
      case 'arrowright':
      case 'd':
        newPosition = Math.min(90, carPosition + 15);
        lesson = lessons[1];
        break;
      case 'arrowup':
      case 'w':
        newPosition = Math.max(10, carPosition - 15);
        lesson = lessons[2];
        break;
      case 'arrowdown':
      case 's':
        newPosition = Math.min(90, carPosition + 15);
        lesson = lessons[3];
        break;
      default:
        return;
    }

    setCarPosition(newPosition);
    setScore((prev) => prev + 100);
    setLevel((prev) => (prev < 5 ? prev + 1 : 5));

    if (lesson) {
      setCurrentLesson(lesson);
      setShowPopup(true);
    }
  };

  // Add global keyboard listener
  useEffect(() => {
    if (!gameActive) return;

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameActive, carPosition, lessons]);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-3">
            SpeedMind <span className="text-red-600">AI</span>
          </h2>
          <p className="text-lg text-gray-400">
            Learn security through gamified racing challenges
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-xl p-4 text-center">
            <div className="text-sm text-gray-400 mb-1">Score</div>
            <div className="text-3xl font-bold text-red-500">{score}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-950/30 to-black border border-yellow-600/30 rounded-xl p-4 text-center">
            <div className="text-sm text-gray-400 mb-1">Level</div>
            <div className="text-3xl font-bold text-yellow-500">{level}/5</div>
          </div>
          <div className="bg-gradient-to-br from-green-950/30 to-black border border-green-600/30 rounded-xl p-4 text-center">
            <div className="text-sm text-gray-400 mb-1">Lessons</div>
            <div className="text-3xl font-bold text-green-500">4</div>
          </div>
        </div>

        {/* Game Track */}
        <div
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600/30 rounded-2xl p-8 mb-8"
        >
          {!gameActive ? (
            <div className="text-center py-20">
              <Gamepad2 className="w-20 h-20 text-red-500 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">🏁 Gamified Security Racing</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Race your car across the track! Use arrow keys or WASD to navigate and learn security concepts. Each direction teaches a different security lesson!
              </p>
              <button
                onClick={handleStart}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Racing</span>
              </button>
            </div>
          ) : (
            <div className="relative bg-black rounded-xl overflow-hidden mb-8 h-64 border border-gray-700">
              {/* Road */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black">
                {/* Lane Markings */}
                {[0, 25, 50, 75, 100].map((pos) => (
                  <div
                    key={pos}
                    className="absolute w-full h-1 bg-yellow-500/30"
                    style={{ top: `${pos}%` }}
                  />
                ))}
              </div>

              {/* Obstacles/Challenges */}
              <div className="absolute left-5 top-1/4 text-3xl">🛡️</div>
              <div className="absolute right-5 top-1/4 text-3xl">🔐</div>
              <div className="absolute left-1/2 top-1/3 text-3xl">✅</div>
              <div className="absolute left-1/3 bottom-1/4 text-3xl">⚠️</div>

              {/* Car */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-200"
                style={{ left: `${carPosition}%` }}
              >
                <div className="text-5xl animate-pulse">🏎️</div>
              </div>

              {/* Finish Line */}
              <div className="absolute bottom-0 right-0 w-full h-8 bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center">
                <div className="text-white font-bold text-sm">FINISH LINE</div>
              </div>
            </div>
          )}

          {/* Controls */}
          {gameActive && (
            <div className="space-y-4">
              <p className="text-center text-gray-400 text-sm mb-4">
                Use Arrow Keys or WASD to move • Click buttons to navigate
              </p>

              {/* Button Controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => handleMouseClick('left')}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Left</span>
                </button>
                <button
                  onClick={() => handleMouseClick('up')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>↑</span>
                  <span className="hidden sm:inline">Up</span>
                </button>
                <button
                  onClick={() => handleMouseClick('down')}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>↓</span>
                  <span className="hidden sm:inline">Down</span>
                </button>
                <button
                  onClick={() => handleMouseClick('right')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>→</span>
                  <span className="hidden sm:inline">Right</span>
                </button>
              </div>

              <button
                onClick={handleReset}
                className="w-full px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-all"
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Reset Race
              </button>
            </div>
          )}
        </div>

        {/* Learning Lessons */}
        <div className="grid md:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-gradient-to-br from-gray-900 to-black border border-red-600/30 rounded-xl p-5 hover:border-red-600/60 transition-all"
            >
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{lesson.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{lesson.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{lesson.description}</p>
                  <p className="text-xs text-yellow-500 font-semibold">💡 {lesson.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Popup Modal */}
      {showPopup && currentLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-red-600/30 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-red-600/20">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 p-2 hover:bg-red-600/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="text-6xl mb-4">{currentLesson.icon}</div>
              <h2 className="text-3xl font-bold mb-3 text-red-500">{currentLesson.title}</h2>
              <p className="text-gray-400 mb-4">{currentLesson.description}</p>

              <div className="bg-red-950/30 border border-red-600/30 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <Brain className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <p className="text-sm text-white font-semibold">{currentLesson.tip}</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 mb-6">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-bold text-yellow-500">+100 XP</span>
              </div>

              <button
                onClick={() => setShowPopup(false)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
              >
                Continue Racing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
