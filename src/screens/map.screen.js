/* eslint-disable import/no-extraneous-dependencies */
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import FeatherIcon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

import { SafeArea, ActivityIndicator } from '../components';
import { JobsContext } from '../services';

if (__DEV__) {
  // eslint-disable-next-line global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

const SearchIcon = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <FeatherIcon {...props} name="search" />
);

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 30px;
  width: 90%;
  margin: 0 5% 0 5%;
`;

const initialState = {
  region: {
    longitude: -122,
    latitude: 37,
    longitudeDelta: 0.04,
    latitudeDelta: 0.09,
  },
};

const REGION_CHANGE_COMPLETE = 'REGION_CHANGE_COMPLETE';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case REGION_CHANGE_COMPLETE: {
      return { ...state, region: { ...action.payload } };
    }
    default:
      return state;
  }
};

export const MapScreen = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mapLoaded, setMapLoaded] = useState(true);
  const { searchJobs } = useContext(JobsContext);

  const onButtonPress = async () => {
    navigation.navigate('Deck');
    await searchJobs(state.region);
  };

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  return (
    <SafeArea header={true} style={styles.container}>
      {mapLoaded ? (
        <>
          <MapView
            style={styles.map}
            region={state.region}
            onRegionChangeComplete={(reg) => {
              dispatch({ type: REGION_CHANGE_COMPLETE, payload: reg });
            }}
          />
          <ButtonContainer>
            <Button
              style={styles.buttonStyle}
              mode="contained"
              icon={SearchIcon}
              onPress={onButtonPress}
            >
              Search this area
            </Button>
          </ButtonContainer>
        </>
      ) : (
        <ActivityIndicator />
      )}
    </SafeArea>
  );
};

// MapScreen.whyDidYouRender = true;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonStyle: {
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#009688',
  },
});
