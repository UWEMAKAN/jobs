/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { Card, Title, Button, IconButton, Colors } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { SafeArea, Swipe, ActivityIndicator } from '../components';
import { FavoritesContext, LocationContext, fetchJobs } from '../services';

const JOB_SEARCH_START = 'JOB_SEARCH_START';
const JOB_SEARCH_SUCCESS = 'JOB_SEARCH_SUCCESS';
const JOB_SEARCH_FAILURE = 'JOB_SEARCH_FAILURE';
const CLEAR_ALL_JOBS = 'CLEAR_ALL_JOBS';
const INCREASE_INDEX = 'INCREASE_INDEX';
const DECREASE_INDEX = 'DECREASE_INDEX';

const initialState = {
  isLoading: false,
  jobs: [],
  error: null,
  index: 0,
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case JOB_SEARCH_START: {
      return { ...state, error: null, isLoading: true };
    }
    case JOB_SEARCH_SUCCESS: {
      return {
        ...state,
        jobs: [...state.jobs, action.payload],
        error: null,
        isLoading: false,
      };
    }
    case JOB_SEARCH_FAILURE: {
      return { ...state, error: action.payload, isLoading: false };
    }
    case CLEAR_ALL_JOBS: {
      return { ...state, jobs: [], error: null, isLoading: true };
    }
    case INCREASE_INDEX: {
      return { ...state, isLoading: true, index: state.index + 1 };
    }
    case DECREASE_INDEX: {
      return { ...state, isLoading: true, index: state.index - 1 };
    }
    default:
      return state;
  }
};

const locationIcon = (props) => <MaterialIcons name="my-location" {...props} />;
const nextIcon = (props) => <FeatherIcon name="chevron-right" {...props} />;
const previousIcon = (props) => <FeatherIcon name="chevron-left" {...props} />;

const DeckButton = (props) => <IconButton {...props} />;

if (__DEV__) {
  // eslint-disable-next-line global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

const isAndroid = Platform.OS === 'android';
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const DeckScreen = ({ navigation }) => {
  const { zipCodes, isLoading: loadingLocation } = useContext(LocationContext);
  const { likeJob } = useContext(FavoritesContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoading, jobs } = state;
  const [index, setIndex] = useState(0);

  const startJobSearch = async (code) => {
    dispatch({ type: JOB_SEARCH_START });
    try {
      const result = await fetchJobs(code);
      return dispatch({
        type: JOB_SEARCH_SUCCESS,
        payload: result,
      });
    } catch (err) {
      return dispatch({ type: JOB_SEARCH_FAILURE, payload: err.message });
    }
  };

  useEffect(() => {
    if (jobs.length) {
      dispatch({ type: CLEAR_ALL_JOBS });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipCodes]);

  useEffect(() => {
    if (zipCodes.length) {
      if (!jobs[index]) {
        return startJobSearch(zipCodes[index]);
      }
    }
  }, [index, zipCodes, jobs]);

  const renderCard = (job) => {
    const initialRegion = {
      longitude: job.longitude,
      latitude: job.latitude,
      longitudeDelta: 0.01,
      latitudeDelta: 0.01125,
    };
    const description = job.snippet.replace(/<b>/g, '').replace(/<\/b>/g, '');
    return (
      <Card style={styles.cardStyle}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              scrollEnabled={false}
              initialRegion={initialRegion}
              cacheEnabled={isAndroid}
            >
              <Marker
                title={job.company}
                coordinate={{
                  longitude: job.longitude,
                  latitude: job.latitude,
                }}
              />
            </MapView>
          </View>
          <Text style={styles.title}>{job.jobtitle}</Text>
          <View style={styles.detailWrapper}>
            <Text style={styles.companyName}>{job.company}</Text>
            <Text>{job.formattedRelativeTime}</Text>
          </View>
          <Text>{description}</Text>
        </Card.Content>
      </Card>
    );
  };
  const renderNoMoreCards = () => {
    return (
      <Card>
        <Card.Content>
          <Title style={{ textAlign: 'center' }}>No More Cards</Title>
          <Button
            icon={locationIcon}
            style={{
              backgroundColor: '#03A9F4',
              paddingTop: 5,
              paddingBottom: 5,
              marginTop: 10,
            }}
            mode="contained"
            onPress={() => navigation.navigate('Map')}
          >
            Back to Map
          </Button>
          {/* my-location */}
        </Card.Content>
      </Card>
    );
  };

  const onSwipeRight = (job) => {
    likeJob(job);
  };

  const increaseIndex = () => {
    // return dispatch({ type: INCREASE_INDEX });
    setIndex((prev) => prev + 1);
  };

  const decreaseIndex = () => {
    // return dispatch({ type: DECREASE_INDEX });
    setIndex((prev) => prev - 1);
  };

  return (
    <SafeArea>
      <View style={styles.swipe}>
        {isLoading || loadingLocation || !jobs[index] ? (
          <ActivityIndicator />
        ) : (
          <Swipe
            data={jobs[index]}
            renderCard={renderCard}
            renderNoMoreCards={renderNoMoreCards}
            keyName="jobkey"
            onSwipeRight={onSwipeRight}
          />
        )}
      </View>
      <View style={styles.decks}>
        <DeckButton
          style={styles.deckButton}
          icon={previousIcon}
          onPress={decreaseIndex}
          size={35}
          color={Colors.grey700}
          disabled={index === 0}
        />
        <Text>
          Deck {index + 1} of {zipCodes.length}
        </Text>
        <DeckButton
          style={styles.deckButton}
          icon={nextIcon}
          onPress={increaseIndex}
          size={35}
          color={Colors.grey700}
          disabled={index === zipCodes.length - 1}
        />
      </View>
    </SafeArea>
  );
};

DeckScreen.whyDidYouRender = true;

const styles = StyleSheet.create({
  swipe: {
    flex: 5,
  },
  decks: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckButton: {
    borderColor: Colors.grey700,
    borderRadius: 100,
    borderWidth: 1,
  },
  cardStyle: {
    height: 0.675 * SCREEN_HEIGHT,
  },
  detailWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mapContainer: {
    height: 0.4 * SCREEN_HEIGHT,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  companyName: {
    maxWidth: '70%',
  },
  title: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
});
