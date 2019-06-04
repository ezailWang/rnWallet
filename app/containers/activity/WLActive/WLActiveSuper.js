/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, Image, ScrollView,StatusBar } from 'react-native';
import NodeInfo from './components/NodeInfo';
import BenefitInfo from './components/BenefitInfo';
import ChildNodeItem from './components/ChildNodeItem';
import Button from './components/Button';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';

export default class WLActiveSuper extends BaseComponent {
  render() {
    const { navigation } = this.props;
    const childNodes = [
      {
        no: 'L0',
        value: 1,
      },
      {
        no: 'L1',
        value: 4,
      },
      {
        no: 'L2',
        value: 12,
      },
      {
        no: 'L3',
        value: 8,
      },
      {
        no: 'L4',
        value: 6,
      },
      {
        no: 'L5',
        value: 2,
      },
    ];
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text="涡轮计划" />
        <ScrollView>
          <NodeInfo
            icon={<Image source={require('./images/super.png')} />}
            name="超级节点"
            address="0x000005cd940.....5cd9405cd940"
          />
          <BenefitInfo total="3,458" forest="2,560" cycle="8" invite="105" source="367" />

          <View style={styles.childNode}>
            <View style={styles.childNodeHeader}>
              <Image source={require('./images/ziJD.png')} />
              <Text style={styles.headerText}>我的子节点</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.childNodeList}>
              {childNodes.map(item => (
                <ChildNodeItem key={item.no} no={item.no} value={item.value} />
              ))}
            </View>
            <Button text="拓展子节点" />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  childNode: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  childNodeHeader: {
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
  childNodeList: {
    width: '90%',
    marginBottom: 10,
  },
};
