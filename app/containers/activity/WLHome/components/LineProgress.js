/* eslint-disable no-use-before-define */
import React from 'react';
import { View } from 'react-native';

export default ({ style }) => {
  return <View style={[styles.container, { ...style }]} />;
};

const styles = {
  container: {
    backgroundColor: '#bdbdbd',
    width: '80%',
    height: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  desc: {
    color: 'gray',
  },
};
