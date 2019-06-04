/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, StatusBar } from 'react-native';
import NodeItem from './components/NodeItem';
import HeaderBackButton from '../../components/HeaderBackButton';
import NavHeader from '../../components/NavHeader';
import LayoutConstants from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';

const { height } = Dimensions.get('window');
export default class WLNode extends BaseComponent {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#00a8f3',
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
    headerBackImage: <HeaderBackButton />,
  };

  render() {
    const { navigation } = this.props;
    const nodeList = [
      {
        no: 'NO.1',
        address: '0X5E6B6D...355CD940',
        count: '189,365',
      },
      {
        no: 'NO.2',
        address: '0X5E6B6D...355CD940',
        count: '215,978',
      },
      {
        no: 'NO.3',
        address: '0X5E6B6D...355CD940',
        count: '189,365',
      },
      {
        no: 'NO.4',
        address: '0X5E6B6D...355CD940',
        count: '215,978',
      },
      {
        no: 'NO.5',
        address: '0X5E6B6D...355CD940',
        count: '189,365',
      },
      {
        no: 'NO.6',
        address: '0X5E6B6D...355CD940',
        count: '215,978',
      },
    ];
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <NavHeader navigation={navigation} color="transparent" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>选择节点</Text>
          <Text style={styles.headerSubTitle}>选择一个节点，使用ITC进行投票</Text>
        </View>
        <View style={styles.nodeList}>
          <ScrollView>
            {nodeList.map(item => (
              <NodeItem key={item.no} no={item.no} address={item.address} count={item.count} />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    // flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#00a8f3',
    paddingHorizontal: 30,
    paddingBottom: 50,
    height: LayoutConstants.DEVICE_IS_IPHONE_X() ? 200 : 180,
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: LayoutConstants.DEVICE_IS_ANDROID() ? 60 : 70,
  },
  headerSubTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
  nodeList: {
    marginTop: -30,
    backgroundColor: 'transparent',
    height: height - 100 - 30,
  },
};
