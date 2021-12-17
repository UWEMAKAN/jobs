import React, { createContext, useMemo, useReducer } from 'react';
import reverseGeocode from 'geo2zip';

const initialState = {
  zipCodes: [],
  isLoading: false,
  error: null,
  jobTitle: '',
};

const SEARCH_ZIP_CODES_START = 'SEARCH_ZIP_CODES_START';
const SEARCH_ZIP_CODES_SUCCESS = 'SEARCH_ZIP_CODES_SUCCESS';
const SEARCH_ZIP_CODES_FAILURE = 'SEARCH_ZIP_CODES_FAILURE';
const SET_JOB_TITLE = 'SET_JOB_TITLE';

const reducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SEARCH_ZIP_CODES_START: {
      return { ...state, isLoading: true, error: null };
    }
    case SEARCH_ZIP_CODES_SUCCESS: {
      return { ...state, isLoading: false, error: null, zipCodes: payload };
    }
    case SEARCH_ZIP_CODES_FAILURE: {
      return { ...state, zipCodes: [], isLoading: false, error: payload };
    }
    case SET_JOB_TITLE: {
      return { ...state, jobTitle: payload };
    }
    default:
      return state;
  }
};

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { zipCodes, isLoading, error, jobTitle } = state;

  const searchZipCode = async (region) => {
    dispatch({ type: SEARCH_ZIP_CODES_START });
    try {
      const codes = await reverseGeocode(region);
      return dispatch({ type: SEARCH_ZIP_CODES_SUCCESS, payload: codes });
    } catch (err) {
      dispatch({ type: SEARCH_ZIP_CODES_FAILURE, payload: err.message });
    }
  };

  const setJobTitle = (title) => {
    return dispatch({ type: SET_JOB_TITLE, payload: title });
  };

  const value = useMemo(
    () => ({
      zipCodes,
      isLoading,
      error,
      jobTitle,
      searchZipCode,
      setJobTitle,
    }),
    [error, isLoading, jobTitle, zipCodes],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
