import { PortfolioNavigation } from './PortfolioNavigation';
import { PortfolioHero } from './PortfolioHero';
import { FeaturedGamesSection } from './FeaturedGamesSection';
import { UnrealSystemsSection } from './UnrealSystemsSection';
import { IndustryExperienceSection } from './IndustryExperienceSection';
import { RelevantWorkSection } from './RelevantWorkSection';
import { ArchivePreviewSection } from './ArchivePreviewSection';
import { ProfileSection } from './ProfileSection';
import { ContactSection } from './ContactSection';
import { PortfolioDitherBackground } from './PortfolioDitherBackground';
import './portfolio-structure.css';

export function PortfolioHome() {
  return (
    <div className="portfolio-shell">
      <PortfolioDitherBackground />
      <PortfolioNavigation />
      <main id="main-content" className="site-main" tabIndex={-1}>
        <PortfolioHero />
        <FeaturedGamesSection />
        <UnrealSystemsSection />
        <IndustryExperienceSection />
        <RelevantWorkSection />
        <ArchivePreviewSection />
        <ProfileSection />
        <ContactSection />
      </main>
    </div>
  );
}
