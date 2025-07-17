import ModernHeader from '@/components/layout/ModernHeader';
import AnalyticsSection from '@/components/sections/AnalyticsSection';
import { ModernHeroSection } from '@/components/sections/ModernHeroSection';
import ModernMarketplaceSection from '@/components/sections/ModernMarketplaceSection';
import ModernPortfolioSection from '@/components/sections/ModernPortfolioSection';
import StrategiesSection from '@/components/sections/StrategiesSection';
import { YieldProtocolOverview } from '@/components/sections/YieldProtocolOverview';
import DataModeIndicator from '@/components/ui/DataModeIndicator';
import DynamicBackground from '@/components/ui/DynamicBackground';
import SectionDivider from '@/components/ui/SectionDivider';
import SocialLinks from '@/components/ui/SocialLinks';
import YieldLogo from '@/components/ui/YieldLogo';
import { app } from '@/lib/stats.action';

export type Stats = NonNullable<
  Awaited<ReturnType<typeof app.stats.get>>['data']
>;
export type Strategy = NonNullable<
  Awaited<ReturnType<typeof app.contract.strategies.get>>['data']
>[number];

export default async function Home() {
  const [{ data }, { data: strategies }] = await Promise.all([
    app.stats.get(),
    app.contract.strategies.get(),
  ]);

  return (
    <main className="relative min-h-screen">
      <DynamicBackground />
      <DataModeIndicator />
      <ModernHeader />

      <div className="pt-10">{data && <ModernHeroSection stats={data} />}</div>

      <div className="py-8">
        <SectionDivider color="gradient" variant="wave" />
      </div>
      {data && <YieldProtocolOverview stats={data} />}

      <div className="py-8">
        <SectionDivider color="blue" variant="lightning" />
      </div>
      {data && strategies && (
        <StrategiesSection stats={data} strategies={strategies} />
      )}

      <div className="py-8">
        <SectionDivider color="purple" variant="dots" />
      </div>
      <ModernPortfolioSection />

      <div className="py-8">
        <SectionDivider color="green" variant="lines" />
      </div>
      <ModernMarketplaceSection />

      <div className="py-8">
        <SectionDivider color="gradient" variant="wave" />
      </div>
      <AnalyticsSection />

      <footer className="relative mt-16 px-6 py-24" id="footer">
        <div className="absolute inset-0">
          <div className="yieldx-glow-electric absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl" />
          <div className="yieldx-glow-neon absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full opacity-15 blur-3xl" />
          <div className="-translate-x-1/2 -translate-y-1/2 yieldx-glow-purple absolute top-1/2 left-1/2 h-64 w-64 transform rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="yieldx-card-glass p-16 text-center">
            <div className="mb-8 flex items-center justify-center space-x-6">
              <YieldLogo size="xl" variant="icon" />
              <YieldLogo size="2xl" variant="text" />
            </div>

            <p className="mx-auto mb-12 max-w-lg text-lg text-rgb(var(--yieldx-text-secondary))">
              The next generation of yield optimization on Solana blockchain
            </p>

            <SocialLinks
              className="mb-12"
              layout="grid"
              platforms={['docs', 'github', 'twitter', 'discord']}
              variant="inline"
            />

            <div className="border-rgb(var(--yieldx-border-primary)) border-t pt-10">
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
