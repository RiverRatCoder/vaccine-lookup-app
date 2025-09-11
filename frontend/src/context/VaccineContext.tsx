import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { VaccineSearchState, Vaccine, VaccineDetails, VaccineStats } from '../types/vaccine';

type VaccineAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_VACCINES'; payload: Vaccine[] }
  | { type: 'SET_SELECTED_VACCINE'; payload: VaccineDetails | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STATS'; payload: VaccineStats | null }
  | { type: 'CLEAR_ERROR' };

const initialState: VaccineSearchState = {
  vaccines: [],
  selectedVaccine: null,
  loading: false,
  error: null,
  stats: null,
};

function vaccineReducer(state: VaccineSearchState, action: VaccineAction): VaccineSearchState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_VACCINES':
      return { ...state, vaccines: action.payload, loading: false, error: null };
    case 'SET_SELECTED_VACCINE':
      return { ...state, selectedVaccine: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface VaccineContextType {
  state: VaccineSearchState;
  dispatch: React.Dispatch<VaccineAction>;
  setLoading: (loading: boolean) => void;
  setVaccines: (vaccines: Vaccine[]) => void;
  setSelectedVaccine: (vaccine: VaccineDetails | null) => void;
  setError: (error: string | null) => void;
  setStats: (stats: VaccineStats | null) => void;
  clearError: () => void;
}

const VaccineContext = createContext<VaccineContextType | undefined>(undefined);

export function useVaccine() {
  const context = useContext(VaccineContext);
  if (context === undefined) {
    throw new Error('useVaccine must be used within a VaccineProvider');
  }
  return context;
}

interface VaccineProviderProps {
  children: ReactNode;
}

export function VaccineProvider({ children }: VaccineProviderProps) {
  const [state, dispatch] = useReducer(vaccineReducer, initialState);

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setVaccines = (vaccines: Vaccine[]) => {
    dispatch({ type: 'SET_VACCINES', payload: vaccines });
  };

  const setSelectedVaccine = (vaccine: VaccineDetails | null) => {
    dispatch({ type: 'SET_SELECTED_VACCINE', payload: vaccine });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setStats = (stats: VaccineStats | null) => {
    dispatch({ type: 'SET_STATS', payload: stats });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    state,
    dispatch,
    setLoading,
    setVaccines,
    setSelectedVaccine,
    setError,
    setStats,
    clearError,
  };

  return (
    <VaccineContext.Provider value={value}>
      {children}
    </VaccineContext.Provider>
  );
}

