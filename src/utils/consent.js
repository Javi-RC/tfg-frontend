export const isConsentAccepted = (consent) => {
  if (!consent || typeof consent !== 'object') return false;

  const accepted = Boolean(
    consent.accepted ??
    consent.isAccepted ??
    consent.hasAccepted ??
    consent?.details?.accepted
  );

  const aiProcessing = consent.aiProcessing ?? consent?.details?.aiProcessing;

  if (typeof aiProcessing === 'boolean') {
    return accepted && aiProcessing;
  }

  return accepted;
};

export const normalizeConsentResponse = (responseData) => {
  const root = responseData?.data ?? responseData ?? {};

  const consent =
    root.consent ??
    root?.data?.consent ??
    root?.cvProcessingConsent ??
    root?.user?.cvProcessingConsent ??
    root?.personalityConsent ??
    root?.data?.personalityConsent ??
    null;

  const hasConsent =
    typeof root?.hasConsent === 'boolean'
      ? root.hasConsent
      : typeof root?.data?.hasConsent === 'boolean'
        ? root.data.hasConsent
        : isConsentAccepted(consent);

  return {
    consent,
    hasConsent: Boolean(hasConsent)
  };
};
