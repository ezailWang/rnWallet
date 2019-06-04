/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text } from 'react-native';

export default ({ type, time, count }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.type}>{type}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Text style={styles.count}>{count} ITC</Text>
    </View>
  );
};

const styles = {
  container: {
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#f4f4f4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  type: {
    fontSize: 15,
    color: '#000000',
    fontWeight: 'bold',
  },
  time: {
    fontSize: 13,
    color: '#a4a4a4',
    marginTop: 4,
  },
  count: {
    fontSize: 15,
    color: '#000000',
    fontWeight: 'bold',
  },
};
