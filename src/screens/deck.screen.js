/* eslint-disable react-native/no-inline-styles */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { SafeArea, Swipe, ActivityIndicator } from '../components';
import { FavoritesContext, JobsContext } from '../services';

// eslint-disable-next-line react/jsx-props-no-spreading
const locationIcon = (props) => <MaterialIcons name="my-location" {...props} />;

if (__DEV__) {
  // eslint-disable-next-line global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

const isAndroid = Platform.OS === 'android';
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const DeckScreen = ({ navigation }) => {
  const { jobs, isLoading } = useContext(JobsContext);
  const { likeJob } = useContext(FavoritesContext);

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

  return (
    <SafeArea>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Swipe
          data={jobs}
          renderCard={renderCard}
          renderNoMoreCards={renderNoMoreCards}
          keyName="jobkey"
          onSwipeRight={onSwipeRight}
        />
      )}
    </SafeArea>
  );
};

DeckScreen.whyDidYouRender = true;

const styles = StyleSheet.create({
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
