import React from 'react';
import { View, Image, Text, Platform } from 'react-native';

export default ({ text }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 25 }}>
      <Image
        source={require('../images/check.png')}
        style={{ width: 16, height: 16, marginRight: 15 }}
      />
      <Text
        style={{ color: 'white', fontSize: Platform.OS === 'ios' ? 14 : 12, fontWeight: '600' }}
      >
        {text}
      </Text>
    </View>
  );
};
