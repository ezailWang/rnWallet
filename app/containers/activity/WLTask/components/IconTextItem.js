import React from 'react';
import { View, Image, Text, Platform } from 'react-native';
import LayoutConstants from '../../../../config/LayoutConstants';

export default ({ text }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' ,marginTop:5}}>
      <Image
        source={require('../images/check.png')}
        style={{ width: 16, height: 16, marginRight: 15 }}
      />
      <Text
        style={{ width:LayoutConstants.WINDOW_WIDTH - (15 + 16 + 40) * 2, color: 'white', fontSize: Platform.OS === 'ios' ? 14 : 12, fontWeight: '600' }}
      >
        {text}
      </Text>
    </View>
  );
};
