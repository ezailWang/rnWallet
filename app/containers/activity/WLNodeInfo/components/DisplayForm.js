/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text } from 'react-native';

export default ({ title, items }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
      {items.map(item => (
        <View key={item.label} style={styles.formItem}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={[styles.value, item.valueStyle]}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
    // marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#959595',
    marginVertical: 15,
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 7,
  },
  label: {
    width: 100,
    fontSize: 13,
    color: '#a1a1a1',
    marginTop: 2,
  },
  value: {
    fontSize: 13,
    maxWidth: 200,
  },
};