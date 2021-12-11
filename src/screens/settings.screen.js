import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const SettingsScreen = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      title: 'Settings',
      headerTitleAlign: 'center',
    });
  }, [navigation]);
  return (
    <View>
      <Text>SettingsScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({});
