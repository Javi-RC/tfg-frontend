import { useMemo } from 'react';
import LandingHeader from './components/LandingHeader';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import AboutSection from './components/AboutSection';
import LandingFooter from './components/LandingFooter';
import { useActiveSection } from './hooks/useActiveSection';
import { NAV_LINKS } from './landingContent';
import './LandingPage.css';

/**
 * Public marketing page for SARA. Composes the landing sections and owns only
 * the cross-section concern: which nav anchor is currently active.
 */
export default function LandingPage() {
  const sectionIds = useMemo(() => NAV_LINKS.map(({ id }) => id), []);
  const activeSectionId = useActiveSection(sectionIds);

  return (
    <div className="landing">
      <LandingHeader activeSectionId={activeSectionId} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <LandingFooter />
    </div>
  );
}
