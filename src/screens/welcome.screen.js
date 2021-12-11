import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeArea, Slides } from '../components';
import { AuthenticationContext } from '../services';

const SLIDE_DATA = [
  { text: 'Welcome to Job Finder', color: '#03A9F4' },
  { text: 'Set your location, then swipe away', color: '#009688' },
  { text: 'See a job you like? Apply', color: '#03A9F4' },
];

export const WelcomeScreen = ({ navigation }) => {
  const { token } = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(true);
  const { navigate } = navigation;

  const onSlidesComplete = () => {
    navigate('Auth');
  };

  useEffect(() => {
    if (token) {
      navigate('Main');
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  });

  return (
    <SafeArea>
      {isLoading ? (
        <ActivityIndicator
          style={styles.activityIndicatorStyle}
          size="large"
          animating={true}
          color="#4064AC"
        />
      ) : (
        <Slides data={SLIDE_DATA} onSlidesComplete={onSlidesComplete} />
      )}
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  activityIndicatorStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
