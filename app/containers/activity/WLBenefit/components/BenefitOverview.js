/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text } from 'react-native';

const COUNT_SIZE = 18;

export default ({ title, subtitle, count, scale = 0 }) => {
  return (
    <View style={[styles.container, { width: scale ? 200 : 100 }]}>
      {subtitle && <Text style={styles.subTitle}>{subtitle}</Text>}
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.count, { fontSize: COUNT_SIZE * (1 + scale / 5) }]}>{count}</Text>
    </View>
  );
};

const styles = {
  container: {
    padding: 10,
    alignItems: 'center',
  },
  subTitle: {
    color: 'white',
    fontSize: 10,
    marginBottom: 0,
  },
  title: {
    color: 'white',
    fontSize: 14,
  },
  count: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
  },
};
