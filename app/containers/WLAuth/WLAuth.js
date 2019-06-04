/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Image,StatusBar } from 'react-native';

import AddressItem from './components/AddressItem';
import DescItem from './components/DescItem';
import NavHeader from '../../components/NavHeader';
import BaseComponent from '../base/BaseComponent';

export default class WLAuth extends BaseComponent {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text="合约授权" />
        <View style={styles.transfer}>
          <AddressItem
            icon={<Image source={require('./images/qianbaodizhi.png')} />}
            title="钱包地址"
            address="0x5er4678678r67e87sf6s7a8f678dsf"
          />
          <Image source={require('./images/bangding.png')} style={styles.arrow} />
          <AddressItem
            icon={<Image source={require('./images/heyue.png')} />}
            title="合约地址"
            address="0x5er4678826fa67da6767ad67a6d2"
          />
        </View>
        <View style={styles.desc}>
          <DescItem
            text={
              <Text style={styles.text}>
                本活动所涉及的数字资产操作均经由以太坊智能合约执行，参与前需要先完成合约授权
              </Text>
            }
          />
          <DescItem
            text={
              <Text style={styles.text}>
                授权后，合约将获得在用户发起交易时扣除账户内对应的ITC数量的权利
              </Text>
            }
          />
          <DescItem
            text={
              <Text style={styles.text}>
                本次授权额度为<Text style={styles.numberText}>1,000,000 ITC</Text>
                ，超出额度后需再次授权
              </Text>
            }
          />
          <DescItem
            text={
              <Text style={styles.text}>
                本次授权操作将消耗手续费(即矿工费<Text style={styles.numberText}>0.0016 ETH</Text>
                )，请确保账户内有足够余额
              </Text>
            }
          />
        </View>

        <TouchableHighlight style={[styles.button, { backgroundColor: '#01a1f1' }]}>
          <Text style={{ color: 'white' }}>确认授权</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  transfer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingTop: 35,
    backgroundColor: '#f8f8f8',
  },
  arrow: {
    marginBottom: 80,
  },
  desc: {
    paddingHorizontal: 35,
    paddingVertical: 25,
  },
  text: {
    fontSize: 16,
  },
  numberText: {
    color: '#00b7fe',
    fontWeight: '600',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 15,
  },
};
