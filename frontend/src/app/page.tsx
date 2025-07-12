"use client";

import ModernHeader from "@/components/layout/ModernHeader";
import ModernHeroSection from "@/components/sections/ModernHeroSection";
import ModernMarketplaceSection from "@/components/sections/ModernMarketplaceSection";
import ModernPortfolioSection from "@/components/sections/ModernPortfolioSection";
import ModernStrategiesSection from "@/components/sections/ModernStrategiesSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      <ModernHeader />
      <ModernHeroSection />
      <ModernStrategiesSection />
      <ModernPortfolioSection />
      <ModernMarketplaceSection />

      {/* Modern Footer */}
      <footer className="relative py-20 px-6">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="glass-card p-12 rounded-3xl border border-white/10 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="text-2xl font-bold gradient-text">Yield-X</span>
            </div>

            <p className="text-white/70 mb-8 max-w-md mx-auto">
              The next generation of yield optimization on Solana blockchain
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {["Documentation", "GitHub", "Discord", "Twitter"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
                >
                  {link}
                </a>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-white/40 text-sm">
                © 2025 Yield-X Protocol. Built on Solana.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
