import React from 'react';
import { Building2, Star, BarChart3, AlertTriangle, PartyPopper, ClipboardList, Info } from 'lucide-react';
import { FormSelect } from './FormComponents';
import { YES_NO_PARTIAL, COMPLEXITY_LEVELS } from '../../types/projectTypes';

/**
 * Step 11: Organizational Maturity
 * Assess organization's development processes maturity
 */
export default function Step11Maturity({ formData, onChange, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const maturityScore = calculateMaturityScore(formData);

  return (
    <div>
      <h2 style={{...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px'}}>
        <Building2 size={24} />
        Organizational Maturity
      </h2>
      <p style={styles.stepDescription}>
        Assess your organization's development maturity (Optional)
      </p>

      <div style={styles.infoBox}>
        <Info size={20} color="#004085" style={{ flexShrink: 0 }} />
        <div>
          <strong>Final Step</strong>
          <p>This optional assessment helps predict risks related to organizational processes</p>
        </div>
      </div>

      <FormSelect
        label="Has Onboarding Processes"
        name="hasOnboardingProcesses"
        value={formData.hasOnboardingProcesses || 'partial'}
        onChange={handleChange}
        options={[
          { value: YES_NO_PARTIAL.YES, label: 'Yes - Comprehensive onboarding' },
          { value: YES_NO_PARTIAL.PARTIAL, label: 'Partial - Basic onboarding' },
          { value: YES_NO_PARTIAL.NO, label: 'No - Ad-hoc onboarding' }
        ]}
        helperText="Proper onboarding reduces time-to-productivity for new team members"
      />

      <FormSelect
        label="Has Version Control and CI/CD"
        name="hasVersionControlAndCICD"
        value={formData.hasVersionControlAndCICD || 'yes'}
        onChange={handleChange}
        options={[
          { value: YES_NO_PARTIAL.YES, label: 'Yes - Full CI/CD pipeline' },
          { value: YES_NO_PARTIAL.PARTIAL, label: 'Partial - Version control only' },
          { value: YES_NO_PARTIAL.NO, label: 'No - Manual deployment' }
        ]}
        helperText="CI/CD automation reduces deployment risks and speeds up delivery"
      />

      <FormSelect
        label="Internal Tools Fragmentation"
        name="internalToolsFragmentation"
        value={formData.internalToolsFragmentation || 'medium'}
        onChange={handleChange}
        options={[
          { value: COMPLEXITY_LEVELS.LOW, label: 'Low - Well integrated tools' },
          { value: COMPLEXITY_LEVELS.MEDIUM, label: 'Medium - Some fragmentation' },
          { value: COMPLEXITY_LEVELS.HIGH, label: 'High - Many disparate tools' }
        ]}
        helperText="Tool fragmentation can increase overhead and reduce productivity"
      />

      {/* Maturity Score Card */}
      <div style={{
        ...styles.maturityCard,
        ...(maturityScore >= 80 ? styles.maturityHigh :
            maturityScore >= 50 ? styles.maturityMedium :
            styles.maturityLow)
      }}>
        <div style={styles.maturityHeader}>
          <span style={styles.maturityIcon}>
            {maturityScore >= 80 ? <Star size={32} color="#28a745" /> : 
             maturityScore >= 50 ? <BarChart3 size={32} color="#ffc107" /> : 
             <AlertTriangle size={32} color="#dc3545" />}
          </span>
          <div>
            <h4 style={styles.maturityTitle}>Maturity Score</h4>
            <p style={styles.maturityScore}>{maturityScore}%</p>
          </div>
        </div>
        <p style={styles.maturityDescription}>
          {maturityScore >= 80 && 'Excellent! Your organization has strong processes in place.'}
          {maturityScore >= 50 && maturityScore < 80 && 'Good foundation. Consider improving CI/CD and onboarding.'}
          {maturityScore < 50 && 'Consider investing in process improvements to reduce project risks.'}
        </p>
      </div>

      {/* Completion Card */}
      <div style={styles.completionCard}>
        <PartyPopper size={48} color="#667eea" style={{ marginBottom: '16px' }} />
        <h3 style={styles.completionTitle}>Form Complete!</h3>
        <p style={styles.completionText}>
          You've filled in all 11 steps. Click "Create Project" to save as DRAFT.
        </p>
        <div style={styles.workflowInfo}>
          <p style={{ ...styles.workflowInfoTitle, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ClipboardList size={16} />
            Next Steps After Creation:
          </p>
          <div style={styles.nextSteps}>
            <div style={styles.nextStepItem}>
              <span style={styles.stepNumber}>1</span>
              <span>Analyze Risks with AI</span>
            </div>
            <div style={styles.nextStepItem}>
              <span style={styles.stepNumber}>2</span>
              <span>Select Optimal Team</span>
            </div>
            <div style={styles.nextStepItem}>
              <span style={styles.stepNumber}>3</span>
              <span>Review & Activate</span>
            </div>
          </div>
          <p style={{ ...styles.workflowFooter, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={16} style={{ color: '#856404' }} />
            The project will be created as <strong>DRAFT</strong> and must be activated after team selection.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate maturity score
function calculateMaturityScore(formData) {
  let score = 0;
  
  // Onboarding (33%)
  if (formData.hasOnboardingProcesses === 'yes') score += 33;
  else if (formData.hasOnboardingProcesses === 'partial') score += 17;
  
  // CI/CD (34%)
  if (formData.hasVersionControlAndCICD === 'yes') score += 34;
  else if (formData.hasVersionControlAndCICD === 'partial') score += 17;
  
  // Tools integration (33%)
  if (formData.internalToolsFragmentation === 'low') score += 33;
  else if (formData.internalToolsFragmentation === 'medium') score += 17;
  
  return Math.round(score);
}

const styles = {
  stepTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111',
    margin: '0 0 8px 0'
  },
  stepDescription: {
    fontSize: '15px',
    color: '#6B7280',
    marginBottom: '24px'
  },
  infoBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#DBEAFE',
    border: '1px solid #3B82F6',
    borderRadius: '8px',
    marginBottom: '24px'
  },
  infoIcon: {
    fontSize: '20px',
    flexShrink: 0
  },
  maturityCard: {
    marginTop: '32px',
    padding: '24px',
    borderRadius: '12px',
    border: '2px solid',
    transition: 'all 0.3s'
  },
  maturityHigh: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    color: '#065F46'
  },
  maturityMedium: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    color: '#92400E'
  },
  maturityLow: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    color: '#991B1B'
  },
  maturityHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px'
  },
  maturityIcon: {
    fontSize: '32px'
  },
  maturityTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0'
  },
  maturityScore: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0
  },
  maturityDescription: {
    fontSize: '14px',
    lineHeight: '1.5',
    margin: 0
  },
  completionCard: {
    marginTop: '40px',
    padding: '32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    textAlign: 'center',
    color: 'white'
  },
  completionIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  completionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '12px'
  },
  completionText: {
    fontSize: '15px',
    lineHeight: '1.6',
    marginBottom: '24px',
    opacity: 0.95
  },
  workflowInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '16px',
    textAlign: 'left'
  },
  workflowInfoTitle: {
    fontSize: '15px',
    fontWeight: '600',
    margin: '0 0 12px 0',
    opacity: 1
  },
  workflowFooter: {
    fontSize: '13px',
    margin: '12px 0 0 0',
    opacity: 0.9,
    textAlign: 'center'
  },
  nextSteps: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  nextStepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500'
  },
  stepNumber: {
    fontSize: '16px'
  }
};
