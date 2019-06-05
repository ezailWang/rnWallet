/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text } from 'react-native';

export default ({ icon, title, address }) => {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.address}>{address}</Text>
    </View>
  );
};

const styles = {
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 15,
    marginBottom: 6,
  },
  address: {
    fontSize: 12,
    color: '#a6a6a6',
    width: 140,
  },
};