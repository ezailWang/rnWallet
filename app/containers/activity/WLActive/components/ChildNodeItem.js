/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text} from 'react-native';

export default ({ no, value, total = 100 }) => {
  const rate = (value * 100) / total;
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.no}>{no}</Text>
        <View style={[styles.progress, { width: `${rate}%` }]} />
      </View>
      <Text>{value}</Text>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  no: {
    width: 20,
    marginRight: 15,
  },
  progress: {
    backgroundColor: '#60B1F5',
    height: 10,
    borderRadius: 5,
    maxWidth: '82%'
  },
};
