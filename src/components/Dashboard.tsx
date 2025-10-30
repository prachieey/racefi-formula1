import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, Zap } from 'lucide-react';

export default function Dashboard() {
  const [rpm, setRpm] = useState(3000);
  const [speed, setSpeed] = useState(85);
  const [threats, setThreats] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRpm((prev) => 2000 + Math.random() * 3000);
      setSpeed((prev) => 80 + Math.random() * 20);
      setThreats((prev) => (Math.random() > 0.8 ? prev + 1 : prev));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const recentActivity = [
    { type: 'blocked', message: 'Reentrancy attack blocked', time: '2s ago', severity: 'high' },
    { type: 'scanned', message: 'Contract audit completed', time: '15s ago', severity: 'success' },
    { type: 'warning', message: 'Unusual gas pattern detected', time: '1m ago', severity: 'medium' },
    { type: 'blocked', message: 'Flash loan exploit prevented', time: '3m ago', severity: 'high' },
    { type: 'scanned', message: 'Transaction verified', time: '5m ago', severity: 'success' },
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            RaceFi <span className="text-red-600">Pit Wall</span>
          </h2>
          <p className="text-xl text-gray-400">
            Real-time monitoring and control center for your blockchain security
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black border border-red-600/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Activity className="w-6 h-6 text-red-500" />
              <span>Live Performance Metrics</span>
            </h3>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <svg className="transform -rotate-90" width="192" height="192">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="rgba(220, 38, 38, 0.2)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#dc2626"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(rpm / 8000) * 502.65} 502.65`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-red-500">{Math.round(rpm)}</div>
                    <div className="text-sm text-gray-400">RPM</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Security Engine</div>
              </div>

              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <svg className="transform -rotate-90" width="192" height="192">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="rgba(220, 38, 38, 0.2)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#dc2626"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(speed / 100) * 502.65} 502.65`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-red-500">{Math.round(speed)}%</div>
                    <div className="text-sm text-gray-400">Speed</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Protection Level</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/50 rounded-lg p-4 border border-green-600/30">
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <div className="text-2xl font-bold text-white">1,247</div>
                <div className="text-xs text-gray-400">Scans Today</div>
              </div>
              <div className="bg-black/50 rounded-lg p-4 border border-red-600/30">
                <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
                <div className="text-2xl font-bold text-white">{threats}</div>
                <div className="text-xs text-gray-400">Threats Blocked</div>
              </div>
              <div className="bg-black/50 rounded-lg p-4 border border-blue-600/30">
                <Clock className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-2xl font-bold text-white">0.8ms</div>
                <div className="text-xs text-gray-400">Avg Response</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>Live Activity Feed</span>
            </h3>

            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    activity.severity === 'high'
                      ? 'bg-red-950/30 border-red-600/30'
                      : activity.severity === 'success'
                      ? 'bg-green-950/30 border-green-600/30'
                      : 'bg-yellow-950/30 border-yellow-600/30'
                  } animate-fadeIn`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-3">
                    {activity.type === 'blocked' ? (
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    ) : activity.type === 'scanned' ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-yellow-500 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{activity.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Security Status</h3>
            <div className="space-y-4">
              {[
                { label: 'Smart Contract Integrity', value: 98 },
                { label: 'Transaction Safety', value: 100 },
                { label: 'Gas Optimization', value: 87 },
                { label: 'Code Quality', value: 95 },
              ].map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">{metric.label}</span>
                    <span className="text-white font-bold">{metric.value}%</span>
                  </div>
                  <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-1000 rounded-full"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Run Audit', icon: Activity },
                { label: 'View Reports', icon: TrendingUp },
                { label: 'Threat History', icon: AlertTriangle },
                { label: 'Get API Key', icon: Zap },
              ].map((action, index) => (
                <button
                  key={index}
                  className="p-4 bg-black/50 hover:bg-red-600/20 border border-red-600/30 hover:border-red-600 rounded-lg transition-all transform hover:scale-105 group"
                >
                  <action.icon className="w-6 h-6 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium">{action.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
