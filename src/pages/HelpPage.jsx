import React from 'react';
import { useTranslation } from 'react-i18next';
import { LifeBuoy, Mail } from 'lucide-react';
import './AppPage.css';

/**
 * HelpPage
 * Static FAQ + contact for the "Ayuda" sidebar entry.
 */
export default function HelpPage() {
  const { t } = useTranslation();

  const faqs = [
    { q: t('simplePages.help.faq.q1'), a: t('simplePages.help.faq.a1') },
    { q: t('simplePages.help.faq.q2'), a: t('simplePages.help.faq.a2') },
    { q: t('simplePages.help.faq.q3'), a: t('simplePages.help.faq.a3') },
  ];

  return (
    <div className="app-page">
      <div className="app-page-header">
        <h1 className="app-page-title">{t('simplePages.help.title')}</h1>
        <p className="app-page-subtitle">{t('simplePages.help.subtitle')}</p>
      </div>

      <section className="app-card">
        <div className="app-card-head">
          <span className="app-card-icon"><LifeBuoy size={20} aria-hidden="true" /></span>
          <span className="app-card-title">{t('simplePages.help.faqTitle')}</span>
        </div>
        <div className="app-card-body" style={{ margin: '12px 0 0' }}>
          {faqs.map((item, i) => (
            <div key={i} className="app-faq-item">
              <p className="app-faq-q">{item.q}</p>
              <p className="app-faq-a">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="app-card">
        <div className="app-card-head">
          <span className="app-card-icon"><Mail size={20} aria-hidden="true" /></span>
          <span className="app-card-title">{t('simplePages.help.contactTitle')}</span>
        </div>
        <p className="app-card-desc">{t('simplePages.help.contactText')}</p>
        <div className="app-card-body">
          <a className="app-btn primary" href="mailto:soporte@sara.app">
            <Mail size={16} aria-hidden="true" />
            {t('simplePages.help.contactButton')}
          </a>
        </div>
      </section>
    </div>
  );
}
