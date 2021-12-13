import React, { createContext, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchJobs } from './jobs.service';

const JOB_SEARCH_SUCCESS = 'JOB_SEARCH_SUCCESS';
const JOB_SEARCH_FAILURE = 'JOB_SEARCH_FAILURE';
// const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
// const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
// const CLEAR_FAVORITES = 'CLEAR_FAVORITES';

const initialState = {
  jobs: [],
  error: null,
  favorites: [],
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case JOB_SEARCH_SUCCESS: {
      return { ...state, jobs: action.payload, error: null };
    }
    case JOB_SEARCH_FAILURE: {
      return { ...state, jobs: [], error: action.payload };
    }
    default:
      return state;
  }
};

export const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { jobs, error } = state;

  const searchJobs = async (region) => {
    try {
      const result = await fetchJobs(region);
      if (result) {
        await AsyncStorage.setItem('jobs', JSON.stringify(result));
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

  const value = useMemo(() => ({ jobs, error, searchJobs }), [jobs, error]);

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};
