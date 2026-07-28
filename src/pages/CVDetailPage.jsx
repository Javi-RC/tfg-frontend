import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Edit, ArrowLeft } from 'lucide-react';
import { getOrganizationCV } from '../api/organization';
import SecondaryButton from '../components/SecondaryButton';
import PrimaryButton from '../components/PrimaryButton';
import CVWrapper from '../components/cv/CVWrapper';
import ContactSection from '../components/cv/ContactSection';
import ExperienceSection from '../components/cv/ExperienceSection';
import EducationSection from '../components/cv/EducationSection';
import SkillsSection from '../components/cv/SkillsSection';
import LanguagesSection from '../components/cv/LanguagesSection';
import ProjectsSection from '../components/cv/ProjectsSection';
import CertificationsSection from '../components/cv/CertificationsSection';
import LoadingState from '../components/cv/LoadingState';
import CVErrorBanner from '../components/cv/CVErrorBanner';

/**
 * CVDetailPage Component
 * Displays a CV submitted to an organization (read-only view)
 */
export default function CVDetailPage() {
  const { t, i18n } = useTranslation();
  const { orgId, cvId } = useParams();
  const navigate = useNavigate();

  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' }),
    [i18n.language]
  );

  useEffect(() => {
    loadCV();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, cvId]);

  const loadCV = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getOrganizationCV(orgId, cvId);

      // API format: { success: true, cv: {...} }
      const cvData = res.data?.cv || res.data?.data || res.data;
      setCv(cvData);
    } catch (err) {
      setError(err.response?.data?.error || err.message || t('cv.detailPage.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !cv) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#f5f7fa',
          padding: '124px 24px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '500px',
            textAlign: 'center',
            padding: '40px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}>
            <FileText size={64} color="#9ca3af" />
          </div>
          <h2
            style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-primary)' }}
          >
            {t('cv.cvNotFound')}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            {error || t('cv.detailPage.notFoundDescription')}
          </p>
          <SecondaryButton onClick={() => navigate(-1)}>
            <ArrowLeft size={16} style={{ marginRight: '6px' }} />
            {t('cv.detailPage.goBack')}
          </SecondaryButton>
        </div>
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        paddingTop: '104px',
      }}
      aria-label={t('cv.detailPage.aria.page')}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 24px',
        }}
      >
        {/* Header con información del candidato */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                margin: 0,
                marginBottom: '8px',
              }}
            >
              {cv.userId?.name || t('cv.detailPage.candidateCv')}
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--color-text-secondary)',
                margin: 0,
                marginBottom: '8px',
              }}
            >
              {cv.userId?.email || cv.contact?.email || t('cv.detailPage.noEmailProvided')}
            </p>
            {cv.submittedToOrganizationAt && (
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                }}
              >
                {t('cv.detailPage.submittedOn', {
                  date: dateFormatter.format(new Date(cv.submittedToOrganizationAt)),
                })}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {cv.organizationStatus && (
              <span
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  background:
                    cv.organizationStatus === 'accepted'
                      ? '#e8f5e9'
                      : cv.organizationStatus === 'rejected'
                        ? '#ffebee'
                        : cv.organizationStatus === 'reviewed'
                          ? '#e3f2fd'
                          : '#fff3e0',
                  color:
                    cv.organizationStatus === 'accepted'
                      ? '#2e7d32'
                      : cv.organizationStatus === 'rejected'
                        ? '#c62828'
                        : cv.organizationStatus === 'reviewed'
                          ? '#1565c0'
                          : '#f57c00',
                }}
              >
                {t(`cv.status.${cv.organizationStatus}`)}
              </span>
            )}
            <SecondaryButton onClick={() => navigate(-1)}>
              <ArrowLeft size={16} style={{ marginRight: '6px' }} />
              {t('cv.detailPage.backToList')}
            </SecondaryButton>
            <PrimaryButton onClick={loadCV}>{t('cv.detailPage.refresh')}</PrimaryButton>
          </div>
        </div>

        <CVErrorBanner error={error} />

        {/* Contenido del CV usando los componentes existentes */}
        <CVWrapper>
          <ContactSection cv={cv} editData={cv} editMode={false} />

          <ExperienceSection cv={cv} editData={cv} editMode={false} />

          <EducationSection cv={cv} editData={cv} editMode={false} />

          <SkillsSection cv={cv} editData={cv} editMode={false} />

          <LanguagesSection cv={cv} editData={cv} editMode={false} />

          <ProjectsSection cv={cv} editData={cv} editMode={false} />

          <CertificationsSection cv={cv} editData={cv} editMode={false} />

          {/* Notas de la organización */}
          {cv.organizationNotes && (
            <section style={{ marginBottom: '56px', marginTop: '56px' }}>
              <div
                style={{
                  background: '#fffbeb',
                  border: '2px solid #fbbf24',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'var(--color-warning-dark)',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Edit size={20} /> {t('cv.detailPage.organizationNotes')}
                </h2>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#78350f',
                    lineHeight: '1.6',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {cv.organizationNotes}
                </p>
              </div>
            </section>
          )}
        </CVWrapper>
      </div>
    </main>
  );
}
