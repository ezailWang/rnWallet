/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, Image, ScrollView,StatusBar } from 'react-native';
import NodeInfo from './components/NodeInfo';
import BenefitInfo from './components/BenefitInfo';
import DescView from './components/DescView';
import Button from './components/Button';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';

export default class WLActiveActivate extends BaseComponent {

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text="涡轮计划" />
        <ScrollView>
          <NodeInfo
            icon={<Image source={require('./images/active.png')} />}
            name="激活节点"
            address="0x000005cd940.....5cd9405cd940"
          />
          <BenefitInfo total="10" forest="---" cycle="---" invite="10" source="10" />

          <View style={styles.rightNode}>
            <View style={styles.rightNodeHeader}>
              <Image source={require('./images/backdate-l.png')} />
              <Text style={styles.headerText}>升级成为权益节点</Text>
            </View>
            <View style={styles.divider} />
            <Image source={require('./images/up5L1.png')} />
            <View style={styles.activeLabel}>
              <Text>激活节点</Text>
              <Text>权益节点</Text>
            </View>
            <DescView
              descArr={[
                '激活节点的第一层5个节点充满后，激活节点成为权益节点',
                '权益节点可参与森林收益、溯源收益、邀请收益',
              ]}
            />
            <Image source={require('./images/zt1.png')} style={{ marginVertical: 15 }} />
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
    backgroundColor: '#f8f8f8',
  },
  rightNode: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  rightNodeHeader: {
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
