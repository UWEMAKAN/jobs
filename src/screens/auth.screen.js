/* eslint-disable import/no-extraneous-dependencies */
import React, { useContext, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { AuthenticationContext } from '../services';
import { SafeArea } from '../components';

if (__DEV__) {
  // eslint-disable-next-line global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

export const AuthScreen = ({ navigation }) => {
  const { token, error, login } = useContext(AuthenticationContext);

  const onAuthComplete = () => {
    if (token) {
      navigation.navigate('Main');
    }
  };
  useEffect(() => {
    onAuthComplete();
  });

  return (
    <SafeArea style={styles.container}>
      {error && (
        <Text style={[styles.textStyle, styles.errorStyle]}>{error}</Text>
      )}
      <Text style={styles.textStyle}>Login with Facebook</Text>
      <Button
        style={styles.buttonStyle}
        icon="facebook"
        mode="contained"
        onPress={() => login()}
      >
        Facebook
      </Button>
    </SafeArea>
  );
};

AuthScreen.whyDidYouRender = true;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 16,
    marginBottom: 10,
  },
  errorStyle: {
    color: 'red',
  },
  buttonStyle: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: '#4064AC',
  },
});
