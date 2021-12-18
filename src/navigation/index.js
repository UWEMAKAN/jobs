import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { StartNavigator } from './start.navigator';
import { AuthenticationProvider, NotificationProvider } from '../services';

export const Navigator = () => {
  return (
    <NotificationProvider>
      <AuthenticationProvider>
        <NavigationContainer>
          <StartNavigator />
        </NavigationContainer>
      </AuthenticationProvider>
    </NotificationProvider>
  );
};
