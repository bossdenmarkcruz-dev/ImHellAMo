import Link from "next/link";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-xl font-bold gradient-text">ImHellAMo</div>
          <div className="flex gap-4">
            <Link href="/dashboard" className="btn-secondary">
              Dashboard
            </Link>
            <Link href="/submit" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <span className="text-accent text-sm font-medium">Advanced Security Tools</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            The complete platform for <span className="gradient-text">secure Roblox</span> management
          </h1>

          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto text-balance">
            Your toolkit to bypass restrictions and validate accounts. Securely process,
            verify, and manage your Roblox data with enterprise-grade security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/submit" className="btn-primary text-lg">
              Try Now
              <ArrowRight className="inline ml-2 w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="btn-secondary text-lg">
              View Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
            {[
              { label: "Processed", value: "10K+" },
              { label: "Success Rate", value: "99.8%" },
              { label: "Response Time", value: "<1s" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat) => (
              <div key={stat.label} className="glass-effect rounded-lg p-6">
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">Powerful Features</h2>
          <p className="text-center text-muted mb-16 max-w-2xl mx-auto">
            Everything you need to securely manage and verify Roblox accounts
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Military-grade encryption and CSRF protection for all requests",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Process requests in milliseconds with our optimized infrastructure",
              },
              {
                icon: Lock,
                title: "Privacy First",
                description: "Your data is encrypted and never shared with third parties",
              },
            ].map((feature, i) => (
              <div key={i} className="glass-effect rounded-lg p-8">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-2xl mx-auto glass-effect rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted mb-8">
            Join thousands of developers using ImHellAMo to securely manage their Roblox infrastructure
          </p>
          <Link href="/submit" className="btn-primary text-lg">
            Start Using ImHellAMo
            <ArrowRight className="inline ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-muted text-sm">
          <div>© 2026 ImHellAMo. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
