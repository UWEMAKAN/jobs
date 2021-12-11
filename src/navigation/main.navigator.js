import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { DeckScreen, MapScreen } from '../screens';
import { ReviewNavigator } from './review.navigator';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Deck" component={DeckScreen} />
      <Tab.Screen name="Review" component={ReviewNavigator} />
    </Tab.Navigator>
  );
};
