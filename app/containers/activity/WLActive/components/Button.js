/* eslint-disable no-use-before-define */
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default ({ text, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={{ color: 'white' }}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  button: {
    width: '90%',
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 15,
    backgroundColor: '#4BA5EB',
  },
};
