import React, { createContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
const LOAD_FAVORITES = 'LOAD_FAVORITES';
const CLEAR_FAVORITES = 'CLEAR_FAVORITES';

const initialState = [];

const reducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_FAVORITES: {
      const isUnique = !state.some(
        (job) => job.jobkey === action.payload.jobkey,
      );
      if (isUnique) return [action.payload, ...state];
      return state;
    }
    case REMOVE_FROM_FAVORITES: {
      let favorites = [...state];
      action.payload.forEach((key) => {
        favorites = favorites.filter((job) => job.jobkey !== key);
      });
      return favorites;
    }
    case LOAD_FAVORITES: {
      return action.payload;
    }
    case CLEAR_FAVORITES: {
      return [];
    }
    default:
      return state;
  }
};

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const likeJob = (job) => {
    return dispatch({ type: ADD_TO_FAVORITES, payload: job });
  };

  const unlike = (keys) => {
    return dispatch({ type: REMOVE_FROM_FAVORITES, payload: keys });
  };

  const clearFavorites = () => {
    return dispatch({ type: CLEAR_FAVORITES });
  };

  const loadFavorites = async () => {
    const favorites = [];
    const results = await AsyncStorage.getItem('favorites');
    if (results) {
      favorites.push(...JSON.parse(results));
    }
    return dispatch({ type: LOAD_FAVORITES, payload: favorites });
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (state.length) AsyncStorage.setItem('favorites', JSON.stringify(state));
    else AsyncStorage.removeItem('favorites');
  }, [state]);

  const value = useMemo(
    () => ({ favorites: state, likeJob, unlike, clearFavorites }),
    [state],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
