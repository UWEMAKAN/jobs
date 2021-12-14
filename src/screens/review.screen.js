/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useReducer } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  Platform,
  Dimensions,
  Linking,
  Pressable,
} from 'react-native';
import { IconButton, Colors, Button, Card } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MapView, { Marker } from 'react-native-maps';

import { SafeArea } from '../components';
import { FavoritesContext } from '../services';

const DeleteButton = ({ onDelete }) => (
  <IconButton
    icon="delete"
    color={Colors.grey600}
    size={25}
    onPress={onDelete}
    style={styles.iconButtonStyle}
  />
);

const ClearButton = ({ onClear }) => (
  <IconButton
    icon="close-box"
    color={Colors.grey600}
    size={25}
    onPress={onClear}
    style={styles.iconButtonStyle}
  />
);

const SelectButton = ({ onSelectAll, total, selected }) => (
  <IconButton
    icon="checkbox-marked"
    color={Colors.grey600}
    size={25}
    onPress={onSelectAll}
    style={styles.iconButtonStyle}
    disabled={total === selected}
  />
);

const SelectionHeader = (onDelete, onClear, onSelectAll, count, total) => {
  return (
    <View style={styles.headerContainer}>
      <ClearButton onClear={onClear} />
      <Text>{count}</Text>
      <SelectButton onSelectAll={onSelectAll} total={total} selected={count} />
      <DeleteButton onDelete={onDelete} />
    </View>
  );
};

const SettingsIcon = () => (
  <FeatherIcon name="settings" style={styles.iconStyle} />
);

const SettingsButton = (navigate) => (
  <IconButton
    icon={SettingsIcon}
    color={Colors.grey600}
    size={25}
    onPress={() => navigate('Settings')}
    style={styles.iconButtonStyle}
  />
);

const ItemSeparatorComponent = () => {
  return <View style={{ marginBottom: 10 }} />;
};

const RenderFavoriteJob = ({ item, selected, onPress, onLongPress }) => {
  const { url, longitude, latitude, company, formattedRelativeTime, jobtitle } =
    item;
  const initialRegion = {
    longitude,
    latitude,
    longitudeDelta: 0.01,
    latitudeDelta: 0.01125,
  };
  return (
    <Pressable onPress={onPress}>
      <Card
        delayLongPress={10000}
        onLongPress={onLongPress}
        onPress={onPress}
        style={{ marginLeft: 10, marginRight: 10 }}
        elevation={0}
      >
        <Card.Content>
          <Text style={[styles.marginBottom, styles.bold]}>{jobtitle}</Text>
          <View style={[styles.mapContainer, styles.marginBottom]}>
            <MapView
              style={styles.map}
              scrollEnabled={false}
              initialRegion={initialRegion}
              cacheEnabled={isAndroid}
            >
              <Marker
                title={company}
                coordinate={{
                  longitude,
                  latitude,
                }}
              />
            </MapView>
          </View>
          <View style={[styles.flexRow, styles.marginBottom]}>
            <Text style={[styles.italic, styles.textWidth]}>{company}</Text>
            <Text style={styles.italic}>{formattedRelativeTime}</Text>
          </View>
          <Button
            style={styles.buttonStyle}
            mode="contained"
            onPress={() => Linking.openURL(url)}
          >
            Apply
          </Button>
        </Card.Content>
      </Card>
      <View style={selected && styles.overlay} />
    </Pressable>
  );
};

const isAndroid = Platform.OS === 'android';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const SELECT_JOB = 'SELECT_JOB';
const UNSELECT_JOB = 'UNSELECT_JOB';
const SELECT_ALL_JOBS = 'SELECT_ALL_JOBS';
const UNSELECT_ALL_JOBS = 'UNSELECT_ALL_JOBS';

const initialState = {
  selectedJobs: [],
  selectionEnabled: false,
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SELECT_JOB: {
      return {
        selectedJobs: [...state.selectedJobs, action.payload],
        selectionEnabled: true,
      };
    }
    case UNSELECT_JOB: {
      const keys = state.selectedJobs.filter((key) => key !== action.payload);
      return { selectedJobs: keys, selectionEnabled: !!keys.length };
    }
    case SELECT_ALL_JOBS: {
      return { selectedJobs: [...action.payload], selectionEnabled: true };
    }
    case UNSELECT_ALL_JOBS: {
      return { selectedJobs: [], selectionEnabled: false };
    }
    default:
      return state;
  }
};

export const ReviewScreen = ({ navigation }) => {
  const { favorites, unlike } = useContext(FavoritesContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { selectionEnabled, selectedJobs } = state;

  const getSelection = (jobkey) => selectedJobs.includes(jobkey);

  const unSelectAllJobs = () => dispatch({ type: UNSELECT_ALL_JOBS });

  const selectAllJobs = (faves) =>
    dispatch({
      type: SELECT_ALL_JOBS,
      payload: faves.map((job) => job.jobkey),
    });

  const deleteJobs = (remove, jobs) => {
    remove(jobs);
    return dispatch({ type: UNSELECT_ALL_JOBS });
  };

  const handleOnPress = (jobkey) => {
    if (!selectedJobs.length) return;
    if (getSelection(jobkey)) {
      return dispatch({ type: UNSELECT_JOB, payload: jobkey });
    }
    return dispatch({ type: SELECT_JOB, payload: jobkey });
  };

  const handleLongPress = (jobkey) => {
    if (getSelection(jobkey)) return;
    return dispatch({ type: SELECT_JOB, payload: jobkey });
  };

  useEffect(() => {
    navigation.setOptions({
      title: selectionEnabled ? '' : 'Review Jobs',
      headerTitleAlign: selectionEnabled ? 'left' : 'center',
      headerRight: () =>
        selectionEnabled
          ? SelectionHeader(
              () => deleteJobs(unlike, selectedJobs),
              unSelectAllJobs,
              () => selectAllJobs(favorites),
              selectedJobs.length,
              favorites.length,
            )
          : SettingsButton(navigation.navigate),
    });
  }, [navigation, favorites, selectedJobs, selectionEnabled, unlike]);

  return (
    <SafeArea header style={styles.container}>
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={ItemSeparatorComponent}
          data={favorites}
          renderItem={({ item }) => (
            <RenderFavoriteJob
              item={item}
              onPress={() => handleOnPress(item.jobkey)}
              onLongPress={() => handleLongPress(item.jobkey)}
              selected={getSelection(item.jobkey)}
            />
          )}
          keyExtractor={(item) => item.jobkey}
          extraData={state}
        />
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    height: '100%',
    width: SCREEN_WIDTH,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  container: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  margin: {
    marginBottom: 20,
  },
  mapContainer: {
    height: 0.25 * SCREEN_HEIGHT,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  iconStyle: {
    fontSize: 20,
  },
  iconButtonStyle: {
    margin: 0,
    padding: 0,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marginBottom: {
    marginBottom: 5,
  },
  details: {
    flex: 7,
  },
  italic: {
    fontStyle: 'italic',
  },
  textWidth: {
    maxWidth: '70%',
  },
  bold: {
    fontWeight: 'bold',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  buttonStyle: {
    backgroundColor: '#03A9F4',
  },
  headerContainer: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
