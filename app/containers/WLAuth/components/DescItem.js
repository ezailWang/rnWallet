/* eslint-disable no-use-before-define */
import React from 'react';
import { View } from 'react-native';

export default ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.dot} />
      {text}
    </View>
  );
};

const styles = {
  container: {
    maxWidth: '90%',
    flexDirection: 'row',
    marginVertical: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#04b2fb',
    marginRight: 10,
    marginTop: 6,
  },
};
