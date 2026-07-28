import React, { useReducer, useMemo } from 'react';
import { QuestionnaireContext } from './QuestionnaireContextObj';

const initialState = {
  sessionId: null,
  currentPhase: null,
  questions: [],
  responses: {}, // Only current phase responses
  completenessScore: 0,
  isLoading: false,
  isComplete: false,
  error: null,
  language: 'en',
};

const questionnaireReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        sessionId: action.payload.sessionId,
        currentPhase: action.payload.currentPhase,
        questions: action.payload.questions,
        language: action.payload.language || 'en',
      };

    case 'LOAD_NEXT_PHASE':
      return {
        ...state,
        currentPhase: action.payload.phase,
        questions: action.payload.questions,
        completenessScore: action.payload.completenessScore,
        responses: {}, // Reset responses for new phase
        isLoading: false,
      };

    case 'UPDATE_RESPONSE':
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.payload.field]: action.payload.value,
        },
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'COMPLETE':
      return {
        ...state,
        isComplete: true,
        completenessScore: action.payload?.completenessScore || 100,
        isLoading: false,
      };

    default:
      return state;
  }
};

export const QuestionnaireProvider = ({ children, initialSessionData }) => {
  const [state, dispatch] = useReducer(questionnaireReducer, {
    ...initialState,
    ...(initialSessionData && {
      sessionId: initialSessionData.sessionId,
      currentPhase: initialSessionData.currentPhase,
      questions: initialSessionData.questions,
    }),
  });

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  );
};
