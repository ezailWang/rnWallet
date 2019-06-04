/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Image, ScrollView,StatusBar } from 'react-native';
import NodeCard from '../../../components/NodeCard';
import DisplayForm from './components/DisplayForm';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';

export default class WLNodeActivate extends BaseComponent {
  render() {
    const { navigation } = this.props;
    const taskInfos = [
      { label: '节点编号', value: 'NO.1' },
      { label: '总额度', value: '182,356 ITC' },
      { label: '我的投票', value: '600 ITC' },
      { label: '解锁日期', value: '2019-09-15' },
      { label: '转入记录', value: '0x07f79c...a5552c86', valueStyle: { color: '#50A6E5' } },
    ];
    const activateInfos = [
      { label: '邀请人', value: '0x6071455cfd0x6071455cfd0x6071455cfd' },
      { label: '激活时间', value: '2019-09-15 15:12:36' },
      { label: '激活记录', value: '0x07f79c...a5552c86', valueStyle: { color: '#50A6E5' } },
      { label: '晋级时间', value: '2019-09-15 15:12:36' },
    ];
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text="节点信息" />
        <ScrollView>
          <View style={styles.node}>
            <NodeCard
              icon={<Image source={require('./images/quanyi.png')} style={styles.icon} resizeMode='contain'/>}
              name="权益节点"
              address="0x607140ff5747426tdfsf0x607140ff5747426tdfsf"
              showArrow={false}
            />
          </View>
          <DisplayForm title="任务信息" items={taskInfos} />
          <DisplayForm title="激活信息" items={activateInfos} />
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
  node: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  icon: {
    width: 40,
    height: 40
  },
  cardContainer: {
    textAlign: 'center',
    alignItems: 'center',
  },
};
