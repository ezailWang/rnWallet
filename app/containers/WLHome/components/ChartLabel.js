import React from 'react';
import { View, Text } from 'react-native';

export default ({ color, label, number, style }) => {
  return (
    <View style={style}>
      <Text style={{ fontSize: 15, color: 'gray', letterSpacing: 1.1 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ width: 28, height: 8, borderRadius: 5, backgroundColor: color }} />
        <Text style={{ fontSize: 13 }}>{number}</Text>
      </View>
    </View>
  );
};
