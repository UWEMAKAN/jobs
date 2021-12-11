import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AuthScreen, WelcomeScreen } from '../screens';
import { MainNavigator } from './main.navigator';

const Tab = createBottomTabNavigator();

export const StartNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
    >
      <Tab.Screen name="Welcome" component={WelcomeScreen} />
      <Tab.Screen name="Auth" component={AuthScreen} />
      <Tab.Screen name="Main" component={MainNavigator} />
    </Tab.Navigator>
  );
};
