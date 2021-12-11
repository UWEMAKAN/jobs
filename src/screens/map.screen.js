import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SafeArea } from '../components';
import { AuthenticationContext } from '../services';

export const MapScreen = ({ navigation }) => {
  const { setToken } = useContext(AuthenticationContext);
  const logoutHandler = async () => {
    await AsyncStorage.removeItem('fb_token');
    setToken(null);
    return navigation.navigate('Auth');
  };

  return (
    <SafeArea style={styles.container}>
      <Button icon="power" mode="contained" onPress={() => logoutHandler()}>
        Logout
      </Button>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
