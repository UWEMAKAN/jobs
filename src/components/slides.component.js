import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const Slides = ({ data, onSlidesComplete }) => {
  const renderLastSlide = (index) => {
    return index === data.length - 1 ? (
      <Button
        style={styles.buttonStyle}
        mode="contained"
        onPress={() => onSlidesComplete()}
      >
        Forward
      </Button>
    ) : null;
  };

  const renderSlides = () => {
    return data.map((slide, index) => (
      <View
        key={slide.text}
        style={[styles.slideStyle, { backgroundColor: slide.color }]}
      >
        <Text style={styles.textStyle}>{slide.text}</Text>
        {renderLastSlide(index)}
      </View>
    ));
  };

  return (
    <ScrollView horizontal pagingEnabled style={styles.container}>
      {renderSlides()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  textStyle: {
    fontSize: 30,
    color: '#f1f1f1',
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: '#0288D1',
    marginTop: 15,
  },
});
