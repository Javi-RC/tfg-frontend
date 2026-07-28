import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Lock,
  ShieldAlert,
  FileText,
  UserRound,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import heroIllustration from '../../assets/profile-hero.png';
import './ConsentGateView.css';

/**
 * ConsentGateView
 * Shown on the BFI-44 page when the user has not yet accepted the
 * personality-profiling consent. Mirrors the Sara dashboard styling.
 */
export default function ConsentGateView({ onShowConsentModal }) {
  const { t } = useTranslation();

  const features = [
    {
      key: 'secure',
      icon: Lock,
      variant: 'purple',
      title: t('personalityConsent.gate.features.secure.title'),
      desc: t('personalityConsent.gate.features.secure.desc'),
    },
    {
      key: 'responsible',
      icon: UserRound,
      variant: 'green',
      title: t('personalityConsent.gate.features.responsible.title'),
      desc: t('personalityConsent.gate.features.responsible.desc'),
    },
    {
      key: 'privacy',
      icon: EyeOff,
      variant: 'pink',
      title: t('personalityConsent.gate.features.privacy.title'),
      desc: t('personalityConsent.gate.features.privacy.desc'),
    },
  ];

  return (
    <div className="gate-card">
      {/* Hero */}
      <div className="gate-hero">
        <div className="gate-hero-dots" aria-hidden="true" />
        <div className="gate-hero-content">
          <div className="gate-hero-icon">
            <Lock size={30} aria-hidden="true" />
          </div>
          <h1 className="gate-title">{t('bfi44.bigFiveInventory')}</h1>
          <p className="gate-subtitle">{t('personalityConsent.consentNeededDescription')}</p>
          <span className="gate-badge">
            <ShieldAlert size={16} aria-hidden="true" />
            {t('personalityConsent.gate.consentRequired')}
          </span>
        </div>
        <img src={heroIllustration} alt="" aria-hidden="true" className="gate-hero-illustration" />
      </div>

      {/* Body */}
      <div className="gate-body">
        <div className="gate-body-icon">
          <FileText size={26} aria-hidden="true" />
        </div>
        <p className="gate-body-text">
          {t('personalityConsent.mustAcceptBeforeQuestionnaire')}
        </p>

        <div className="gate-features">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key} className="gate-feature">
                <div className={`gate-feature-icon ${f.variant}`}>
                  <Icon size={22} aria-hidden="true" />
                </div>
                <div className="gate-feature-title">{f.title}</div>
                <div className="gate-feature-desc">{f.desc}</div>
              </div>
            );
          })}
        </div>

        <div className="gate-divider" />

        <button type="button" className="gate-cta" onClick={onShowConsentModal}>
          <ShieldCheck size={20} aria-hidden="true" />
          {t('personalityConsent.reviewAndAccept')}
          <ArrowRight size={20} aria-hidden="true" />
        </button>

        <p className="gate-footnote">
          <Info size={15} aria-hidden="true" />
          {t('personalityConsent.gate.onlyOnce')}
        </p>
      </div>
    </div>
  );
}
