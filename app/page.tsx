import Link from "next/link";
import { ArrowRight, Shield, Zap, Lock, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-xl font-bold gradient-text">ImHellAMo</div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="btn-secondary text-sm">
              Dashboard
            </Link>
            <Link href="/submit" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 inline-block">
              <span className="badge bg-primary/10 border-primary/50 text-primary">
                <CheckCircle className="w-3 h-3" />
                Production Ready
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-balance leading-tight">
              Secure <span className="gradient-text">Roblox</span> management made simple
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl text-balance">
              Advanced security tools for validating and managing Roblox accounts. 
              Enterprise-grade protection with lightning-fast processing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link href="/submit" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3">
                Try Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/dashboard" className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-3">
                View Dashboard
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16">
              {[
                { label: "Requests Processed", value: "10K+" },
                { label: "Success Rate", value: "99.8%" },
                { label: "Avg Response Time", value: "<1s" },
                { label: "System Uptime", value: "99.9%" },
              ].map((stat) => (
                <div key={stat.label} className="card-base group hover:border-primary/50 transition-all">
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to securely manage and validate Roblox accounts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Military-grade encryption, CSRF protection, and secure session management for all requests.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Process requests in milliseconds with our optimized, scalable infrastructure.",
              },
              {
                icon: Lock,
                title: "Privacy First",
                description: "Your data is encrypted end-to-end and never shared with third parties.",
              },
            ].map((feature, i) => (
              <div key={i} className="card-base group hover:border-primary/50 hover:shadow-card-hover transition-all">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Simple steps to get started</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Collect Cookie",
                description: "Extract your ROBLOSECURITY cookie from your browser"
              },
              {
                step: "02",
                title: "Submit Securely",
                description: "Upload with CSRF protection and end-to-end encryption"
              },
              {
                step: "03",
                title: "Instant Processing",
                description: "Get validated results within milliseconds"
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="card-base">
                  <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 border-t border-border">
        <div className="max-w-3xl mx-auto glass-effect rounded-2xl p-12 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground text-lg mb-8 text-balance">
            Join thousands of developers using ImHellAMo to securely manage their Roblox infrastructure
          </p>
          <Link href="/submit" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3">
            Start Using ImHellAMo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground text-sm">
          <div>© 2026 ImHellAMo. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
