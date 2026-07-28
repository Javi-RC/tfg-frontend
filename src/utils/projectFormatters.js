import i18n from '../i18n';

const t = (...args) => i18n.t(...args);

const dateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export const formatDate = (date) => {
  if (!date) return t('common.notAvailable');
  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) return t('common.notAvailable');
  return dateFormatter.format(dateObj);
};

export const translateProjectLevel = (value) => {
  if (!value) return t('common.notAvailable');
  const normalized = typeof value === 'string' ? value.toLowerCase() : value;
  return t(`projects.levels.${normalized}`, { defaultValue: value });
};

export const translateWorkMode = (value) => {
  if (!value) return t('common.notAvailable');
  const modeMap = {
    inherit_from_organization: t('projects.workMode.inherit'),
    office_mode: t('projects.workMode.officeMode'),
    office_first: t('projects.workMode.officeFirst'),
    office_remote_mix: t('projects.workMode.officeMix'),
    remote_first: t('projects.workMode.remoteFirst'),
    remote_mode: t('projects.workMode.remoteMode'),
  };
  return modeMap[value] || value;
};
