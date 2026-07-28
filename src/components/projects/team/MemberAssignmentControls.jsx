import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader, CheckCircle, Star } from 'lucide-react';
import SynergyImpactIndicator from '../../team/SynergyImpactIndicator';

export default function MemberAssignmentControls({
  filteredEmployees,
  synergyValidation,
  selectedEmployees,
  searchQuery,
  assignLoading,
  onSearchChange,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onAssign,
  onSelectEmployee,
}) {
  const { t } = useTranslation();
  const selectedEmployeesSet = useMemo(() => new Set(selectedEmployees), [selectedEmployees]);

  const getSynergyValidation = (userId) => {
    if (!Array.isArray(synergyValidation)) return undefined;
    return synergyValidation.find((v) => v.userId === userId);
  };

  const hasSelection = selectedEmployees.length > 0;
  const canSelectAll = filteredEmployees.length > selectedEmployees.length;

  return (
    <div style={styles.rightSection}>
      <div style={styles.sectionHeader}>
        <h3
          style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Search size={20} />
          {t('projects.teamBuilder.sections.availableEmployees')}
        </h3>
        <span style={styles.badge}>{filteredEmployees.length}</span>
      </div>

      {/* Search & Actions Bar */}
      <div style={styles.actionBar}>
        <input
          type="text"
          placeholder={t('projects.teamBuilder.actions.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.actionButtons}>
          {hasSelection ? (
            <>
              <button type="button" onClick={onClearSelection} style={styles.secondaryButton}>
                {t('projects.teamBuilder.actions.clearWithCount', {
                  count: selectedEmployees.length,
                })}
              </button>
              <button type="button" onClick={onAssign} disabled={assignLoading} style={styles.primaryButton}>
                {assignLoading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    {t('projects.teamBuilder.actions.assigning')}
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} />
                    {t('projects.teamBuilder.actions.assignWithCount', {
                      count: selectedEmployees.length,
                    })}
                  </span>
                )}
              </button>
            </>
          ) : (
            <button type="button"
              onClick={onSelectAll}
              disabled={!canSelectAll}
              style={styles.secondaryButton}
            >
              {t('common.selectAll')}
            </button>
          )}
        </div>
      </div>

      {/* Employee List */}
      {filteredEmployees.length === 0 ? (
        <div style={styles.emptyState}>
          <Search size={48} color="#6c757d" style={{ opacity: 0.3, marginBottom: '16px' }} />
          <p style={styles.emptyTitle}>{t('projects.teamBuilder.empty.noEmployeesTitle')}</p>
          <p style={styles.emptyText}>
            {searchQuery
              ? t('projects.teamBuilder.empty.tryDifferentSearch')
              : t('projects.teamBuilder.empty.allEmployeesAssigned')}
          </p>
        </div>
      ) : (
        <div style={styles.employeeList}>
          {filteredEmployees.map((emp) => {
            const empUser = emp?.user ?? {};
            const userId = empUser._id ?? emp.userId;
            const empName = (typeof empUser.name === 'string' ? empUser.name : '').trim();
            const safeEmpName =
              empName ||
              t('projects.teamBuilder.fallbackMemberName', { defaultValue: 'Unknown user' });
            const empEmail = typeof empUser.email === 'string' ? empUser.email : '';

            const isSelected = userId ? selectedEmployeesSet.has(userId) : false;
            const isRecommended = emp.isRecommended;
            const validation = userId ? getSynergyValidation(userId) : null;

            return (
              <div
                key={userId}
                style={{
                  ...styles.employeeCard,
                  ...(isSelected ? styles.selectedCard : {}),
                  ...(isRecommended ? styles.recommendedCard : {}),
                }}
                onClick={() => onSelectEmployee(emp)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectEmployee(emp); } }}
              >
                {/* Selection Checkbox */}
                <div style={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      if (userId) onToggleSelection(userId);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={styles.checkboxInput}
                    aria-label={safeEmpName}
                  />
                </div>

                {/* Employee Info */}
                <div style={styles.employeeInfo}>
                  <div style={styles.employeeHeader}>
                    <div style={styles.employeeName}>
                      {safeEmpName}
                      {isRecommended && (
                        <span
                          style={{
                            ...styles.recommendedBadge,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Star size={14} />
                          <span>{t('projects.teamBuilder.badges.recommended')}</span>
                        </span>
                      )}
                    </div>
                    <div style={styles.matchBadge}>
                      {t('projects.teamBuilder.labels.matchPercent', {
                        percent: emp.matchPercentage || 0,
                      })}
                    </div>
                  </div>

                  <div style={styles.employeeEmail}>{empEmail}</div>

                  {emp.position && (
                    <div style={styles.employeePosition}>
                      {emp.position}
                      {emp.department ? ` · ${emp.department}` : ''}
                    </div>
                  )}

                  {/* Matched Skills */}
                  {emp.matchedSkills && emp.matchedSkills.length > 0 && (
                    <div style={styles.skillsList}>
                      {emp.matchedSkills.slice(0, 4).map((skill) => {
                        const skillName = typeof skill === 'string' ? skill : skill.skill;
                        return (
                          <span
                            key={skillName}
                            style={styles.skillTag}
                          >
                            {skillName}
                          </span>
                        );
                      })}
                      {emp.matchedSkills.length > 4 && (
                        <span style={styles.skillMore}>+{emp.matchedSkills.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* Show synergy indicator for ALL employees */}
                  <div style={styles.synergyImpactRow}>
                    <SynergyImpactIndicator validation={validation} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '12px',
    borderBottom: '2px solid var(--color-border)',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badge: {
    backgroundColor: 'var(--color-border)',
    color: 'var(--color-text-secondary)',
    fontSize: '13px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    margin: 0,
    maxWidth: '300px',
  },
  actionBar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  primaryButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    whiteSpace: 'nowrap',
  },
  secondaryButton: {
    padding: '10px 16px',
    backgroundColor: '#fff',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  employeeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'auto',
    maxHeight: '500px',
    paddingRight: '4px',
  },
  employeeCard: {
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    gap: '12px',
  },
  selectedCard: {
    backgroundColor: '#f0f7ff',
    borderColor: '#007bff',
  },
  recommendedCard: {
    borderColor: 'var(--color-warning)',
    borderWidth: '2px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: '2px',
  },
  checkboxInput: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  employeeInfo: {
    flex: 1,
    minWidth: 0,
  },
  employeeHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '4px',
    gap: '12px',
  },
  employeeName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  recommendedBadge: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  matchBadge: {
    backgroundColor: 'var(--color-success)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '12px',
    whiteSpace: 'nowrap',
  },
  employeeEmail: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
  },
  employeePosition: {
    fontSize: '12px',
    color: '#0366d6',
    marginBottom: '8px',
    fontWeight: '500',
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  skillTag: {
    backgroundColor: 'var(--color-bg-muted)',
    color: 'var(--color-text-primary)',
    fontSize: '12px',
    fontWeight: '500',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  skillMore: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    fontWeight: '500',
  },
  synergyImpactRow: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #f1f3f5',
  },
};
