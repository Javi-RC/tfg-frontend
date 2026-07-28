import React, { useState } from 'react';
import EmployeeDetailPanel from '../../team/EmployeeDetailPanel';
import TeamMemberList from './TeamMemberList';
import MemberAssignmentControls from './MemberAssignmentControls';

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
  onRemove,
}) {
  const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState(null);

  return (
    <>
      <div style={styles.container}>
        <TeamMemberList
          currentTeam={currentTeam}
          synergy={synergy}
          onSelectMember={setSelectedEmployeeForDetails}
          onRemove={onRemove}
        />

        <MemberAssignmentControls
          filteredEmployees={filteredEmployees}
          synergyValidation={synergyValidation}
          selectedEmployees={selectedEmployees}
          searchQuery={searchQuery}
          assignLoading={assignLoading}
          onSearchChange={onSearchChange}
          onToggleSelection={onToggleSelection}
          onSelectAll={onSelectAll}
          onClearSelection={onClearSelection}
          onAssign={onAssign}
          onSelectEmployee={setSelectedEmployeeForDetails}
        />
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
};
