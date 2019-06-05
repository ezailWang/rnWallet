/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';

export default ({ buttons = [], activeIndex, onPress }) => {
  return (
    <View style={styles.container}>
      {buttons.map((item, index) => (
        <TouchableOpacity
          onPress={() => onPress(index)}
          key={item}
          style={[styles.item, activeIndex === index ? styles.active : {}]}
        >
          <Text style={{ color: 'white', fontSize: 12 }}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = {
  container: {
    width: 330,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dddddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center'
  },
  item: {
    width: 110,
    backgroundColor: 'transparent',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: '#25a7fd',
  },
};
