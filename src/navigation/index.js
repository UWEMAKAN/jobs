import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { StartNavigator } from './start.navigator';
import { AuthenticationProvider } from '../services';

export const Navigator = () => {
  return (
    <AuthenticationProvider>
      <NavigationContainer>
        <StartNavigator />
      </NavigationContainer>
    </AuthenticationProvider>
  );
};
