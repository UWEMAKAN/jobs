import React, { useContext, useEffect, useState } from 'react';

import { SafeArea, Slides, ActivityIndicator } from '../components';
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
        <ActivityIndicator />
      ) : (
        <Slides data={SLIDE_DATA} onSlidesComplete={onSlidesComplete} />
      )}
    </SafeArea>
  );
};
