import React, { useState } from 'react';
import useTeamAnalysis from './team/useTeamAnalysis';
import ProjectHeader from './team/ProjectHeader';
import TabNavigation from './team/TabNavigation';
import AnalysisLoadingState from './team/AnalysisLoadingState';
import AnalysisErrorState from './team/AnalysisErrorState';
import TeamBuilderTab from './team/TeamBuilderTab';
import RiskAnalysisTab from './team/RiskAnalysisTab';
import TeamConfigModal from './TeamConfigModal';
import styles from './DraftTeamAnalysis.styles';

export default function DraftTeamAnalysis({ project, onProjectUpdate }) {
  const [activeTab, setActiveTab] = useState('team');
  const [showConfigModal, setShowConfigModal] = useState(false);

  const {
    teamAnalysis,
    currentTeamEmployees,
    riskAnalysis,
    loading,
    riskLoading,
    assignLoading,
    refreshing,
    error,
    selectedEmployees,
    searchQuery,
    setSearchQuery,
    loadAnalysis,
    loadRiskAnalysis,
    handleAssignSelected,
    handleRemoveEmployee,
    toggleEmployeeSelection,
    selectAllVisible,
    clearSelection,
    getFilteredEmployees,
    handleRefresh,
    handleRetryAnalysis,
    handleEditProject,
  } = useTeamAnalysis({ project, onProjectUpdate, activeTab });

  if (loading) return <AnalysisLoadingState />;
  if (error) return <AnalysisErrorState error={error} onRetry={loadAnalysis} />;

  const currentTeam =
    currentTeamEmployees.length > 0 ? currentTeamEmployees : teamAnalysis?.currentTeam || [];
  const filteredEmployees = getFilteredEmployees();
  const requiredTeamSize = project.teamSize || project.requiredTeamSize || 5;
  const teamCount = project.assignedEmployees?.length || 0;

  return (
    <div style={styles.container}>
      <ProjectHeader
        project={project}
        teamCount={teamCount}
        requiredTeamSize={requiredTeamSize}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onOpenConfig={() => setShowConfigModal(true)}
      />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCount={selectedEmployees.length}
        riskCount={riskAnalysis?.risks?.length || 0}
      />

      <div style={styles.tabContent}>
        {activeTab === 'team' && (
          <TeamBuilderTab
            project={project}
            currentTeam={currentTeam}
            filteredEmployees={filteredEmployees}
            synergy={teamAnalysis?.synergy || teamAnalysis?.teamSynergy}
            synergyValidation={teamAnalysis?.synergyValidation}
            selectedEmployees={selectedEmployees}
            searchQuery={searchQuery}
            assignLoading={assignLoading}
            onSearchChange={setSearchQuery}
            onToggleSelection={toggleEmployeeSelection}
            onSelectAll={selectAllVisible}
            onClearSelection={clearSelection}
            onAssign={handleAssignSelected}
            onRemove={handleRemoveEmployee}
          />
        )}

        {activeTab === 'risks' && (
          <RiskAnalysisTab
            project={project}
            riskAnalysis={riskAnalysis}
            riskLoading={riskLoading}
            teamCount={teamCount}
            onRetryAnalysis={handleRetryAnalysis}
            onEditProject={handleEditProject}
          />
        )}
      </div>

      {showConfigModal && (
        <TeamConfigModal
          projectId={project._id}
          onClose={() => setShowConfigModal(false)}
          onSave={async () => {
            setShowConfigModal(false);
            await loadAnalysis();
            await loadRiskAnalysis();
          }}
        />
      )}
    </div>
  );
}
