import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { DeckScreen, MapScreen } from '../screens';
import { ReviewNavigator } from './review.navigator';
import { FavoritesProvider, JobsProvider } from '../services';

const TAB_ICON = {
  Review: 'md-eye',
  Deck: 'md-square',
  Map: 'md-map',
};

const createScreenOptions = ({ route }) => ({
  headerShown: false,
  tabBarIcon: ({ color, size }) => {
    const iconName = TAB_ICON[route.name];
    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: 'tomato',
  tabBarInactiveTintColor: 'gray',
});

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  return (
    <JobsProvider>
      <FavoritesProvider>
        <Tab.Navigator
          initialRouteName="Map"
          screenOptions={createScreenOptions}
        >
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="Deck" component={DeckScreen} />
          <Tab.Screen
            name="Review"
            options={{ headerShown: false }}
            component={ReviewNavigator}
          />
        </Tab.Navigator>
      </FavoritesProvider>
    </JobsProvider>
  );
};
