import { useContext } from 'react';
import { QuestionnaireContext } from '../../contexts/QuestionnaireContextObj';
import { submitPhaseResponses } from '../../api/cv';
import i18n from '../../i18n';

/**
 * Custom hook for managing questionnaire state and operations
 * @returns {Object} Questionnaire state and methods
 */
export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);

  if (!context) {
    throw new Error('useQuestionnaire must be used within QuestionnaireProvider');
  }

  const { state, dispatch } = context;

  /**
   * Update a single response field
   * @param {string} field - Field name
   * @param {any} value - Field value
   */
  const updateResponse = (field, value) => {
    dispatch({
      type: 'UPDATE_RESPONSE',
      payload: { field, value },
    });
  };

  /**
   * Submit current phase and load next phase
   * Backend accumulates responses internally across phases
   * @returns {Promise<Object>} Result with isComplete flag and nextPhase if applicable
   */
  const submitPhase = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await submitPhaseResponses(
        state.sessionId,
        state.currentPhase.id,
        state.responses
      );

      const data = response.data;

      if (data.isComplete) {
        dispatch({
          type: 'COMPLETE',
          payload: { completenessScore: data.completenessScore },
        });
        return { isComplete: true, completenessScore: data.completenessScore };
      }

      dispatch({
        type: 'LOAD_NEXT_PHASE',
        payload: data,
      });

      return { isComplete: false, nextPhase: data.phase };
    } catch (error) {
      console.error('Error submitting phase:', error);

      const errorMessage =
        error.response?.data?.message || error.message || i18n.t('questionnaire.errors.submitPhase');
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  };

  return {
    state,
    updateResponse,
    submitPhase,
  };
};
