/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text } from 'react-native';

export default ({ color, text, style }) => {
  return (
    <View style={[styles.container, { borderBottomColor: color }, style]}>
      <Text style={[styles.text, { color }]}>{text}</Text>
    </View>
  );
};

const styles = {
  container: {
    borderBottomWidth: 1,
    // width: 70,
    alignSelf: 'center',
  },
  text: {
    fontSize: 14,
    alignSelf: 'center',
  },
};
