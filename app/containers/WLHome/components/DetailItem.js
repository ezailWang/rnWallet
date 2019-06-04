/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text } from 'react-native';

export default ({ title, text }) => {
  return (
    <View style={styles.item}>
      <Text style={{ fontSize: 14, fontWeight: '500' , color:'#000000'}}>{title}</Text>
      <Text style={{ fontSize: 14, fontWeight: '500', color: 'gray' }}>{text}</Text>
    </View>
  );
};

const styles = {
  item: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
};
