import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { SafeArea } from '../components';
import { AuthenticationContext, FavoritesContext } from '../services';

export const SettingsScreen = ({ navigation }) => {
  const { logout } = useContext(AuthenticationContext);
  const { clearFavorites } = useContext(FavoritesContext);

  const onLogout = () => {
    logout();
    return navigation.navigate('Auth');
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'Settings',
      headerTitleAlign: 'center',
    });
  }, [navigation]);
  return (
    <SafeArea header>
      <View style={styles.container}>
        <Button
          icon="delete"
          mode="contained"
          style={styles.deleteButton}
          onPress={clearFavorites}
        >
          Delete Liked Jobs
        </Button>

        <Button
          icon="power"
          mode="contained"
          style={styles.logoutButton}
          onPress={onLogout}
        >
          logout
        </Button>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 100,
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingTop: 5,
    paddingBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#03A9F4',
    paddingTop: 5,
    paddingBottom: 5,
  },
});
