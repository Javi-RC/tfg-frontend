import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Rocket, X } from 'lucide-react';
import TeamSynergyCard from '../../team/TeamSynergyCard';

export default function TeamMemberList({ currentTeam, synergy, onSelectMember, onRemove }) {
  const { t } = useTranslation();

  return (
    <div style={styles.leftSection}>
      <div style={styles.sectionHeader}>
        <h3
          style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}
        >
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
          <p style={styles.emptyText}>{t('projects.teamBuilder.empty.noTeamMembersText')}</p>
        </div>
      ) : (
        <div style={styles.teamList}>
          {currentTeam.map((member) => {
            const userId = member?.user?._id;
            const memberName = (
              typeof member?.user?.name === 'string' ? member.user.name : ''
            ).trim();
            const safeMemberName =
              memberName ||
              t('projects.teamBuilder.fallbackMemberName', { defaultValue: 'Unknown user' });
            const memberInitial = safeMemberName.trim().charAt(0).toUpperCase();
            const memberEmail =
              typeof member?.user?.email === 'string' ? member.user.email : '';

            return (
              <div
                key={userId ?? member.userId}
                style={styles.teamCard}
                onClick={() => onSelectMember(member)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectMember(member); } }}
              >
                <div style={styles.teamCardContent}>
                  <div style={styles.memberInfo}>
                    <div style={styles.memberAvatar}>{memberInitial}</div>
                    <div style={styles.memberDetails}>
                      <div style={styles.memberName}>{safeMemberName}</div>
                      <div style={styles.memberEmail}>{memberEmail}</div>
                      {member.role && <div style={styles.memberRole}>{member.role}</div>}
                    </div>
                  </div>
                  <div style={styles.teamCardActions}>
                    <button type="button"
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
                    {member.matchedSkills.slice(0, 3).map((skill) => {
                      const skillName = typeof skill === 'string' ? skill : skill.skill;
                      return (
                        <span
                          key={skillName}
                          style={styles.skillChip}
                        >
                          {skillName}
                        </span>
                      );
                    })}
                    {member.matchedSkills.length > 3 && (
                      <span style={styles.skillMore}>+{member.matchedSkills.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  leftSection: {
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
    border: '1px solid var(--color-border)',
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
    backgroundColor: 'var(--color-accent-gradient-start)',
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
    color: 'var(--color-text-primary)',
    marginBottom: '2px',
  },
  memberEmail: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
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
    border: '1px solid var(--color-border)',
    backgroundColor: '#fff',
    color: 'var(--color-danger)',
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
  skillMore: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    fontWeight: '500',
  },
};
