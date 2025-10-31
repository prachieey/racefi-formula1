import { useState, useEffect } from 'react';
import { 
  Zap, 
  FileText, 
  Key, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  X, 
  History,
  Copy,
  ExternalLink
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Mock data for demonstration
const MOCK_API_KEY = 'sk_test_' + Math.random().toString(36).substring(2, 28);

interface Finding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  recommendation: string;
  timestamp: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

// Mock API functions
const api = {
  runAudit: async (): Promise<{ success: boolean; auditId?: string; message?: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      auditId: 'audit_' + Math.random().toString(36).substring(2, 10),
      message: 'Audit started successfully'
    };
  },

  getApiKey: async (): Promise<{ success: boolean; apiKey?: string; message?: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      apiKey: MOCK_API_KEY,
      message: 'API key retrieved successfully'
    };
  },

  getAuditStatus: async (auditId: string): Promise<{ status: string; progress: number }> => {
    // Simulate progress
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      status: 'completed',
      progress: 100
    };
  },

  getThreats: async (): Promise<Finding[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    return [
      {
        id: 'threat_1',
        severity: 'high',
        title: 'Reentrancy Vulnerability',
        description: 'Potential reentrancy vulnerability in withdraw function',
        recommendation: 'Implement checks-effects-interactions pattern',
        timestamp: new Date().toISOString(),
        status: 'completed'
      },
      {
        id: 'threat_2',
        severity: 'medium',
        title: 'Unchecked External Call',
        description: 'External call return value not checked',
        recommendation: 'Check return value of external calls',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed'
      }
    ];
  }
};

// Notification component
const Notification = ({ type, message, onClose }: { type: 'success' | 'error' | 'info'; message: string; onClose: () => void }) => (
  <div className={`notification ${type}`}>
    <div className="notification-content">
      {type === 'success' ? (
        <CheckCircle className="notification-icon" size={20} />
      ) : type === 'error' ? (
        <AlertCircle className="notification-icon" size={20} />
      ) : (
        <AlertCircle className="notification-icon" size={20} />
      )}
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  </div>
);

// API Key Modal component
const ApiKeyModal = ({ apiKey, onClose }: { apiKey: string; onClose: () => void }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = apiKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Your API Key</h3>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="api-key-container">
          <code className="api-key">{apiKey}</code>
          <button 
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={copyToClipboard}
            aria-label="Copy API key to clipboard"
          >
            {copied ? (
              <>
                <CheckCircle size={16} /> Copied!
              </>
            ) : (
              <>
                <Copy size={16} /> Copy
              </>
            )}
          </button>
        </div>
        <p className="api-key-warning">
          <AlertCircle size={16} /> Keep this key secure and do not share it with others.
        </p>
      </div>
    </div>
  );
};

// Action Card Component
const ActionCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  isLoading = false,
  badge,
  className = ''
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  isLoading?: boolean;
  badge?: string;
  className?: string;
}) => (
  <div 
    className={`action-card ${className} ${isLoading ? 'loading' : ''}`}
    onClick={!isLoading ? onClick : undefined}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => !isLoading && e.key === 'Enter' && onClick()}
    aria-label={title}
  >
    <div className="action-icon">
      {isLoading ? (
        <Loader2 className="spin" size={32} />
      ) : (
        <Icon size={32} className="action-icon-svg" />
      )}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    {badge && <div className="action-badge">{badge}</div>}
  </div>
);

// Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState({
    runAudit: false,
    viewReports: false,
    threatHistory: false,
    getApiKey: false
  });
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info'; message: string} | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };
  const handleRunAudit = async () => {
    try {
      setIsLoading(prev => ({ ...prev, runAudit: true }));
      
      const contractAddress = prompt('Enter the contract address to audit:');
      const network = prompt('Enter the network (ethereum, polygon, bsc, avalanche):', 'ethereum');
      const sourceCode = prompt('Paste your contract source code:');
      const contractName = prompt('Enter the contract name:');

      if (!contractAddress || !network || !sourceCode || !contractName) {
        showNotification('error', 'All fields are required to run an audit');
        return;
      }
      
      const result = await api.runAudit(contractAddress, network, sourceCode, contractName);
      
      if (result.success && result.auditId) {
        showNotification('success', result.message || 'Audit started successfully!');
        // Simulate progress tracking
        let progress = 0;
        const interval = setInterval(async () => {
          const status = await api.getAuditStatus(result.auditId!);
          progress = status.progress;
          
          if (progress >= 100) {
            clearInterval(interval);
            showNotification('success', 'Audit completed successfully!');
            // Navigate to reports after a short delay
            setTimeout(() => {
              navigate('/reports');
            }, 1000);
          }
        }, 1000);
      } else {
        throw new Error(result.message || 'Failed to start audit');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start audit';
      showNotification('error', `Error: ${message}`);
    } finally {
      setIsLoading(prev => ({ ...prev, runAudit: false }));
    }
  };

  const handleViewReports = () => {
    navigate('/reports');
  };

  const handleThreatHistory = async () => {
    try {
      setIsLoading(prev => ({ ...prev, threatHistory: true }));
      // In a real app, we would fetch threats here
      await api.getThreats();
      navigate('/threat-history');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load threat history';
      showNotification('error', `Error: ${message}`);
    } finally {
      setIsLoading(prev => ({ ...prev, threatHistory: false }));
    }
  };

  const handleGetApiKey = async () => {
    try {
      setIsLoading(prev => ({ ...prev, getApiKey: true }));
      const result = await api.getApiKey();
      
      if (result.success && result.apiKey) {
        setApiKey(result.apiKey);
        setShowApiKeyModal(true);
      } else {
        throw new Error(result.message || 'Failed to get API key');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get API key';
      showNotification('error', `Error: ${message}`);
    } finally {
      setIsLoading(prev => ({ ...prev, getApiKey: false }));
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Quick Actions</h2>
        <p className="dashboard-description">Manage your smart contract security audits and API access</p>
      </div>
      
      <div className="quick-actions">
        <ActionCard
          icon={Zap}
          title="Run Audit"
          description="Start a new security audit for your smart contracts"
          onClick={handleRunAudit}
          isLoading={isLoading.runAudit}
          badge="New"
          className="action-audit"
        />
        
        <ActionCard
          icon={FileText}
          title="View Reports"
          description="View and analyze previous audit reports and findings"
          onClick={handleViewReports}
          isLoading={isLoading.viewReports}
          className="action-reports"
        />
        
        <ActionCard
          icon={History}
          title="Threat History"
          description="Review historical security threats and vulnerabilities"
          onClick={handleThreatHistory}
          isLoading={isLoading.threatHistory}
          className="action-history"
        />
        
        <ActionCard
          icon={Key}
          title="Get API Key"
          description="Generate a new API key for integration with CI/CD"
          onClick={handleGetApiKey}
          isLoading={isLoading.getApiKey}
          className="action-api"
        />
      </div>

      {showApiKeyModal && apiKey && (
        <ApiKeyModal 
          apiKey={apiKey} 
          onClose={() => setShowApiKeyModal(false)} 
        />
      )}

      {notification && (
        <Notification 
          type={notification.type} 
          message={notification.message} 
          onClose={() => setNotification(null)} 
        />
      )}
    </div>
  );
};

// Simple placeholder components for routes
const Reports = () => (
  <div className="page-container">
    <h2>Audit Reports</h2>
    <p>View and analyze your audit reports here.</p>
    <p className="coming-soon">Reports page coming soon!</p>
  </div>
);

const ThreatHistory = () => {
  const [threats, setThreats] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const data = await api.getThreats();
        setThreats(data);
      } catch (error) {
        console.error('Failed to fetch threats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, []);

  if (loading) {
    return (
      <div className="page-container loading-container">
        <Loader2 className="spin" size={32} />
        <p>Loading threat history...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>Threat History</h2>
      <div className="threats-list">
        {threats.length > 0 ? (
          threats.map((threat) => (
            <div key={threat.id} className={`threat-item threat-${threat.severity}`}>
              <div className="threat-header">
                <h3>{threat.title}</h3>
                <span className={`severity-badge ${threat.severity}`}>
                  {threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)}
                </span>
              </div>
              <p className="threat-description">{threat.description}</p>
              <div className="threat-footer">
                <div className="threat-recommendation">
                  <strong>Recommendation:</strong> {threat.recommendation}
                </div>
                <div className="threat-timestamp">
                  {new Date(threat.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No threats found.</p>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>RaceFi Security Dashboard</h1>
          <p className="app-subtitle">Smart Contract Security Analysis Platform</p>
        </header>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/threat-history" element={<ThreatHistory />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} RaceFi Security Dashboard. All rights reserved.</p>
          <div className="footer-links">
            <a href="/docs" target="_blank" rel="noopener noreferrer">
              Documentation <ExternalLink size={14} />
            </a>
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy <ExternalLink size={14} />
            </a>
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service <ExternalLink size={14} />
            </a>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;

// This function has been moved into the Dashboard component
  
  if (!contractAddress || !network || !sourceCode || !contractName) {
    alert('All fields are required');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/audits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({
        contractAddress,
        network,
        sourceCode,
        contractName,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to start audit');
    }

    alert(`Audit started! ID: ${data.data._id}\nStatus: ${data.data.status}`);
    
    // Poll for audit completion
    pollAuditStatus(data.data._id);
  } catch (error) {
    console.error('Error running audit:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    alert(`Failed to start audit: ${errorMessage}`);
  }
};

// Poll audit status until completed or failed
const pollAuditStatus = async (auditId: string) => {
  try {
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    
    const checkStatus = async () => {
      attempts++;
      
      const response = await fetch(`${API_BASE_URL}/audits/${auditId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check audit status');
      }
      
      const audit = data.data;
      
      if (audit.status === 'completed' || audit.status === 'failed' || attempts >= maxAttempts) {
        if (audit.status === 'completed') {
          alert(`Audit completed! Score: ${audit.score || 'N/A'}\nFindings: ${audit.findings.length}`);
        } else if (audit.status === 'failed') {
          alert('Audit failed. Please try again.');
        } else {
          alert('Audit is taking longer than expected. Please check back later.');
        }
        return;
      }
      
      // Check again in 10 seconds
      setTimeout(checkStatus, 10000);
    };
    
  } catch (error) {
    console.error('Error polling audit status:', error);
  }
};

// Navigation handler for viewing reports
const navigateToReports = () => {
  console.log('Navigating to reports');
  // This will be handled by the router
};
  }
};

// This function is now handled within the component

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState({
    runAudit: false,
    viewReports: false,
    threatHistory: false,
    getApiKey: false
  });
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRunAuditWithFeedback = async () => {
    try {
      setIsLoading(prev => ({ ...prev, runAudit: true }));
      await handleRunAudit();
      showNotification('success', 'Audit started successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start audit';
      showNotification('error', `Error: ${message}`);
    } finally {
      setIsLoading(prev => ({ ...prev, runAudit: false }));
    }
  };

  const handleViewReportsWithFeedback = async () => {
    try {
      setIsLoading(prev => ({ ...prev, viewReports: true }));
      navigate('/reports');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load reports';
      showNotification('error', `Error: ${message}`);
    } finally {
      setIsLoading(prev => ({ ...prev, viewReports: false }));
    }
  };

  const handleThreatHistory = async () => {
    try {
      setIsLoading(prev => ({ ...prev, threatHistory: true }));
      navigate('/threat-history');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load threat history';
      showNotification('error', `Error: ${message}`);
    } finally {
      setIsLoading(prev => ({ ...prev, threatHistory: false }));
    }
  };

  const handleGetApiKeyWithFeedback = async () => {
    try {
      setIsLoading(prev => ({ ...prev, getApiKey: true }));
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('error', 'Please log in to get your API key');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/apikey`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch API key');
      }

      setApiKey(data.apiKey);
      setShowApiKeyModal(true);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get API key';
      showNotification('error', `Error: ${message}`);
    } finally {
      setIsLoading(prev => ({ ...prev, getApiKey: false }));
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('success', 'API key copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showNotification('info', 'API key copied to clipboard!');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>RaceFi Security Dashboard</h1>
        <p className="app-subtitle">Smart Contract Security Analysis Platform</p>
      </header>
      
      <main className="main-content">
        <div className="dashboard-header">
          <h2>Quick Actions</h2>
          <p className="dashboard-description">Manage your smart contract security audits and API access</p>
        </div>
        
        <div className="quick-actions">
          <button 
            className="action-card"
            onClick={handleRunAuditWithFeedback}
            disabled={isLoading.runAudit}
            aria-label="Run Security Audit"
          >
            <div className="action-icon">
              {isLoading.runAudit ? (
                <Loader2 className="spin" size={32} />
              ) : (
                <Zap size={32} className="icon-zap" />
              )}
            </div>
            <h3>Run Audit</h3>
            <p>Start a new security audit for your smart contracts</p>
            <div className="action-badge">New</div>
          </button>
          
          <button 
            className="action-card"
            onClick={handleViewReportsWithFeedback}
            disabled={isLoading.viewReports}
            aria-label="View Audit Reports"
          >
            <div className="action-icon">
              {isLoading.viewReports ? (
                <Loader2 className="spin" size={32} />
              ) : (
                <FileText size={32} className="icon-file" />
              )}
            </div>
            <h3>View Reports</h3>
            <p>View and analyze previous audit reports and findings</p>
          </button>
          
          <button 
            className="action-card"
            onClick={handleThreatHistory}
            disabled={isLoading.threatHistory}
            aria-label="View Threat History"
          >
            <div className="action-icon">
              {isLoading.threatHistory ? (
                <Loader2 className="spin" size={32} />
              ) : (
                <History size={32} className="icon-history" />
              )}
            </div>
            <h3>Threat History</h3>
            <p>Review historical security threats and vulnerabilities</p>
          </button>
          
          <button 
            className="action-card"
            onClick={handleGetApiKeyWithFeedback}
            disabled={isLoading.getApiKey}
            aria-label="Get API Key"
          >
            <div className="action-icon">
              {isLoading.getApiKey ? (
                <Loader2 className="spin" size={32} />
              ) : (
                <Key size={32} className="icon-key" />
              )}
            </div>
            <h3>Get API Key</h3>
            <p>Generate a new API key for integration with CI/CD</p>
          </button>
        </div>

        {/* API Key Modal */}
        {showApiKeyModal && (
          <div className="modal-overlay" onClick={() => setShowApiKeyModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Your API Key</h3>
                <button 
                  className="close-button" 
                  onClick={() => setShowApiKeyModal(false)}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="api-key-container">
                <code className="api-key">{apiKey}</code>
                <button 
                  className="copy-button"
                  onClick={() => apiKey && copyToClipboard(apiKey)}
                  aria-label="Copy API key to clipboard"
                >
                  Copy
                </button>
              </div>
              <p className="api-key-warning">
                <AlertCircle size={16} /> Keep this key secure and do not share it with others.
              </p>
            </div>
          </div>
        )}

        {/* Notification System */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            <div className="notification-content">
              {notification.type === 'success' && <CheckCircle size={20} />}
              {notification.type === 'error' && <AlertCircle size={20} />}
              {notification.type === 'info' && <AlertCircle size={20} />}
              <span>{notification.message}</span>
              <button 
                className="notification-close"
                onClick={() => setNotification(null)}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} RaceFi Security Dashboard. All rights reserved.</p>
        <div className="footer-links">
          <a href="/docs" target="_blank" rel="noopener noreferrer">Documentation</a>
          <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}

export default App
