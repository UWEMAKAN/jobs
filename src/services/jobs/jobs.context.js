import React, { createContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchJobs } from './jobs.service';

const JOB_SEARCH_START = 'JOB_SEARCH_START';
const JOB_SEARCH_SUCCESS = 'JOB_SEARCH_SUCCESS';
const JOB_SEARCH_FAILURE = 'JOB_SEARCH_FAILURE';

const initialState = {
  isLoading: false,
  jobs: [],
  error: null,
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case JOB_SEARCH_START: {
      return { ...state, jobs: [], error: null, isLoading: true };
    }
    case JOB_SEARCH_SUCCESS: {
      return { ...state, jobs: action.payload, error: null, isLoading: false };
    }
    case JOB_SEARCH_FAILURE: {
      return { ...state, jobs: [], error: action.payload, isLoading: false };
    }
    default:
      return state;
  }
};

export const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { jobs, error, isLoading } = state;

  const searchJobs = async (region) => {
    dispatch({ type: JOB_SEARCH_START });
    try {
      const result = await fetchJobs(region);
      if (result) {
        return dispatch({ type: JOB_SEARCH_SUCCESS, payload: result });
      }
      return dispatch({
        type: JOB_SEARCH_FAILURE,
        payload: 'No jobs found',
      });
    } catch (err) {
      return dispatch({ type: JOB_SEARCH_FAILURE, payload: err.message });
    }
  };

  const value = useMemo(
    () => ({ error, isLoading, jobs, searchJobs }),
    [error, isLoading, jobs],
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};
