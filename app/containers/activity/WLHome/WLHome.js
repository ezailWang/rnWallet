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
  RefreshControl,
} from 'react-native';
import Tag from './components/Tag';
import Bonus from './components/Bonus';
import DetailItem from './components/DetailItem';
import TextLink from '../../../components/TextLink';
import Chart from './components/Chart';
import ChartLabel from './components/ChartLabel';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import { connect } from 'react-redux';
import * as Actions from '../../../config/action/Actions';
import NetworkManager from '../../../utils/NetworkManager';
import { showToast } from '../../../utils/Toast';
import { I18n } from '../../../config/language/i18n';
import LayoutConstants from '../../../config/LayoutConstants';
import { Colors } from '../../../config/GlobalConfig';

let countdownTimer

class WLHome extends BaseComponent {

  constructor(){
    super()

    this.state = {
      timeLeft:0,
      trueTimeLeft:0,
      isRefreshing:false,
    }
  }

  onRefresh = async () => {
    this.setState({
      isRefreshing: true,
    });

    try {
      var result = await NetworkManager.queryActivityInfo();
      // console.warn(result)
    } catch (e) {
      showToast('query avtivity info error', 30);
    }

    if(result.code == 200){
      this.props.navigation.state.params.info = result.data

      let {timeLeft, gameOver, gameStart} = result.data

      this.props.setActivityStatus({
        gameOver,
        gameStart,
        timeLeft:timeLeft
      })
    }

    this.setState({
      isRefreshing: false,
    });
  };


  didTapActivityButton = async ()=>{

    // this.props.navigation.navigate('NodeTrxPending',{
    //   amount:10000, 
    //   fromAddress:'0x123123213123',
    //   toAddress:'0x45611134235',
    //   gasPrice:'0.11435123',
    //   txHash:'0xee42da7874a38d0ebf57a6e2642981aacb0af841084fc412b2df3b5ed4d8cca4'
    // })
    // return 

    this._showLoading()
    let result = await NetworkManager.queryKeyAddressInfo()
    this._hideLoading()
    if(result.code == 200){

      this.props.setKeyContractAddress(result.data)
      this.props.navigation.navigate('ChooseActivityETHWallet');
    }else{
      showToast(I18n.t('activity.home.failed'))
    }
  }

  componentWillMount() {
    super.componentWillMount()
    this._isMounted=true
  }
  componentWillUnmount(){
    super.componentWillUnmount()
    this._isMounted=false
    clearInterval(countdownTimer)
  }


  toHHmmss =  (data)=>{
    var s;
    var hours = parseInt(data/(1000 * 60 * 60))
    var minutes = parseInt((data / (1000 * 60)) % 60)
    var seconds = parseInt((data/1000)%60)
    s = (hours < 10 ? ('0' + hours) : hours) + ':' + (minutes < 10 ? ('0' + minutes) : minutes) + ':' + (seconds < 10 ? ('0' + seconds) : seconds);
    return s;
  }

  _initData = ()=>{

    //数据
    let { info } = this.props.navigation.state.params;
    let {timeLeft, gameOver, gameStart} = info

    this.props.setActivityStatus({
      gameOver,
      gameStart
    })

    let countdown = ()=>{
      
      let left = this.state.timeLeft == 0 ? timeLeft : this.state.timeLeft
      let leftFormat = this.toHHmmss(left)

      //一秒
      left = left - 1000

      // console.log('开始倒计时')

      this.setState({
        trueTimeLeft:leftFormat,
        timeLeft:left
      })
    }

    countdown()

    countdownTimer = setInterval(()=>{
      countdown()
    },1*1000)
  }

  didTapRuleButton = ()=>{
    this.props.navigation.navigate('WebViewScreen',{
      webType:4
    })
  }

  renderComponent = () => {

    console.log(this.props)

    //数据
    let { info } = this.props.navigation.state.params;
    let {activeNum, benefitNum, bonusReward, normalNum, paidReward, poolReward, poolRewardTarget, sequence, totalPoolReward, vipNum} = info

    let {gameOver, gameStart} = this.props

    let {trueTimeLeft} = this.state

    let series = [activeNum, benefitNum, vipNum,normalNum];
    const sliceColor = ['#0597fb', '#ffa235', '#fff100', '#7be1ff'];

    const titleImage = I18n.locale === 'zh' ? require('./images/title.png') : require('./images/title_en.png')

    const { navigation } = this.props;
    const chartWidth = 100;

    let roundTitle = gameOver ? '已发放' : I18n.t('activity.common.roundFormat').replace("%s",sequence)

    let leftTimeString = gameOver ?'已结束': trueTimeLeft

    let paidRewardValue = Number(parseFloat(paidReward).toFixed(2))


    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <NavHeader navigation={navigation} color="transparent" />
        
          <ImageBackground
            resizeMode="cover"
            source={require('./images/home_banner.png')}
            style={styles.banner}
          >
            <Image source={titleImage} style={{ width: '100%' }} />
          </ImageBackground>
          <ScrollView
            
            refreshControl={
              <RefreshControl
                onRefresh={this.onRefresh}
                refreshing={this.state.isRefreshing}
                colors={[Colors.themeColor]}
                tintColor={Colors.whiteBackgroundColor}
              />
            }
            scrollEnabled={true}
            style={{position:'absolute',height:LayoutConstants.WINDOW_HEIGHT }}
          >
          <View style={styles.infoContainer}>
            <Tag text={roundTitle} color="#46b6fe" />
            {
              gameOver?
              <Bonus gameOver={gameOver} bonus={isNaN(paidRewardValue) ? '--' : paidRewardValue.toFixed(4)} total={100} current={100} color="#46b6fe" style={{ marginVertical: 10 }} />:
              <Bonus gameOver={gameOver} bonus={bonusReward} total={poolRewardTarget} current={poolReward} color="#46b6fe" style={{ marginVertical: 10 }} />
            }
            <DetailItem title={I18n.t('activity.home.deadline')} text={gameStart?leftTimeString:'--'} />
            <DetailItem title={I18n.t('activity.home.poolReward')} text={totalPoolReward == '' ? '--' : totalPoolReward.toFixed(4)+' ITC'} />
            {
              gameOver?null:
              <DetailItem title={I18n.t('activity.home.paidReward')} text={paidReward == '' ? '--' : (isNaN(paidRewardValue) ? '--' : paidRewardValue.toFixed(4)) +' ITC'} />
            }
            <View style={styles.divider} />

            <View style={styles.chartContainer}>
              <ChartLabel
                label={I18n.t('activity.common.normalNode')}
                color="#7be1ff"
                number={normalNum}
                style={{ position: 'absolute', top: 0, left: 0 }}
              />
              <ChartLabel
                label={I18n.t('activity.common.activeNode')}
                color="#0597fb"
                number={activeNum}
                style={{ position: 'absolute', top: 0, right: 0 }}
              />
              <ChartLabel
                label={I18n.t('activity.common.benefitNode')}
                color="#ffa235"
                number={benefitNum}
                style={{ position: 'absolute', bottom: 0, right: 0 }}
              />
              <ChartLabel
                label={I18n.t('activity.common.superNode')}
                color="#fff100"
                number={vipNum}
                style={{ position: 'absolute', bottom: 0, left: 0 }}
              />

              <Chart chart_wh={chartWidth} series={series} sliceColor={sliceColor} doughnut />
            </View>
          </View>
          <TextLink onPress={this.didTapRuleButton} color="#00afc9" text={I18n.t('activity.home.rule')} style={{ marginVertical: 20 }} />
          <TouchableOpacity onPress={this.didTapActivityButton} style={[styles.button, { backgroundColor: '#01a1f1' }]}>
            <Text style={{ color: 'white' }}>{I18n.t('activity.home.myActivity')}</Text>
          </TouchableOpacity>
          
        </ScrollView>
      </View>
    );
  }
}


const mapStateToProps = state => ({
  myLanguage: state.Core.myLanguage,
  gameOver:state.Core.gameOver,
  gameStart:state.Core.gameStart
});
const mapDispatchToProps = dispatch => ({
  setKeyContractAddress: params => dispatch(Actions.setKeyContractAddress(params)),
  setActivityStatus:params=>dispatch(Actions.setActivityStatus(params)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WLHome);

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
    marginTop:185,
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
    // marginTop: 0,
    padding: 20,
  },

  divider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#959595',
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
