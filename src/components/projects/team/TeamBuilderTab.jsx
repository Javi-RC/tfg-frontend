import React from 'react';
import { Users, Search, Rocket, X, Loader, CheckCircle, Star } from 'lucide-react';

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
  const hasSelection = selectedEmployees.length > 0;
  const canSelectAll = filteredEmployees.length > selectedEmployees.length;

  return (
    <div style={styles.container}>
      {/* Left Section - Current Team */}
      <div style={styles.leftSection}>
        <div style={styles.sectionHeader}>
          <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} />
            Current Team
          </h3>
          <span style={styles.badge}>{currentTeam.length}</span>
        </div>

        {currentTeam.length === 0 ? (
          <div style={styles.emptyState}>
            <Rocket size={48} color="#6c757d" style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p style={styles.emptyTitle}>No team members yet</p>
            <p style={styles.emptyText}>
              Start building your team by selecting employees from the right panel
            </p>
          </div>
        ) : (
          <div style={styles.teamList}>
            {currentTeam.map((member) => (
              <div key={member.user._id} style={styles.teamCard}>
                <div style={styles.teamCardContent}>
                  <div style={styles.memberInfo}>
                    <div style={styles.memberAvatar}>
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.memberDetails}>
                      <div style={styles.memberName}>{member.user.name}</div>
                      <div style={styles.memberEmail}>{member.user.email}</div>
                      {member.role && (
                        <div style={styles.memberRole}>{member.role}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(member.user._id)}
                    style={styles.removeButton}
                    title="Remove from team"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Skills Preview */}
                {member.matchedSkills && member.matchedSkills.length > 0 && (
                  <div style={styles.skillsPreview}>
                    {member.matchedSkills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} style={styles.skillChip}>
                        {skill}
                      </span>
                    ))}
                    {member.matchedSkills.length > 3 && (
                      <span style={styles.skillMore}>
                        +{member.matchedSkills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Section - Available Employees */}
      <div style={styles.rightSection}>
        <div style={styles.sectionHeader}>
          <h3 style={{ ...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={20} />
            Available Employees
          </h3>
          <span style={styles.badge}>{filteredEmployees.length}</span>
        </div>

        {/* Search & Actions Bar */}
        <div style={styles.actionBar}>
          <input
            type="text"
            placeholder="Search by name, email, or skills..."
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
                  Clear ({selectedEmployees.length})
                </button>
                <button
                  onClick={onAssign}
                  disabled={assignLoading}
                  style={styles.primaryButton}
                >
                  {assignLoading ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      Assigning...
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={14} />
                      Assign {selectedEmployees.length}
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
                Select All
              </button>
            )}
          </div>
        </div>

        {/* Employee List */}
        {filteredEmployees.length === 0 ? (
          <div style={styles.emptyState}>
            <Search size={48} color="#6c757d" style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p style={styles.emptyTitle}>No employees found</p>
            <p style={styles.emptyText}>
              {searchQuery ? 'Try a different search term' : 'All employees are already assigned'}
            </p>
          </div>
        ) : (
          <div style={styles.employeeList}>
            {filteredEmployees.map((emp) => {
              const isSelected = selectedEmployees.includes(emp.user._id);
              const isRecommended = emp.isRecommended;

              return (
                <div
                  key={emp.user._id}
                  onClick={() => onToggleSelection(emp.user._id)}
                  style={{
                    ...styles.employeeCard,
                    ...(isSelected ? styles.selectedCard : {}),
                    ...(isRecommended ? styles.recommendedCard : {})
                  }}
                >
                  {/* Selection Checkbox */}
                  <div style={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={styles.checkboxInput}
                    />
                  </div>

                  {/* Employee Info */}
                  <div style={styles.employeeInfo}>
                    <div style={styles.employeeHeader}>
                      <div style={styles.employeeName}>
                        {emp.user.name}
                        {isRecommended && (
                          <span style={{ ...styles.recommendedBadge, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={14} />
                            <span>Recommended</span>
                          </span>
                        )}
                      </div>
                      {emp.matchPercentage > 0 && (
                        <div style={styles.matchBadge}>
                          {emp.matchPercentage}% match
                        </div>
                      )}
                    </div>

                    <div style={styles.employeeEmail}>{emp.user.email}</div>

                    {/* Matched Skills */}
                    {emp.matchedSkills && emp.matchedSkills.length > 0 && (
                      <div style={styles.skillsList}>
                        {emp.matchedSkills.slice(0, 4).map((skill, idx) => (
                          <span key={idx} style={styles.skillTag}>
                            {skill}
                          </span>
                        ))}
                        {emp.matchedSkills.length > 4 && (
                          <span style={styles.skillMore}>
                            +{emp.matchedSkills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
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
    transition: 'all 0.2s ease',
  },
  teamCardContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
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
};
