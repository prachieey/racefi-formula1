import { X, Shield, Mail, Code, Database } from 'lucide-react';
import { useState } from 'react';

interface AuditLapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuditLapModal({ isOpen, onClose }: AuditLapModalProps) {
  const [email, setEmail] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [blockchainType, setBlockchainType] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setEmail('');
      setContractAddress('');
      setBlockchainType('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-red-600/30 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-red-600/20 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-red-600/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-4">
                <Shield className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Start Your Audit Lap</h2>
              <p className="text-gray-400">Submit your smart contract for security audit</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-600 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* Contract Address */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <Code className="w-4 h-4 inline mr-2" />
                  Contract Address
                </label>
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-600 transition-colors font-mono text-sm"
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f..."
                />
              </div>

              {/* Blockchain Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <Database className="w-4 h-4 inline mr-2" />
                  Blockchain Type
                </label>
                <select
                  value={blockchainType}
                  onChange={(e) => setBlockchainType(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-600 transition-colors"
                >
                  <option value="">Select blockchain</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                  <option value="bsc">Binance Smart Chain</option>
                  <option value="arbitrum">Arbitrum</option>
                  <option value="optimism">Optimism</option>
                  <option value="solana">Solana</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all transform hover:scale-105"
              >
                Start Audit Lap
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-red-600/20">
              <div className="text-xs text-gray-400 text-center">
                What you'll get:
                <div className="mt-2 space-y-1">
                  <div>✓ Smart contract analysis</div>
                  <div>✓ Vulnerability detection</div>
                  <div>✓ Security report</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600/20 rounded-full mb-4 animate-bounce">
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-green-500">Audit Started!</h3>
            <p className="text-gray-400">Your contract is being analyzed</p>
          </div>
        )}
      </div>
    </div>
  );
}
