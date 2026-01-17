import { useContext } from 'react';
import { QuestionnaireContext } from './QuestionnaireContext';
import { submitPhaseResponses } from '../../api/cv';

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
      payload: { field, value }
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
      console.log('========== SUBMITTING PHASE ==========');
      console.log('SessionId:', state.sessionId);
      console.log('Current Phase ID:', state.currentPhase.id);
      console.log('Responses (current phase only):', state.responses);
      console.log('=====================================');

      // Send ONLY current phase responses - backend accumulates them
      const response = await submitPhaseResponses(
        state.sessionId,
        state.currentPhase.id,
        state.responses
      );

      console.log('========== PHASE SUBMISSION RESPONSE ==========');
      console.log('Full Response:', response);
      console.log('Response Data:', response.data);
      console.log('==============================================');

      const data = response.data;

      if (data.isComplete) {
        // Backend indicates questionnaire is complete
        console.log('✓ Questionnaire completed! Completeness:', data.completenessScore);
        dispatch({ 
          type: 'COMPLETE',
          payload: { completenessScore: data.completenessScore }
        });
        return { isComplete: true, completenessScore: data.completenessScore };
      }

      // Load next phase
      console.log('→ Loading next phase:', data.phase?.id);
      dispatch({
        type: 'LOAD_NEXT_PHASE',
        payload: data
      });

      return { isComplete: false, nextPhase: data.phase };

    } catch (error) {
      console.error('========== PHASE SUBMISSION ERROR ==========');
      console.error('Error:', error);
      console.error('Error Response:', error.response);
      console.error('Error Data:', error.response?.data);
      console.error('Request URL:', error.config?.url);
      console.error('Request Method:', error.config?.method);
      console.error('Request Data:', error.config?.data);
      console.error('==========================================');
      
      const errorMessage = error.response?.data?.message || error.message || 'Error submitting phase';
      dispatch({ 
        type: 'SET_ERROR', 
        payload: errorMessage
      });
      throw error;
    }
  };

  return {
    state,
    updateResponse,
    submitPhase
  };
};
