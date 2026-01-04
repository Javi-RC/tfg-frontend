import React from 'react';
import { Lightbulb, BookOpen, ThumbsUp, ThumbsDown, CheckCircle, X } from 'lucide-react';

/**
 * LessonsLearnedSection Component
 * Captures lessons learned and practices (successful/unsuccessful)
 */
export default function LessonsLearnedSection({ formData, setFormData }) {
  
  const handleAddLesson = () => {
    const lessons = formData.lessonsLearned || [];
    setFormData(prev => ({
      ...prev,
      lessonsLearned: [...lessons, '']
    }));
  };

  const handleUpdateLesson = (index, value) => {
    const lessons = [...(formData.lessonsLearned || [])];
    lessons[index] = value;
    setFormData(prev => ({
      ...prev,
      lessonsLearned: lessons
    }));
  };

  const handleRemoveLesson = (index) => {
    const lessons = [...(formData.lessonsLearned || [])];
    lessons.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      lessonsLearned: lessons
    }));
  };

  const handleAddPractice = (type) => {
    const key = type === 'successful' ? 'successfulPractices' : 'unsuccessfulPractices';
    const practices = formData[key] || [];
    
    const newPractice = {
      practice: '',
      impact: '',
      ...(type === 'successful' ? { replicable: true } : { reason: '' })
    };
    
    setFormData(prev => ({
      ...prev,
      [key]: [...practices, newPractice]
    }));
  };

  const handleUpdatePractice = (type, index, field, value) => {
    const key = type === 'successful' ? 'successfulPractices' : 'unsuccessfulPractices';
    const practices = [...(formData[key] || [])];
    practices[index] = {
      ...practices[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      [key]: practices
    }));
  };

  const handleRemovePractice = (type, index) => {
    const key = type === 'successful' ? 'successfulPractices' : 'unsuccessfulPractices';
    const practices = [...(formData[key] || [])];
    practices.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      [key]: practices
    }));
  };

  return (
    <div style={styles.section}>
      <h3 style={{...styles.sectionTitle, display: 'flex', alignItems: 'center', gap: '8px'}}>
        <Lightbulb size={24} />
        Lessons Learned
      </h3>
      <p style={styles.sectionDescription}>
        Capture key learnings and practices that worked or didn't work
      </p>

      {/* General Lessons */}
      <div style={styles.subsection}>
        <h4 style={{...styles.subsectionTitle, display: 'flex', alignItems: 'center', gap: '8px'}}>
          <BookOpen size={20} />
          Lessons Learned
        </h4>
        
        {(formData.lessonsLearned || []).map((lesson, index) => (
          <div key={index} style={styles.itemCard}>
            <div style={styles.itemNumber}>{index + 1}</div>
            <textarea
              value={lesson}
              onChange={(e) => handleUpdateLesson(index, e.target.value)}
              style={styles.textarea}
              rows={2}
              placeholder="E.g.: Distributed teams across more than 2 zones require at least 4 hours of overlap"
            />
            <button
              type="button"
              onClick={() => handleRemoveLesson(index)}
              style={styles.removeButton}
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddLesson}
          style={styles.addButton}
        >
          + Add Lesson
        </button>
      </div>

      <div style={styles.divider} />

      {/* Successful Practices */}
      <div style={styles.subsection}>
        <h4 style={{...styles.subsectionTitle, display: 'flex', alignItems: 'center', gap: '8px'}}>
          <CheckCircle size={20} />
          Successful Practices
        </h4>
        <p style={styles.subsectionDescription}>
          Document what worked well and should be replicated
        </p>

        {(formData.successfulPractices || []).map((practice, index) => (
          <div key={index} style={styles.practiceCard}>
            <div style={styles.practiceHeader}>
              <span style={{...styles.practiceBadge, background: '#10B981', display: 'flex', alignItems: 'center', gap: '4px'}}>
                <CheckCircle size={14} />
                SUCCESSFUL
              </span>
              <button
                type="button"
                onClick={() => handleRemovePractice('successful', index)}
                style={styles.removeButton}
              >
                <X size={16} />
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Practice <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={practice.practice || ''}
                onChange={(e) => handleUpdatePractice('successful', index, 'practice', e.target.value)}
                style={styles.input}
                placeholder="E.g.: Daily async updates in Slack with structured template"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Impact <span style={styles.required}>*</span>
              </label>
              <textarea
                value={practice.impact || ''}
                onChange={(e) => handleUpdatePractice('successful', index, 'impact', e.target.value)}
                style={styles.textarea}
                rows={2}
                placeholder="E.g.: Reduced meeting dependency by 40% and improved transparency"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={practice.replicable !== false}
                  onChange={(e) => handleUpdatePractice('successful', index, 'replicable', e.target.checked)}
                  style={styles.checkbox}
                />
                <span>Is it replicable in other projects?</span>
              </label>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => handleAddPractice('successful')}
          style={styles.addButton}
        >
          + Add Successful Practice
        </button>
      </div>

      <div style={styles.divider} />

      {/* Failed Practices */}
      <div style={styles.subsection}>
        <h4 style={{...styles.subsectionTitle, display: 'flex', alignItems: 'center', gap: '8px'}}>
          <X size={20} />
          Failed Practices
        </h4>
        <p style={styles.subsectionDescription}>
          Document what didn't work to avoid it in the future
        </p>

        {(formData.unsuccessfulPractices || []).map((practice, index) => (
          <div key={index} style={styles.practiceCard}>
            <div style={styles.practiceHeader}>
              <span style={{...styles.practiceBadge, background: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px'}}>
                <X size={14} />
                FAILED
              </span>
              <button
                type="button"
                onClick={() => handleRemovePractice('unsuccessful', index)}
                style={styles.removeButton}
              >
                <X size={16} />
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Practice <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={practice.practice || ''}
                onChange={(e) => handleUpdatePractice('unsuccessful', index, 'practice', e.target.value)}
                style={styles.input}
                placeholder="E.g.: Daily standup at 9 AM CET"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Negative Impact <span style={styles.required}>*</span>
              </label>
              <textarea
                value={practice.impact || ''}
                onChange={(e) => handleUpdatePractice('unsuccessful', index, 'impact', e.target.value)}
                style={styles.textarea}
                rows={2}
                placeholder="E.g.: Asian team had to wake up at 4 AM, causing fatigue"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Reason for Failure <span style={styles.required}>*</span>
              </label>
              <textarea
                value={practice.reason || ''}
                onChange={(e) => handleUpdatePractice('unsuccessful', index, 'reason', e.target.value)}
                style={styles.textarea}
                rows={2}
                placeholder="E.g.: Did not consider time zone differences properly"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => handleAddPractice('unsuccessful')}
          style={styles.addButton}
        >
          + Add Failed Practice
        </button>
      </div>
    </div>
  );
}

const styles = {
  section: {
    padding: '24px',
    background: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #E5E7EB'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px'
  },
  sectionDescription: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '24px'
  },
  subsection: {
    marginBottom: '24px'
  },
  subsectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  subsectionDescription: {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '16px'
  },
  itemCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
    padding: '12px',
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '8px'
  },
  itemNumber: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '50%',
    fontSize: '14px',
    fontWeight: '600',
    flexShrink: 0
  },
  practiceCard: {
    padding: '16px',
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  practiceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  practiceBadge: {
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase'
  },
  formGroup: {
    marginBottom: '12px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  },
  required: {
    color: '#DC2626'
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#374151'
  },
  checkbox: {
    cursor: 'pointer',
    width: '16px',
    height: '16px'
  },
  addButton: {
    width: '100%',
    padding: '12px',
    background: '#FFFFFF',
    border: '2px dashed #D1D5DB',
    borderRadius: '8px',
    color: '#2563EB',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  removeButton: {
    background: '#FEE2E2',
    border: 'none',
    color: '#DC2626',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    flexShrink: 0
  },
  divider: {
    height: '1px',
    background: '#E5E7EB',
    margin: '24px 0'
  }
};
