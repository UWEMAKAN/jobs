import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 200;

export const Swipe = ({
  data,
  renderCard,
  onSwipeRight = () => {},
  onSwipeLeft = () => {},
  renderNoMoreCards = () => {},
  keyName = 'id',
}) => {
  const [index, setIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const currentData = usePrevious(data);

  useEffect(() => {
    if (currentData !== data) {
      setIndex(0);
    }
  }, [currentData, data]);

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const onSwipeComplete = (direction) => {
    const item = data[index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    position.setValue({ x: 0, y: 0 });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setIndex(index + 1);
  };

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    const y = 0;
    Animated.timing(position, {
      toValue: { x, y },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const panResponder = useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const { dx, dy } = gestureState;
        position.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: (event, gestureState) => {
        const { dx } = gestureState;
        if (dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    }),
  );
  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
      outputRange: ['-120deg', '0deg', '120deg'],
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };
  const renderCards = () => {
    if (index >= data.length) {
      return renderNoMoreCards();
    }
    return data
      .map((item, itemIndex) => {
        if (itemIndex < index) {
          return null;
        }
        if (itemIndex === index) {
          return (
            <Animated.View
              key={item[keyName]}
              style={[getCardStyle()]}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...panResponder.panHandlers}
            >
              {renderCard(item)}
            </Animated.View>
          );
        }
        return (
          <Animated.View
            key={item[keyName]}
            style={[styles.cardStyle, { top: 5 * (itemIndex - index) }]}
          >
            {renderCard(item)}
          </Animated.View>
        );
      })
      .reverse();
  };

  return <View>{renderCards()}</View>;
};

const styles = StyleSheet.create({
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    zIndex: 0,
  },
});

const usePrevious = (prev) => {
  const ref = useRef();
  useEffect(() => {
    ref.previous = prev;
  });
  return ref.previous;
};
