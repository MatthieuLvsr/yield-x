"use client";

import Image from "next/image";
import ModernHeader from "@/components/layout/ModernHeader";
import ModernHeroSection from "@/components/sections/ModernHeroSection";
import ModernMarketplaceSection from "@/components/sections/ModernMarketplaceSection";
import ModernPortfolioSection from "@/components/sections/ModernPortfolioSection";
import ModernStrategiesSection from "@/components/sections/ModernStrategiesSection";
import YieldProtocolOverview from "@/components/sections/YieldProtocolOverview";
import YieldLogo from "@/components/ui/YieldLogo";
import DataModeIndicator from "@/components/ui/DataModeIndicator";
import DynamicBackground from "@/components/ui/DynamicBackground";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <DynamicBackground />
      <DataModeIndicator />
      <ModernHeader />
      
      {/* Hero Section avec padding-top ajusté pour le header plus grand */}
      <div className="pt-24">
        <ModernHeroSection />
      </div>
      
      {/* Espacement amélioré entre les sections */}
      <div className="py-8">
        <SectionDivider variant="wave" color="gradient" />
      </div>
      <YieldProtocolOverview />
      
      <div className="py-8">
        <SectionDivider variant="lightning" color="blue" />
      </div>
      <ModernStrategiesSection />
      
      <div className="py-8">
        <SectionDivider variant="dots" color="purple" />
      </div>
      <ModernPortfolioSection />
      
      <div className="py-8">
        <SectionDivider variant="lines" color="green" />
      </div>
      <ModernMarketplaceSection />

      {/* Cyberpunk Footer avec plus d'espacement */}
      <footer className="relative py-24 px-6 mt-16" id="footer">
        {/* Background avec orbes cyberpunk */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 yieldx-glow-electric rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 yieldx-glow-neon rounded-full blur-3xl opacity-15"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 yieldx-glow-purple rounded-full blur-3xl opacity-10"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="yieldx-card-glass p-16 text-center">
            <div className="flex items-center justify-center space-x-6 mb-8">
              <YieldLogo variant="icon" size="xl" />
              <YieldLogo variant="text" size="2xl" />
            </div>

            <p className="text-rgb(var(--yieldx-text-secondary)) mb-12 max-w-lg mx-auto text-lg">
              The next generation of yield optimization on Solana blockchain
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {[
                { name: "Documentation", href: "#" },
                { name: "GitHub", href: "#" },
                { name: "Discord", href: "#" },
                { name: "Twitter", href: "#" }
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-rgb(var(--yieldx-text-tertiary)) hover:yieldx-text-electric transition-all duration-300 font-medium hover:scale-105 py-2"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-10 border-t border-rgb(var(--yieldx-border-primary))">
              <p className="text-rgb(var(--yieldx-text-tertiary))">
                © 2024 Yield-X Protocol. Building the future of DeFi on Solana.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
