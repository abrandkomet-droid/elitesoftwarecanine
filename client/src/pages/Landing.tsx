import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Dna, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold font-display tracking-tight text-white">
          ELITE CANINE
        </div>
        <a 
          href="/api/login"
          className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-sm font-medium backdrop-blur-sm"
        >
          Member Login
        </a>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next Gen Registry Live
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
          The Future of <br className="hidden md:block" /> Canine Genetics
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          A secure, verifiable registry for breeders who demand precision. 
          Track pedigrees, manage health records, and visualize genetic traits in one premium dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <a href="/api/login" className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-lg shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-all flex items-center gap-2">
            Get Started <ArrowRight className="w-5 h-5" />
          </a>
          <button className="px-8 py-4 rounded-xl bg-card border border-white/10 hover:bg-white/5 text-white font-semibold text-lg transition-all">
            View Live Demo
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto w-full px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          {[
            { 
              icon: ShieldCheck, 
              title: "Verified Lineage", 
              desc: "Immutable pedigree tracking with blockchain-inspired verification for absolute certainty."
            },
            { 
              icon: Dna, 
              title: "Genetic Insights", 
              desc: "Deep integration with health testing labs to visualize COI and hereditary traits."
            },
            { 
              icon: Globe, 
              title: "Global Standards", 
              desc: "Compliant with international breeding standards including FCI, AKC, and KC."
            }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 rounded-2xl text-left border-t border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20 relative z-10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground">
            © 2025 Elite Canine Registry. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
