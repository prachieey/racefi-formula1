import { useState } from 'react';
import { Code, Terminal, Key, Book, Copy, Check } from 'lucide-react';

export default function ForDevelopers() {
  const [activeTab, setActiveTab] = useState('javascript');
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const codeExamples = {
    javascript: `// Install RaceFi SDK
npm install @racefi/security-sdk

// Initialize RaceFi
import { RaceFi } from '@racefi/security-sdk';

const racefi = new RaceFi({
  apiKey: process.env.RACEFI_API_KEY,
  network: 'ethereum',
});

// Scan a smart contract
const result = await racefi.audit({
  contract: '0x1234...5678',
  deep: true,
});

// Monitor transactions in real-time
racefi.monitor.on('threat', (event) => {
  console.log('Threat detected:', event);
  // RaceFi auto-patches enabled!
});`,
    python: `# Install RaceFi SDK
pip install racefi-sdk

# Initialize RaceFi
from racefi import RaceFi

racefi = RaceFi(
    api_key=os.getenv('RACEFI_API_KEY'),
    network='ethereum'
)

# Scan a smart contract
result = racefi.audit(
    contract='0x1234...5678',
    deep=True
)

# Monitor transactions
@racefi.monitor.on('threat')
def handle_threat(event):
    print(f'Threat detected: {event}')
    # RaceFi auto-patches enabled!`,
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@racefi/contracts/RaceFiGuard.sol";

contract MySecureContract is RaceFiGuard {
    // Automatic protection enabled

    function transfer(address to, uint amount)
        public
        raceFiProtected  // Decorator adds real-time protection
    {
        // Your logic here
        // RaceFi monitors every call
    }

    // Gas optimization suggestions by RaceFi AI
    function batchTransfer(address[] calldata recipients)
        external
        raceFiOptimized
    {
        // Optimized by RaceFi
    }
}`,
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGetApiKey = () => {
    setShowApiKey(true);
    setTimeout(() => setShowApiKey(false), 5000);
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Built for <span className="text-red-600">Developers</span>
          </h2>
          <p className="text-xl text-gray-400">
            Integrate RaceFi's AI pit crew into your workflow in minutes
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600/30 rounded-2xl overflow-hidden">
            <div className="bg-black/50 border-b border-red-600/30 p-4">
              <div className="flex items-center space-x-2 mb-4">
                {['javascript', 'python', 'solidity'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === lang
                        ? 'bg-red-600 text-white'
                        : 'bg-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 relative">
              <button
                onClick={() => handleCopy(codeExamples[activeTab as keyof typeof codeExamples])}
                className="absolute top-4 right-4 p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors border border-red-600/30"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>

              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{codeExamples[activeTab as keyof typeof codeExamples]}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                <Terminal className="w-6 h-6 text-red-500" />
                <span>Quick Start</span>
              </h3>

              <ol className="space-y-4">
                {[
                  { step: 1, text: 'Install the RaceFi SDK for your platform' },
                  { step: 2, text: 'Get your API key from the RaceFi dashboard' },
                  { step: 3, text: 'Initialize RaceFi with your configuration' },
                  { step: 4, text: 'Start scanning and monitoring your contracts' },
                ].map((item) => (
                  <li key={item.step} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <span className="text-gray-300 mt-1">{item.text}</span>
                  </li>
                ))}
              </ol>

              <button
                onClick={handleGetApiKey}
                className="mt-6 w-full px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Key className="w-5 h-5" />
                <span>Get Your API Key</span>
              </button>

              {showApiKey && (
                <div className="mt-4 p-4 bg-green-950/30 border border-green-600/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Your API Key:</div>
                  <code className="text-green-500 break-all">
                    racefi_sk_demo_a1b2c3d4e5f6g7h8i9j0
                  </code>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-red-950/30 to-black border border-red-600/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Code className="w-5 h-5 text-red-500" />
                <span>Features</span>
              </h3>

              <div className="space-y-3">
                {[
                  'Real-time contract scanning',
                  'Automated vulnerability detection',
                  'Gas optimization suggestions',
                  'CI/CD pipeline integration',
                  'WebHook notifications',
                  'Custom security rules',
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-black/50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Book,
              title: 'Documentation',
              desc: 'Comprehensive guides and API references',
              link: 'View Docs',
            },
            {
              icon: Terminal,
              title: 'CLI Tools',
              desc: 'Command-line utilities for quick audits',
              link: 'Install CLI',
            },
            {
              icon: Code,
              title: 'Examples',
              desc: 'Production-ready code samples',
              link: 'Browse Examples',
            },
          ].map((resource, index) => (
            <button
              key={index}
              className="bg-gradient-to-br from-gray-900 to-black border border-red-600/30 rounded-2xl p-6 hover:border-red-600 transition-all transform hover:scale-105 text-left group"
            >
              <resource.icon className="w-10 h-10 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{resource.desc}</p>
              <div className="text-red-500 font-medium flex items-center space-x-2">
                <span>{resource.link}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-red-950/30 to-black border border-red-600/30 rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Need Help Getting Started?</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Our developer support team is here to help you integrate RaceFi into your project.
            Schedule a live demo to get started.
          </p>
          <div className="flex items-center justify-center">
            <a
              href="https://calendly.com/racefi/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent border-2 border-red-600 hover:bg-red-600/10 rounded-lg font-bold transition-all hover:scale-105 inline-block"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
