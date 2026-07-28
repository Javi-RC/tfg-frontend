import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, MessageSquare } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';

export default function FeedbackBanner({ feedbackStatus, onOpenRetrospective }) {
  const { t } = useTranslation();

  return (
    <div style={feedbackStatus === 'completed' ? styles.bannerCompleted : styles.banner}>
      <div style={styles.content}>
        {feedbackStatus === 'completed' ? (
          <CheckCircle2 size={24} color="#059669" />
        ) : (
          <MessageSquare size={24} color="#6366F1" />
        )}
        <div style={styles.text}>
          <h3 style={styles.title}>
            {feedbackStatus === 'completed'
              ? t('projectRetrospective.banner.completed')
              : t('projectRetrospective.banner.title')}
          </h3>
          <p style={styles.description}>
            {feedbackStatus === 'completed'
              ? t('projectRetrospective.banner.completedDescription')
              : t('projectRetrospective.banner.description')}
          </p>
        </div>
      </div>
      {feedbackStatus !== 'completed' && (
        <PrimaryButton onClick={onOpenRetrospective} leftIcon={<MessageSquare size={16} />}>
          {t('projectRetrospective.banner.action')}
        </PrimaryButton>
      )}
    </div>
  );
}

const styles = {
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '24px',
    background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
    borderRadius: '16px',
    marginBottom: '32px',
    border: '1px solid #C7D2FE',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
  },
  bannerCompleted: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '24px',
    background: 'linear-gradient(135deg, #ECFDF5 0%, var(--color-success-bg) 100%)',
    borderRadius: '16px',
    marginBottom: '32px',
    border: '1px solid #A7F3D0',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.1)',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: '1 1 auto',
    minWidth: '0',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    minWidth: '0',
  },
  title: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  description: {
    fontSize: '14px',
    color: '#4B5563',
    margin: 0,
  },
};
