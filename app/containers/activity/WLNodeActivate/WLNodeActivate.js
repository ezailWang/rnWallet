/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TextInput, Image,StatusBar } from 'react-native';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';

export default class WLNodeActivate extends BaseComponent {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text="激活" />
        <View style={styles.editor}>
          <View style={styles.img}>
            <Image source={require('./images/levelUP15.png')} />
            <View style={styles.imgDesc}>
              <Text>普通节点</Text>
              <Text>激活节点</Text>
            </View>
          </View>

          <Text style={styles.title}>邀请人</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="0x开头的42位钱包地址" />
            <Image source={require('./images/saomiao.png')} style={{ width: 20, height: 20 }} />
          </View>
          <View style={styles.desc}>
            <Text style={styles.descItem}>邀请人信息，提交后不可修改</Text>
            <Text style={styles.descItem}>
              若无人邀请，可选择<Text style={styles.descItemWeight}>填写默认地址</Text>
            </Text>
          </View>
          <TouchableHighlight style={[styles.button, { backgroundColor: '#46b6fe' }]}>
            <Text style={{ color: 'white' }}>激活</Text>
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
  img: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },
  imgDesc: {
    flexDirection: 'row',
    width: 205,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    paddingVertical: 12,
  },
  desc: {
    padding: 15,
    backgroundColor: '#f8fbff',
    marginBottom: 25,
    borderTopWidth: 1.5,
    borderColor: '#9ab1c2',
  },
  descItem: {
    color: '#999C9D',
    fontSize: 15,
    padding: 2,
  },
  descItemWeight: {
    color: '#4E9BF4',
    fontSize: 15,
    padding: 2,
  },
  button: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 15,
  },
};
