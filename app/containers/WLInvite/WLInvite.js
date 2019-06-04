/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Image, StatusBar } from 'react-native';
import DescView from '../../components/DescView';
import TextLink from '../../components/TextLink';
import NavHeader from '../../components/NavHeader';
import BaseComponent from '../base/BaseComponent';

export default class WLInvite extends BaseComponent {
  render() {
    const { navigation } = this.props;
    const descArr = [
      '每邀请以为好友成为激活节点，获得5个ITC的邀请奖励',
      '成为权益节点后，自己涡轮树中每激活一个节点，获得1个ITC',
      '邀请好友最多的前5名，可获得额外奖励',
    ];
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text="邀请好友" />
        <View style={styles.imgContainer}>
          <Image source={require('./images/img.png')} style={styles.banner} resizeMode='contain'/>
        </View>
        <Text style={styles.title}>邀请好友，领取更多奖励</Text>
        <DescView descArr={descArr} />
        <TouchableHighlight style={styles.button}>
          <Text style={{ color: 'white' }}>复制邀请口令</Text>
        </TouchableHighlight>
        <TextLink color="#01a1f1" text="我的二维码" />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imgContainer: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingTop: 30
  },
  banner: {
    width: 270,
    height: 143
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4792F6',
    marginVertical: 30,
    alignSelf: 'center',
  },
  button: {
    width: 250,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 12,
    backgroundColor: '#01a1f1',
    marginVertical: 25,
  },
};
