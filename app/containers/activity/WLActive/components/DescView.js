/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text } from 'react-native';

export default ({ descArr }) => {
  return (
    <View style={styles.container}>
      {descArr.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <DescItem key={index} text={item} />
      ))}
    </View>
  );
};

function DescItem({ text }) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.dot} />
      <Text>{text}</Text>
    </View>
  );
}

const styles = {
  container: {
    width: '85%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#f7fcff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    // paddingTop: 20,
  },
  itemContainer: {
    maxWidth: '90%',
    flexDirection: 'row',
    marginVertical: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#04b2fb',
    marginRight: 10,
    marginTop: 5,
  },
};
