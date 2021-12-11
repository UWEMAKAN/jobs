import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAsync, logInWithReadPermissionsAsync } from 'expo-facebook';

import { FACEBOOK_APP_ID } from '../../utils';

export const facebookLogin = async () => {
  try {
    await initializeAsync({
      appId: FACEBOOK_APP_ID,
    });
    const { type, token } = await logInWithReadPermissionsAsync({
      permissions: ['public_profile'],
    });
    if (type === 'cancel') {
      throw new Error('Operation Cancelled');
    }
    await AsyncStorage.setItem('fb_token', token);
    return token;
  } catch ({ message }) {
    throw new Error(message);
  }
};
