/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text, Image } from 'react-native';
import NodeCard from '../../../components/NodeCard';

export default ({ icon, name, address }) => {
  return (
    <View style={styles.container}>
      <View style={styles.nodeInfo}>
        <NodeCard icon={icon} name={name} address={address} />
      </View>
      {/* <View style={styles.nodeInfo}>
        <View style={styles.infoBody}>
          {icon}
          <View style={styles.infoDetail}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.address}>{address}</Text>
          </View>
        </View>
        <Image source={require('../images/arrow-right-white.png')} />
      </View> */}
      <View style={styles.options}>
        <View style={styles.optionItem}>
          <Image source={require('../images/rank.png')} />
          <Text>邀请排行榜</Text>
          <Image source={require('../images/arrow-right-black.png')} />
        </View>
        <View style={styles.optionItem}>
          <Image source={require('../images/wolunchi.png')} />
          <Text>涡轮池</Text>
          <Image source={require('../images/arrow-right-black.png')} />
        </View>
      </View>
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8f8f8',
  },
  nodeInfo: {
    width: '90%',
    // flexDirection: 'row',
    alignSelf: 'center',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // backgroundColor: '#4491F2',
    // paddingHorizontal: 10,
    // paddingVertical: 15,
    marginTop: 10,
    // borderRadius: 5,
  },
  infoBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoDetail: {
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  address: {
    fontSize: 15,
    color: 'white',
  },
  options: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    width: '48%',
    borderRadius: 5,
    elevation: 3,
    shadowColor: 'gray',
    shadowOffset: { height: 1, width: 0 },
    shadowRadius: 1,
    shadowOpacity: 0.5,
  },
};
