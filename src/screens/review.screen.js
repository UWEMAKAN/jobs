import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';

const Icon = () => <FeatherIcon name="settings" style={styles.iconStyle} />;
const SettingsButton = (navigate) => (
  <IconButton
    icon={Icon}
    color={Colors.black}
    size={25}
    onPress={() => navigate('Settings')}
    style={styles.iconButtonStyle}
  />
);

export const ReviewScreen = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      title: 'Review Jobs',
      headerTitleAlign: 'center',
      headerRight: SettingsButton,
    });
  }, [navigation]);

  return (
    <View>
      <Text>ReviewScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    fontSize: 20,
  },
  iconButtonStyle: {
    margin: 0,
    padding: 0,
  },
});
