import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX, Trash2, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { getDeletionPrerequisites, deleteAccount } from '../api/account';
import DeleteAccountModal from '../components/account/DeleteAccountModal';
import DeletionBlockers from '../components/account/DeletionBlockers';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import i18n from '../i18n';

const CONFIRMATION_KEYWORDS = ['DELETE', 'ELIMINAR'];

const normalizeBlockers = (payload) => {
  const data = payload?.data ?? payload ?? {};
  const raw =
    data.blockers ||
    data.blocks ||
    data.prerequisites ||
    data.requirements ||
    data.issues ||
    data.data?.blockers ||
    data.data?.blocks ||
    [];

  const list = Array.isArray(raw) ? raw : [];

  if (list.length > 0) {
    return list.map((item, index) => {
      if (typeof item === 'string') {
        return {
          id: `blocker-${index}`,
          title: item,
          description: '',
        };
      }

      if (item && typeof item === 'object') {
        const title =
          item.title || item.reason || item.message || item.name || item.code || i18n.t('common.blockedItem');
        const description = item.description || item.detail || item.details || '';
        const action = item.action || item.resolution || item.nextStep || '';
        return {
          id: item.id || item.code || item.type || `blocker-${index}`,
          title,
          description,
          action,
        };
      }

      return {
        id: `blocker-${index}`,
        title: i18n.t('common.blockedItem'),
        description: '',
      };
    });
  }

  if (data.blocked || data.isBlocked || data.canDelete === false) {
    return [
      {
        id: 'blocked-generic',
        title: data.message || data.reason || i18n.t('common.accountCannotBeDeleted'),
        description: data.detail || '',
      },
    ];
  }

  return [];
};

const extractRequiresPassword = (payload) => {
  const data = payload?.data ?? payload ?? {};
  if (typeof data.requiresPassword === 'boolean') return data.requiresPassword;
  if (typeof data.data?.requiresPassword === 'boolean') return data.data.requiresPassword;
  return true;
};

export default function DeleteAccountPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blockers, setBlockers] = useState([]);
  const [requiresPassword, setRequiresPassword] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [success, setSuccess] = useState(false);

  const confirmationKeyword = t('accountDeletion.confirmation.keyword');

  const hasBlockers = blockers.length > 0;

  const fetchPrerequisites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDeletionPrerequisites();
      const normalized = normalizeBlockers(res);
      const passwordRequired = extractRequiresPassword(res);
      setBlockers(normalized);
      setRequiresPassword(passwordRequired);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          t('accountDeletion.errors.loadFailed')
      );
      setRequiresPassword(true);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPrerequisites();
  }, [fetchPrerequisites]);

  const resetForm = () => {
    setPassword('');
    setConfirmation('');
    setFormErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const normalizedConfirmation = useMemo(() => confirmation.trim().toUpperCase(), [confirmation]);

  const validateForm = () => {
    const errors = {};
    if (requiresPassword && !password.trim()) {
      errors.password = t('accountDeletion.errors.passwordRequired');
    }
    if (!confirmation.trim()) {
      errors.confirmation = t('accountDeletion.errors.confirmationRequired');
    } else if (!CONFIRMATION_KEYWORDS.includes(normalizedConfirmation)) {
      errors.confirmation = t('accountDeletion.errors.confirmationMismatch', {
        keyword: confirmationKeyword,
      });
    }
    return errors;
  };

  const handleDelete = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsDeleting(true);

    try {
      const confirmationValue = CONFIRMATION_KEYWORDS.includes(normalizedConfirmation)
        ? normalizedConfirmation
        : confirmationKeyword.toUpperCase();
      const payload = { confirmation: confirmationValue };
      if (requiresPassword) {
        payload.password = password.trim();
      }

      await deleteAccount(payload);

      setSuccess(true);
      setShowModal(false);
      setTimeout(() => {
        logout();
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err) {
      setFormErrors({
        submit:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          t('accountDeletion.errors.deleteFailed'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--color-bg-muted)',
          padding: '104px 20px 40px',
          fontFamily:
            'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        }}
      >
        <div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}
        >
          <ShieldX size={32} color="#16a34a" aria-hidden="true" />
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-text-primary)', marginTop: '16px' }}>
            {t('accountDeletion.success.title')}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            {t('accountDeletion.success.message')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-muted)',
        padding: '104px 20px 40px',
        fontFamily:
          'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gap: '24px' }}>
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <ShieldX size={26} color="#dc2626" aria-hidden="true" />
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
              {t('accountDeletion.pageTitle')}
            </h1>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            {t('accountDeletion.pageDescription')}
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger-bg)',
              color: 'var(--color-danger-hover)',
              fontSize: '14px',
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        <DeletionBlockers blockers={blockers} onRetry={fetchPrerequisites} loading={loading} />

        {!hasBlockers && !loading && (
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              display: 'grid',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <KeyRound size={20} color="#6b7280" aria-hidden="true" />
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                {t('accountDeletion.confirmation.readyTitle')}
              </h2>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              {t('accountDeletion.confirmation.readyDescription')}
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <SecondaryButton onClick={() => navigate('/')}>{t('common.back')}</SecondaryButton>
              <PrimaryButton
                onClick={() => setShowModal(true)}
                leftIcon={<Trash2 size={16} />}
                style={{ background: 'var(--color-danger)' }}
                aria-label={t('accountDeletion.actions.openModal')}
              >
                {t('accountDeletion.actions.openModal')}
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>

      <DeleteAccountModal
        open={showModal}
        onClose={closeModal}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        password={password}
        confirmation={confirmation}
        onPasswordChange={setPassword}
        onConfirmationChange={setConfirmation}
        errors={formErrors}
        confirmationKeyword={confirmationKeyword}
        requiresPassword={requiresPassword}
      />
    </div>
  );
}
