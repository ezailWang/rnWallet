/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TextInput,StatusBar } from 'react-native';
import NavHeader from '../../components/NavHeader';
import BaseComponent from '../base/BaseComponent';

export default class WLLock extends BaseComponent {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text="超级节点" rightText="详细说明" />
        <View style={styles.editor}>
          <Text style={styles.title}>质押数量</Text>
          <TextInput style={styles.input} placeholder="100,000 ITC起，1 ITC递增" placeholderTextColor="#e6e6e6"/>
          <View style={styles.desc}>
            <View style={styles.descItem}>
              <Text style={styles.descItemTitle}>锁定期限</Text>
              <Text style={styles.descItemValue}>90天</Text>
            </View>
            <View style={styles.descItem}>
              <Text style={styles.descItemTitle}>对应身份</Text>
              <Text style={styles.descItemValue}>涡轮超级节点</Text>
            </View>
          </View>
          <Text style={styles.title}>支付地址</Text>
          <View style={styles.divider} />

          <View style={styles.payInfo}>
            <View>
              <Text style={styles.payInfoTitle}>ETH Wallet Name01</Text>
              <Text style={styles.payInfoSubTitle}>0x000005...405cd940</Text>
            </View>
            <View>
              <Text style={styles.payInfoTitle}>100,000 ITC</Text>
              <Text style={[styles.payInfoSubTitle, { alignSelf: 'flex-end' }]}>余额</Text>
            </View>
          </View>
          <TouchableHighlight style={[styles.button, { backgroundColor: '#01a1f1' }]}>
            <Text style={{ color: 'white' }}>质押</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  editor: {
    flex: 1,
    marginTop: 10,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000'
    // marginBottom: 10,
  },
  input: {
    fontSize: 20,
    // fontWeight: 'bold',
    marginTop: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#9ab1c2',
  },
  desc: {
    padding: 10,
    backgroundColor: '#f8fbff',
    marginBottom: 25,
  },
  descItem: {
    height: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descItemTitle: {
    color: '#acafb0',
    fontSize: 12,
  },
  descItemValue: {
    color: '#666a6b',
    fontSize: 12,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#959595',
    marginVertical: 20,
  },
  payInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  payInfoTitle: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 3,
  },
  payInfoSubTitle: {
    fontSize: 12,
    color: '#acafb0',
  },
  button: {
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 15,
  },
};
