import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Search, Rocket, X, Loader, CheckCircle, Star, Eye } from 'lucide-react';
import EmployeeDetailPanel from '../../team/EmployeeDetailPanel';
import { SynergyImpactIndicator, TeamSynergyCard } from '../../team';

/**
 * TeamBuilderTab - Team management interface
 * 
 * Features:
 * - Current team display with removal capability
 * - Employee search and filter
 * - Multi-select with bulk assignment
 * - Match percentage indicators
 */
export default function TeamBuilderTab({
  project,
  currentTeam,
  filteredEmployees,
  synergy,
  synergyValidation,
  selectedEmployees,
  searchQuery,
  assignLoading,
  onSearchChange,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onAssign,
  onRemove
}) {
  const { t } = useTranslation();
  const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState(null);

  /**
   * @param {string} userId
   * @returns {import('../../../types/personality.jsdoc').SynergyValidation|undefined}
   */
  const getSynergyValidation = (userId) => {
    if (!Array.isArray(synergyValidation)) {
      return undefined;
    }
    return synergyValidation.find(v => v.userId === userId);
  };
  
  const hasSelection = selectedEmployees.length > 0;
  const canSelectAll = filteredEmployees.length > selectedEmployees.length;

  return (
    <>
    <div style={styles.container}>
      {/* Left Section - Current Team */}
      <div style={styles.leftSection}>
        <div style={styles.sectionHeader}>
          <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} />
            {t('projects.teamBuilder.sections.currentTeam')}
          </h3>
          <span style={styles.badge}>{currentTeam.length}</span>
        </div>

        {synergy && (
          <div>
            <TeamSynergyCard synergy={synergy} compact={false} />
          </div>
        )}

        {currentTeam.length === 0 ? (
          <div style={styles.emptyState}>
            <Rocket size={48} color="#6c757d" style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p style={styles.emptyTitle}>{t('projects.teamBuilder.empty.noTeamMembersTitle')}</p>
            <p style={styles.emptyText}>
              {t('projects.teamBuilder.empty.noTeamMembersText')}
            </p>
          </div>
        ) : (
          <div style={styles.teamList}>
            {currentTeam.map((member) => {
              const userId = member?.user?._id;
              const memberName = (typeof member?.user?.name === 'string' ? member.user.name : '').trim();
              const safeMemberName = memberName || t('projects.teamBuilder.fallbackMemberName', { defaultValue: 'Unknown user' });
              const memberInitial = safeMemberName.trim().charAt(0).toUpperCase();
              const memberEmail = typeof member?.user?.email === 'string' ? member.user.email : '';

              return (
              <div 
                key={userId ?? member.userId} 
                style={styles.teamCard}
                onClick={() => setSelectedEmployeeForDetails(member)}
              >
                <div style={styles.teamCardContent}>
                  <div style={styles.memberInfo}>
                    <div style={styles.memberAvatar}>
                      {memberInitial}
                    </div>
                    <div style={styles.memberDetails}>
                      <div style={styles.memberName}>{safeMemberName}</div>
                      <div style={styles.memberEmail}>{memberEmail}</div>
                      {member.role && (
                        <div style={styles.memberRole}>{member.role}</div>
                      )}
                    </div>
                  </div>
                  <div style={styles.teamCardActions}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (userId) onRemove(userId);
                      }}
                      style={styles.removeButton}
                      title={t('projects.teamBuilder.actions.removeFromTeam')}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Skills Preview */}
                {member.matchedSkills && member.matchedSkills.length > 0 && (
                  <div style={styles.skillsPreview}>
                    {member.matchedSkills.slice(0, 3).map((skill, idx) => {
                      const skillName = typeof skill === 'string' ? skill : skill.skill;
                      return (
                        <span key={`${userId ?? member.userId}-skill-${skillName}-${idx}`} style={styles.skillChip}>
                          {skillName}
                        </span>
                      );
                    })}
                    {member.matchedSkills.length > 3 && (
                      <span style={styles.skillMore}>
                        +{member.matchedSkills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Section - Available Employees */}
      <div style={styles.rightSection}>
        <div style={styles.sectionHeader}>
          <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                <button
                  onClick={onClearSelection}
                  style={styles.secondaryButton}
                >
                  {t('projects.teamBuilder.actions.clearWithCount', { count: selectedEmployees.length })}
                </button>
                <button
                  onClick={onAssign}
                  disabled={assignLoading}
                  style={styles.primaryButton}
                >
                  {assignLoading ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      {t('projects.teamBuilder.actions.assigning')}
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={14} />
                      {t('projects.teamBuilder.actions.assignWithCount', { count: selectedEmployees.length })}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <button
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
              const safeEmpName = empName || t('projects.teamBuilder.fallbackMemberName', { defaultValue: 'Unknown user' });
              const empEmail = typeof empUser.email === 'string' ? empUser.email : '';

              const isSelected = userId ? selectedEmployees.includes(userId) : false;
              const isRecommended = emp.isRecommended;
              const validation = userId ? getSynergyValidation(userId) : null;

              return (
                <div
                  key={userId}
                  style={{
                    ...styles.employeeCard,
                    ...(isSelected ? styles.selectedCard : {}),
                    ...(isRecommended ? styles.recommendedCard : {})
                  }}
                  onClick={() => setSelectedEmployeeForDetails(emp)}
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
                    />
                  </div>

                  {/* Employee Info */}
                  <div style={styles.employeeInfo}>
                    <div style={styles.employeeHeader}>
                      <div style={styles.employeeName}>
                        {safeEmpName}
                        {isRecommended && (
                          <span style={{ ...styles.recommendedBadge, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={14} />
                            <span>{t('projects.teamBuilder.badges.recommended')}</span>
                          </span>
                        )}
                      </div>
                      {/* Siempre mostrar match badge, incluso si es 0% */}
                      <div style={styles.matchBadge}>
                        {t('projects.teamBuilder.labels.matchPercent', { percent: emp.matchPercentage || 0 })}
                      </div>
                    </div>

                    <div style={styles.employeeEmail}>{empEmail}</div>
                    
                    {/* Mostrar posición/departamento si no hay skills */}
                    {emp.position && (
                      <div style={styles.employeePosition}>
                        {emp.position}{emp.department ? ` · ${emp.department}` : ''}
                      </div>
                    )}

                    {/* Matched Skills */}
                    {emp.matchedSkills && emp.matchedSkills.length > 0 && (
                      <div style={styles.skillsList}>
                        {emp.matchedSkills.slice(0, 4).map((skill, idx) => {
                          const skillName = typeof skill === 'string' ? skill : skill.skill;
                          return (
                            <span key={`${userId}-skill-${skillName}-${idx}`} style={styles.skillTag}>
                              {skillName}
                            </span>
                          );
                        })}
                        {emp.matchedSkills.length > 4 && (
                          <span style={styles.skillMore}>
                            +{emp.matchedSkills.length - 4}
                          </span>
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
    </div>

    {/* Employee Detail Panel */}
    {selectedEmployeeForDetails && (
      <EmployeeDetailPanel
        employee={selectedEmployeeForDetails}
        project={project}
        onClose={() => setSelectedEmployeeForDetails(null)}
        onAssign={(employeeId) => {
          onToggleSelection(employeeId);
          setSelectedEmployeeForDetails(null);
        }}
      />
    )}
  </>
  );
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '32px',
    height: '100%',
  },
  
  // Section Layout
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
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
    borderBottom: '2px solid #e1e4e8',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#24292e',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  titleIcon: {
    fontSize: '20px',
  },
  badge: {
    backgroundColor: '#f0f0f0',
    color: '#586069',
    fontSize: '13px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  
  // Empty State
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#24292e',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: '#586069',
    margin: 0,
    maxWidth: '300px',
  },
  
  // Team List (Current Team)
  teamList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto',
    maxHeight: '500px',
    paddingRight: '4px',
  },
  teamCard: {
    backgroundColor: '#fff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  teamCardContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  teamCardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  memberInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  memberAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
    flexShrink: 0,
  },
  memberDetails: {
    flex: 1,
    minWidth: 0,
  },
  memberName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#24292e',
    marginBottom: '2px',
  },
  memberEmail: {
    fontSize: '13px',
    color: '#586069',
  },
  memberRole: {
    fontSize: '12px',
    color: '#007bff',
    marginTop: '4px',
  },
  removeButton: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px solid #e1e4e8',
    backgroundColor: '#fff',
    color: '#dc3545',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  skillsPreview: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '8px',
  },
  skillChip: {
    backgroundColor: '#f0f7ff',
    color: '#0366d6',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 8px',
    borderRadius: '12px',
  },
  
  // Action Bar
  actionBar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid #e1e4e8',
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
    color: '#24292e',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  
  // Employee List
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
    border: '1px solid #e1e4e8',
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
    borderColor: '#ffc107',
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
    color: '#24292e',
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
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '12px',
    whiteSpace: 'nowrap',
  },
  employeeEmail: {
    fontSize: '13px',
    color: '#586069',
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
    backgroundColor: '#f6f8fa',
    color: '#24292e',
    fontSize: '12px',
    fontWeight: '500',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  skillMore: {
    fontSize: '12px',
    color: '#586069',
    fontWeight: '500',
  },

  synergyImpactRow: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #f1f3f5',
  },
};
