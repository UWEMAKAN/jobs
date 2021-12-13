import React, { createContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { facebookLogin } from './authentication.service';

const initialState = { token: null, error: null };

const FACEBOOK_LOGIN_SUCCESS = 'FACEBOOK_LOGIN_SUCCESS';
const FACEBOOK_LOGIN_FAILURE = 'FACEBOOK_LOGIN_FAILURE';
const FACEBOOK_LOGOUT_SUCCESS = 'FACEBOOK_LOGOUT_SUCCESS';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case FACEBOOK_LOGIN_SUCCESS: {
      return { ...state, token: action.payload, error: null };
    }
    case FACEBOOK_LOGIN_FAILURE: {
      return { ...state, token: null, error: action.payload };
    }
    case FACEBOOK_LOGOUT_SUCCESS: {
      return { ...state, token: null, error: null };
    }
    default:
      return state;
  }
};

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { token, error } = state;

  const login = async () => {
    try {
      const authToken = await facebookLogin();
      await AsyncStorage.setItem('fb_token', authToken);
      dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: authToken });
    } catch (err) {
      dispatch({ type: FACEBOOK_LOGIN_FAILURE, payload: err.message });
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('fb_token');
    dispatch({ type: FACEBOOK_LOGOUT_SUCCESS });
  };

  useEffect(() => {
    AsyncStorage.getItem('fb_token').then((authToken) => {
      authToken &&
        dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: authToken });
    });
  }, []);

  const value = useMemo(
    () => ({ token, isAuthenticated: !!token, error, login, logout }),
    [token, error],
  );
  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};
