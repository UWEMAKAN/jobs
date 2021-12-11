import React, { createContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('fb_token').then((t) => {
      t && setToken(t);
    });
  }, []);

  const value = useMemo(
    () => ({ token, isAuthenticated: !!token, setToken }),
    [token],
  );
  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};
