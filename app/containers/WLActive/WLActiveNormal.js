/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, Image, ScrollView,StatusBar } from 'react-native';
import NodeInfo from './components/NodeInfo';
import DescView from './components/DescView';
import Button from './components/Button';
import NavHeader from '../../components/NavHeader';
import BaseComponent from '../base/BaseComponent';

export default class WLActiveNormal extends BaseComponent {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text="涡轮计划" />
        <ScrollView>
          <NodeInfo
            icon={<Image source={require('./images/normal.png')} />}
            name="普通节点"
            address="0x000005cd940.....5cd9405cd940"
          />
          <View style={styles.activateNode}>
            <View style={styles.activateNodeHeader}>
              <Image source={require('./images/backdate-l.png')} />
              <Text style={styles.headerText}>升级成为激活节点</Text>
            </View>
            <View style={styles.divider} />
            <Image source={require('./images/levelUP15.png')} />
            <View style={styles.activeLabel}>
              <Text>普通节点</Text>
              <Text>激活节点</Text>
            </View>
            <DescView
              descArr={[
                '普通节点花费15ITC升级成为激活节点',
                '升级花费的ITC不会返还',
                '激活节点可享受子节点的邀请收益',
              ]}
            />
          </View>
        </ScrollView>
        <Button text="激活" style={{ position: 'absolute', bottom: 20 }} />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  activateNode: {
    // flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  activateNodeHeader: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    color: '#4DA9F3',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e4e4e4',
    width: '90%',
    marginVertical: 15,
  },
  activeLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 205,
    marginTop: 8,
  },
};
