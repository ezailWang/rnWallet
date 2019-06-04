/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, ImageBackground, ScrollView, Dimensions, StatusBar } from 'react-native';
import BenefitOverview from './components/BenefitOverview';
import BenefitItem from './components/BenefitItem';
import NavHeader from '../../components/NavHeader';
import BaseComponent from '../base/BaseComponent';

const { height } = Dimensions.get('window');
export default class WLBenefit extends BaseComponent {
  render() {
    const { navigation } = this.props;
    const benefitItems = [
      { type: '森林收益', time: '2019-04-30 16:41:58', count: 128.36 },
      { type: '森林收益(超级节点)', time: '2019-04-30 16:41:58', count: 298.15 },
      { type: '溯源收益', time: '2019-04-30 16:41:58', count: 1 },
      { type: '溯源收益', time: '2019-04-30 16:41:58', count: 5 },
      { type: '溯源收益', time: '2019-04-30 16:41:58', count: 1 },
      { type: '溯源收益', time: '2019-04-30 16:41:58', count: 1 },
    ];
    return (
      <View>
        <StatusBar barStyle="light-content" />
        <NavHeader navigation={navigation} color="transparent" />
        <ImageBackground
          resizeMode="cover"
          source={require('./images/banner.png')}
          style={styles.banner}
        >
          <View style={styles.benefitView}>
            <View style={styles.totalBenefit}>
              <BenefitOverview title="总收益(ITC)" count="2955.53" scale={5} />
            </View>
            <View style={styles.dividedBenefit}>
              <BenefitOverview title="森林收益" subtitle="IoT Chain" count="2955.53" />
              <View style={styles.divider} />
              <BenefitOverview title="邀请收益" subtitle="Erc 20" count="230" />
              <View style={styles.divider} />
              <BenefitOverview title="溯源收益" subtitle="Erc 20" count="156" />
            </View>
          </View>
        </ImageBackground>
        <ScrollView style={styles.list}>
          {benefitItems.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <BenefitItem key={index} type={item.type} time={item.time} count={item.count} />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  banner: {
    width: '100%',
    height: 230,
    justifyContent: 'center',
  },
  benefitView: {
    marginTop: 45,
  },
  totalBenefit: {
    alignItems: 'center',
  },
  dividedBenefit: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  divider: {
    width: 0.5,
    height: 50,
    backgroundColor: 'white',
  },
  list: {
    height: height - 230,
    backgroundColor: 'white',
  },
};
