'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RotateCcw, Check, Zap, Lock, Shield } from 'lucide-react';

export default function SimulatePage() {
  const [cookie, setCookie] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Validating Cookie',
      description: 'Checking cookie format and integrity...',
      icon: Shield,
      duration: 1500,
    },
    {
      title: 'Connecting to Roblox',
      description: 'Establishing secure connection to Roblox servers...',
      icon: Zap,
      duration: 1500,
    },
    {
      title: 'Bypassing Restrictions',
      description: 'Processing bypass protocol with advanced algorithms...',
      icon: Lock,
      duration: 2000,
    },
    {
      title: 'Verifying Results',
      description: 'Validating and confirming successful processing...',
      icon: Check,
      duration: 1500,
    },
  ];

  const handleStart = async () => {
    if (!cookie.trim()) {
      alert('Please enter a cookie to simulate');
      return;
    }

    setIsRunning(true);
    setStep(0);

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          setStep(i + 1);
          resolve(null);
        }, steps[i].duration);
      });
    }

    setIsRunning(false);
  };

  const handleReset = () => {
    setStep(0);
    setIsRunning(false);
  };

  const mockResult = {
    userId: '1234567890',
    username: 'example_user',
    accountStatus: 'Active',
    trustLevel: '98%',
    lastUpdated: new Date().toLocaleTimeString(),
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
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-3">Bypass Simulator</h1>
            <p className="text-muted text-lg">
              Watch the bypass process unfold in real-time with our interactive demonstration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Cookie Input Section */}
            <div className="glass-effect rounded-lg p-8">
              <h2 className="text-xl font-bold mb-6">Cookie Input</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  Enter Simulation Cookie
                </label>
                <textarea
                  value={cookie}
                  onChange={(e) => setCookie(e.target.value)}
                  placeholder="Paste a sample cookie or ROBLOSECURITY token..."
                  disabled={isRunning}
                  className="w-full h-32 bg-input border border-border rounded-lg p-4 text-foreground placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleStart}
                  disabled={isRunning || !cookie.trim()}
                  className="flex-1 btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Simulation
                </button>
                <button
                  onClick={handleReset}
                  disabled={!isRunning && step === 0}
                  className="flex-1 btn-secondary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              {/* Status Indicator */}
              <div className="text-sm text-muted">
                {isRunning && <span className="text-accent">● Simulation running...</span>}
                {!isRunning && step > 0 && <span className="text-primary">● Simulation complete</span>}
                {!isRunning && step === 0 && <span>● Ready to start</span>}
              </div>
            </div>

            {/* Process Steps Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-6">Process Steps</h2>
              
              {steps.map((processStep, index) => {
                const Icon = processStep.icon;
                const isActive = index < step;
                const isCurrent = index === step - 1 && isRunning;
                
                return (
                  <div
                    key={index}
                    className={`glass-effect rounded-lg p-4 transition-all duration-300 ${
                      isCurrent
                        ? 'ring-2 ring-primary bg-primary/10'
                        : isActive
                        ? 'bg-primary/5'
                        : 'opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg flex-shrink-0 transition-all duration-300 ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-border text-muted'
                        }`}
                      >
                        {isActive ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{processStep.title}</h3>
                        <p className="text-sm text-muted">{processStep.description}</p>
                      </div>

                      {isCurrent && (
                        <div className="flex-shrink-0">
                          <div className="relative w-6 h-6">
                            <div className="absolute inset-0 bg-primary rounded-full animate-pulse" />
                            <div className="absolute inset-1 bg-background rounded-full" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results Section */}
          {step === steps.length && (
            <div className="mt-12 glass-effect rounded-lg p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Check className="w-6 h-6 text-primary" />
                Simulation Results
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-card rounded-lg p-4 border border-border/50">
                    <p className="text-sm text-muted mb-1">User ID</p>
                    <p className="font-mono text-lg">{mockResult.userId}</p>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border/50">
                    <p className="text-sm text-muted mb-1">Username</p>
                    <p className="font-mono text-lg">{mockResult.username}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-card rounded-lg p-4 border border-border/50">
                    <p className="text-sm text-muted mb-1">Account Status</p>
                    <p className="font-mono text-lg text-primary">{mockResult.accountStatus}</p>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border/50">
                    <p className="text-sm text-muted mb-1">Trust Level</p>
                    <p className="font-mono text-lg text-accent">{mockResult.trustLevel}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
                <p className="text-sm text-muted">
                  Last Updated: <span className="text-foreground font-mono">{mockResult.lastUpdated}</span>
                </p>
              </div>

              <p className="mt-6 text-sm text-muted text-center">
                This is a simulated demonstration. Real results will be returned when submitting actual cookies to the production endpoint.
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-12 glass-effect rounded-lg p-8">
            <h3 className="font-semibold mb-4 text-lg">About This Simulator</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <span className="text-primary flex-shrink-0 mt-1">•</span>
                <span>This simulator demonstrates the bypass workflow without making actual requests</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent flex-shrink-0 mt-1">•</span>
                <span>Use any text as input - no real validation occurs in simulation mode</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary flex-shrink-0 mt-1">•</span>
                <span>Results shown are mock data representing typical bypass processing</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent flex-shrink-0 mt-1">•</span>
                <span>To process real cookies, visit the Submit page</span>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-border flex gap-4">
              <Link href="/submit" className="btn-primary flex-1 text-center py-3">
                Submit Real Cookie
              </Link>
              <Link href="/dashboard" className="btn-secondary flex-1 text-center py-3">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
