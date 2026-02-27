'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Loader2, Eye, EyeOff } from 'lucide-react';

interface BypassRequest {
  id: string;
  cookie: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: string;
  data?: any;
}

export default function DashboardPage() {
  const [requests, setRequests] = useState<BypassRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCookies, setShowCookies] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/bypass?type=history');
        if (res.ok) {
          const data = await res.json();
          setRequests(data.requests || []);
        }
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleShowCookie = (id: string) => {
    setShowCookies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const maskCookie = (cookie: string) => {
    if (cookie.length <= 10) return cookie;
    return cookie.substring(0, 5) + '•'.repeat(Math.max(0, cookie.length - 10)) + cookie.substring(cookie.length - 5);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/50 text-green-500';
      case 'failed':
        return 'bg-red-500/10 border-red-500/50 text-red-500';
      default:
        return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold gradient-text">
            ImHellAMo
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/submit" className="btn-primary text-sm">
              <Plus className="w-4 h-4 inline mr-2" />
              New Request
            </Link>
            <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Request History</h1>
            <p className="text-muted">View and manage all submitted bypass requests</p>
          </div>

          {loading ? (
            <div className="glass-effect rounded-lg p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
              <p className="text-muted">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="glass-effect rounded-lg p-12 text-center">
              <p className="text-muted mb-4">No requests yet</p>
              <Link href="/submit" className="btn-primary">
                <Plus className="w-4 h-4 inline mr-2" />
                Create First Request
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="glass-effect rounded-lg p-6 hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                        <span className="text-muted text-sm">
                          {new Date(request.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="bg-input rounded-lg p-4 mb-3">
                        <div className="flex justify-between items-center">
                          <code className="text-sm text-muted font-mono">
                            {showCookies[request.id] ? request.cookie : maskCookie(request.cookie)}
                          </code>
                          <button
                            onClick={() => toggleShowCookie(request.id)}
                            className="text-muted hover:text-foreground transition-colors"
                          >
                            {showCookies[request.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {request.status === 'success' && request.data && (
                        <div className="bg-input rounded-lg p-4">
                          <p className="text-xs text-muted font-semibold mb-2">Response Data:</p>
                          <pre className="text-xs text-muted overflow-x-auto max-h-40">
                            {JSON.stringify(request.data, null, 2)}
                          </pre>
                        </div>
                      )}

                      {request.status === 'failed' && request.data && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                          <p className="text-xs text-red-500">{request.data.error || 'Unknown error'}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Processing...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
