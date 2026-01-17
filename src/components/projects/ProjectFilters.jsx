import React from 'react';
import { useTranslation } from 'react-i18next';
import FilterGroup from '../common/FilterGroup';
import { PROJECT_STATUS } from '../../types/projectTypes';

export default function ProjectFilters({
  filterStatus,
  onFilterStatusChange,
  filterOrg,
  onFilterOrgChange,
  organizations = []
}) {
  const { t } = useTranslation();

  return (
    <div style={styles.filters}>
      <FilterGroup
        label={t('projectFilters.status')}
        value={filterStatus}
        onChange={(e) => onFilterStatusChange(e.target.value)}
        options={[
          { value: 'all', label: t('projectFilters.all') },
          { value: PROJECT_STATUS.DRAFT, label: t('projectStatus.draft') },
          { value: PROJECT_STATUS.ACTIVE, label: t('projectStatus.active') },
          { value: PROJECT_STATUS.PAUSED, label: t('projectStatus.paused') },
          { value: PROJECT_STATUS.COMPLETED, label: t('projectStatus.completed') },
          { value: PROJECT_STATUS.CANCELLED, label: t('projectStatus.cancelled') }
        ]}
      />

      <FilterGroup
        label={t('projectFilters.organization')}
        value={filterOrg}
        onChange={(e) => onFilterOrgChange(e.target.value)}
        options={[
          { value: 'all', label: t('projectFilters.allOrganizations') },
          ...organizations.map((org) => ({ value: org._id, label: org.name }))
        ]}
      />
    </div>
  );
}

const styles = {
  filters: {
    display: 'flex',
    gap: '20px',
    marginBottom: '32px',
    flexWrap: 'wrap'
  }
};
