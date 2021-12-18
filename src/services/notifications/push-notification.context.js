/* eslint-disable no-alert */
import React, {
  createContext,
  useMemo,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  removeNotificationSubscription,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const GET_PUSH_TOKEN_FAILURE = 'GET_PUSH_TOKEN_FAILURE';
const GET_PUSH_TOKEN_SUCCESS = 'GET_PUSH_TOKEN_SUCCESS';
const RECEIVED_NOTIFICATION = 'RECEIVED_NOTIFICATION';

const initialState = {
  pushToken: '',
  notification: null,
  error: null,
};

const reducer = (state = {}, { type, payload }) => {
  switch (type) {
    case GET_PUSH_TOKEN_SUCCESS: {
      return { ...state, pushToken: payload };
    }
    case GET_PUSH_TOKEN_FAILURE: {
      return { ...state, error: payload };
    }
    case RECEIVED_NOTIFICATION: {
      return { ...state, notification: payload };
    }
    default:
      state;
  }
};

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { pushToken, notification } = state;
  const notificationListener = useRef();
  const responseListener = useRef();

  const handlePushNotification = async () => {
    try {
      let token = await AsyncStorage.getItem('pushToken');
      if (!token && token.length) {
        token = await registerForPushNotificationsAsync();
        await AsyncStorage.setItem('pushToken', token);
      }
      notificationListener.current = addNotificationReceivedListener((notif) =>
        dispatch({ type: RECEIVED_NOTIFICATION, payload: notif }),
      );
      responseListener.current = addNotificationResponseReceivedListener(
        (response) => {
          console.log(response);
        },
      );
      return dispatch({ type: GET_PUSH_TOKEN_SUCCESS, payload: token });
    } catch (err) {
      return dispatch({ type: GET_PUSH_TOKEN_FAILURE, payload: err.message });
    }
  };

  useEffect(() => {
    handlePushNotification();
    return () => {
      removeNotificationSubscription(notificationListener.current);
      removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const value = useMemo(
    () => ({ pushToken, notification }),
    [pushToken, notification],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const schedulePushNotification = async () => {
  await scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
};

const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    setNotificationChannelAsync('default', {
      name: 'default',
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
};
