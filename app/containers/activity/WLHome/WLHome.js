/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Tag from './components/Tag';
import Bonus from './components/Bonus';
import DetailItem from './components/DetailItem';
import TextLink from '../../../components/TextLink';
import Chart from './components/Chart';
import ChartLabel from './components/ChartLabel';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import Button from '../WLActive/components/Button';

export default class WLHome extends BaseComponent {

  constructor(){
    super()
  }

  didTapActivityButton = ()=>{

    this.props.navigation.navigate('ChooseActivityETHWallet');
  }

  renderComponent = () => {

    console.log(this.props)

    //数据
    let { info } = this.props.navigation.state.params;
    let {activeNum, benefitNum, bonusReward, normalNum, paidReward, poolReward, poolRewardTarget, sequence, timeLeft, totalPoolReward, vipNum} = info

    // let series = [1, 2, 3, 4];
    let series = [activeNum, benefitNum, vipNum,normalNum];
    const sliceColor = ['#0597fb', '#ffa235', '#fff100', '#7be1ff'];

    const { navigation } = this.props;
    const chartWidth = 100;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <NavHeader navigation={navigation} color="transparent" />
        <ScrollView
          scrollEnabled={false}
        >
          <ImageBackground
            resizeMode="cover"
            source={require('./images/banner.png')}
            style={styles.banner}
          >
            <Image source={require('./images/title.png')} style={{ width: '100%' }} />
          </ImageBackground>
          <View style={styles.infoContainer}>
            <Tag text={`第${sequence}轮`} color="#46b6fe" />
            <Bonus bonus={bonusReward} total={poolRewardTarget} current={poolReward} color="#46b6fe" style={{ marginVertical: 10 }} />
            <DetailItem title="结束倒计时" text={timeLeft} />
            <DetailItem title="涡轮池奖金" text={totalPoolReward} />
            <DetailItem title="已发放奖励" text={paidReward} />

            <View style={styles.divider} />

            <View style={styles.chartContainer}>
              <ChartLabel
                label="普通节点"
                color="#7be1ff"
                number={normalNum}
                style={{ position: 'absolute', top: 0, left: 0 }}
              />
              <ChartLabel
                label="激活节点"
                color="#0597fb"
                number={activeNum}
                style={{ position: 'absolute', top: 0, right: 0 }}
              />
              <ChartLabel
                label="权益节点"
                color="#ffa235"
                number={benefitNum}
                style={{ position: 'absolute', bottom: 0, right: 0 }}
              />
              <ChartLabel
                label="超级节点"
                color="#fff100"
                number={vipNum}
                style={{ position: 'absolute', bottom: 0, left: 0 }}
              />

              <Chart chart_wh={chartWidth} series={series} sliceColor={sliceColor} doughnut />
            </View>
          </View>
          <TextLink color="#00afc9" text="完整规则" style={{ marginVertical: 20 }} />
          <TouchableOpacity onPress={this.didTapActivityButton} style={[styles.button, { backgroundColor: '#01a1f1' }]}>
            <Text style={{ color: 'white' }}>我的涡轮计划</Text>
          </TouchableOpacity>
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
  banner: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: 'gray',
    shadowOffset: { height: 3, width: 0 },
    shadowRadius: 3,
    shadowOpacity: 0.5,
    alignItems: 'center',
    marginTop: -35,
    padding: 20,
  },

  divider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#bdbdbd',
    marginVertical: 15,
  },

  detailItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  chartContainer: {
    width: '100%',
    alignItems: 'center',
  },

  button: {
    width: '90%',
    // height: 40,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 15,
    marginBottom: 20,
    // underlayColor: 'transparent',
  },
};
