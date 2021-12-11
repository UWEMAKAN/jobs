export const FACEBOOK_LOGIN_SUCCESS = 'FACEBOOK_LOGIN_SUCCESS';
export const FACEBOOK_LOGIN_FAILURE = 'FACEBOOK_LOGIN_FAILURE';
export const FACEBOOK_LOGOUT_SUCCESS = 'FACEBOOK_LOGOUT_SUCCESS';
export const FACEBOOK_LOGIN_ERROR = 'FACEBOOK_LOGIN_ERROR';

// eslint-disable-next-line default-param-last
export const authenticationReducer = (state = {}, action) => {
  switch (action.type) {
    case FACEBOOK_LOGIN_SUCCESS: {
      return { ...state, token: action.payload, error: null };
    }
    case FACEBOOK_LOGIN_FAILURE: {
      return { ...state, token: action.payload, error: 'login failed' };
    }
    case FACEBOOK_LOGIN_ERROR: {
      return { ...state, error: action.payload };
    }
    case FACEBOOK_LOGOUT_SUCCESS: {
      return { ...state, token: action.payload };
    }
    default:
      return state;
  }
};
