/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import NodeCard from '../../../../components/NodeCard';
import { I18n } from '../../../../config/language/i18n';

export default ({ icon, name, address,onRankPress,onPoolPress,onNodePress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.nodeInfo} onPress={onNodePress}>
        <NodeCard icon={icon} name={name} address={address} />
      </TouchableOpacity>
      <View style={styles.options}>
        <TouchableOpacity style={styles.optionContainer} onPress={onRankPress}>
          <View style={styles.optionItem}>
            <Image source={require('../images/rank.png')} />
            <Text>{I18n.t('activity.nodeSummary.rank')}</Text>
            <Image source={require('../images/arrow-right-black.png')} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={onPoolPress}>
          <View style={styles.optionItem}>
            <Image source={require('../images/wolunchi.png')} />
            <Text>{I18n.t('activity.nodeSummary.pool')}</Text>
            <Image source={require('../images/arrow-right-black.png')} />
          </View>
        </TouchableOpacity>
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
  optionContainer: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    elevation: 3,
    shadowColor: 'gray',
    shadowOffset: { height: 1, width: 0 },
    shadowRadius: 1,
    shadowOpacity: 0.5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
};
