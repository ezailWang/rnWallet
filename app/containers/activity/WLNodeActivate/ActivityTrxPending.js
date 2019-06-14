import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Clipboard,
  Image,
  Linking,
  ImageBackground,
  ScrollView,
  Platform
} from 'react-native';
import QRCode from 'react-native-qrcode';
import Layout from '../../../config/LayoutConstants';
import { TransparentBgNoBackButtonHeader } from '../../../components/NavigaionHeader';
import { Colors, Network } from '../../../config/GlobalConfig';
import { showToast } from '../../../utils/Toast';
import { I18n } from '../../../config/language/i18n';
import BaseComponent from '../../base/BaseComponent';
import NetworkManager from '../../../utils/NetworkManager';
import { GreyButtonMidele, BlueButtonMiddle} from '../../../components/Button';
import { connect } from 'react-redux';

const contentWidth = Layout.WINDOW_WIDTH * 0.8;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  scrollView: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
  },
  containerBox: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  countBox: {
    flexDirection: 'row',
    width: Layout.WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
    marginBottom: Layout.WINDOW_HEIGHT * 0.08,
    justifyContent: 'center',
  },
  countTxt: {
    marginLeft: 25,
    fontSize: 39,
    color: 'white',
    fontWeight: '700',
    // lineHeight: 39,
    // height: 39,
  },
  coinTypeTxt: {
    marginRight: 26,
    fontSize: 18,
    marginLeft: 6,
    color: 'white',
    lineHeight: 18,
    alignSelf: 'flex-end',
    height: 18,
    marginBottom: 3,
    // marginBottom: 7
  },
  fromAddressTitleBox: {
    flexDirection: 'row',
  },
  fromAddressName: {
    flex: 1,
    marginLeft: 8,
  },
  fromAddressBox: {
    flexDirection: 'row',
  },
  addContact: {
    alignSelf: 'flex-end',
    paddingLeft: 20,
    paddingTop: 10,
  },
  contentBox: {
    width: Layout.WINDOW_WIDTH * 0.9,
    alignSelf: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 20,
    // paddingTop: Layout.WINDOW_HEIGHT * 0.08,
    // paddingBottom: Layout.WINDOW_HEIGHT * 0.07,
    paddingTop: Layout.WINDOW_HEIGHT * 0.07,
    paddingBottom: Layout.WINDOW_HEIGHT * 0.06,
  },

  statusIcon: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: -50,
    zIndex: 10,
  },

  fontBlue: {
    fontSize: 13,
    color: Colors.fontBlueColor,
  },
  fontBlack: {
    fontSize: 13,
    color: Colors.fontBlackColor,
  },
  fontGray: {
    fontSize: 13,
    color: Colors.fontDarkGrayColor,
  },
  marginTop2: {
    // marginTop: Layout.WINDOW_HEIGHT * 0.009,
    marginTop: Layout.WINDOW_HEIGHT * 0.007,
    // marginTop:6
  },
  marginTop10: {
    // marginTop: Layout.WINDOW_HEIGHT * 0.02,
    // marginTop:16
    marginTop: Layout.WINDOW_HEIGHT * 0.016,
  },
  marginTop12: {
    marginTop: Layout.WINDOW_HEIGHT * 0.025,
  },
  bottomBox: {
    flexDirection: 'row',
    // marginTop: Layout.WINDOW_HEIGHT * 0.045,
    marginTop: Layout.WINDOW_HEIGHT * 0.04,
    // marginTop: 35,
  },
  infoLeftBox: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 0,
  },
  qrCodeBox: {
    marginLeft: 20,
  },
  copyBtn: {
    height: 29,
    marginTop: Layout.WINDOW_HEIGHT * 0.02,
    // marginTop: 16,
    borderRadius: 5,
    borderWidth: 1.2,
    borderColor: Colors.themeColor,
  },
  copyBtnTxt: {
    backgroundColor: 'transparent',
    color: Colors.themeColor,
    fontSize: 13,
    height: 29,
    lineHeight: 29,
    textAlign: 'center',
  }
});

let animationTimer = 0

class ActivityTrxPending extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      transactionType: 'ITC',
      fromAddress: '',
      toAddress: '',
      gasPrice: '',
      transactionHash: '',
      blockNumber: '~',
      transactionTime: '~',
      tranStatus: '2',
      qrCodeValue:'',
      nodeData:{},
      nextBtnTitle:I18n.t('activity.nodeVote.pending')
    };
    this._setStatusBarStyleLight();
  }


  didTapHomeBtn = ()=>{

    let {tranStatus, nodeData} = this.state

      if(tranStatus == '2'){

        this._showAlert(I18n.t('activity.nodeVote.pending_sub'))
      }
      else{
        
        let {goBackKey,refreshCall} = this.props.navigation.state.params;
        refreshCall(nodeData)
        this.props.navigation.goBack(goBackKey)
      }
  }

  // 时间戳换时间格式
  timestampToTime = (timestamp)=>{
    let date;
    if (timestamp.length === 10) {
      date = new Date(parseInt(timestamp, 10) * 1000);
    } else if (timestamp.length === 13) {
      date = new Date(parseInt(timestamp, 10));
    }
    const Y = `${date.getFullYear()}-`;
    const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
    const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return `${Y + M + D} ${h}:${m}:${s}`;
  }

  _initData = ()=>{

    let {amount, fromAddress, toAddress, gasPrice, txHash } = this.props.navigation.state.params;

    let {activityEthAddress} = this.props

    this.setState({
      amount:amount,
      fromAddress:fromAddress,
      toAddress:toAddress,
      gasPrice:gasPrice,
      transactionHash:txHash,
      qrCodeValue:txHash
    })

    //开始查询交易
    let time = new Date().valueOf()
    NetworkManager.listenETHTransaction(txHash,time,async (status)=>{

      let nextBtnTitle = ''
      if(status){
        nextBtnTitle = I18n.t('activity.nodeVote.txSure')
      }
      else{
        nextBtnTitle = I18n.t('activity.nodeVote.notfound') 
      }

      this.setState({
        blockNumber:status.blockNumber,
        gasPrice:status.gasUsed,
        nextBtnTitle:nextBtnTitle,
        transactionTime:this.timestampToTime(status.timestamp.toString())+' +0800',
      })

      //5秒后查询服务器
      setTimeout(async () => {
        
        let nodeInfo = await NetworkManager.queryNodeInfo({
          address:activityEthAddress
        });

        // this._hideLoading();
        if(nodeInfo.data){

          this.setState({
            nodeData:nodeInfo.data,
            tranStatus:status.status ? "1" : "0",
          })
        }
        else{
          this._showAlert(I18n.t('activity.nodeVote.failed'))
          // this.props.navigation.goBack();
          this.setState({
            tranStatus:status.status ? "1" : "0",
          })
        }

      }, 5 * 1000);
    })


    if(Platform.OS == 'android'){
    
      return
    }

    this.iconStatus = 0 

    animationTimer = setInterval(() => {
      
      if(this.state.tranStatus == "1" || this.state.tranStatus == "0"){
        
        clearInterval(animationTimer)
      }
      else{

        this.iconStatus  = (this.iconStatus + 1)%4

        console.log(this.iconStatus)

        let arr = ["2","3","4","5"]

        requestAnimationFrame(()=>{
          this.setState({
            tranStatus: arr[this.iconStatus]
          })
        });

      }
    }, 500);
  }
  
  _onBackPressed = ()=>{
    return true;
  }

  _hideAlert = ()=>{

    super._hideAlert()

    if(parseInt(this.state.tranStatus) == 1){

      this.props.navigation.navigate('NodeSummary',{
        nodeData:this.state.nodeData
      })
    }
    else if(parseInt(this.state.tranStatus ) != 2){
      let {navigation, selAvtivityContainerKey} = this.props
      navigation.goBack(selAvtivityContainerKey)
  }
}

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  didTapTransactionNumber = () => {

    const { network } = this.props
    const { transactionHash } = this.state
    let detailUrl;
    
    if (network === Network.rinkeby) {
      detailUrl = `https://rinkeby.etherscan.io/tx/${transactionHash}`;
    } else if (network === Network.main) {
      detailUrl = `https://etherscan.io/tx/${transactionHash}`;
    }
    
    Linking.canOpenURL(detailUrl)
      .then(supported => {
        if (!supported) {
          // todo 弹toast
          return null;
        }
        return Linking.openURL(detailUrl);
      })
      .catch(err => console.log('An error occurred', detailUrl, ' err:', err));
  };

  copyUrl() {
    Clipboard.setString(this.state.transactionHash);
    showToast(I18n.t('toast.copied'));
  }

  renderComponent = () => {

    let {nextBtnTitle, qrCodeValue, tranStatus, amount, blockNumber, transactionType, toAddress, gasPrice, transactionHash, transactionTime} = this.state

    let {navigation} = this.props

    tranStatus = parseInt(tranStatus)

    
    let statusIcon;
    if (tranStatus == 1) {
      statusIcon = require('../../../assets/transfer/trans_ok.png');
    }  
    else if (tranStatus == 0) {
      statusIcon = require('../../../assets/transfer/trans_fail.png');
    }
    else if (tranStatus == 2) {
      if(Platform.OS == 'android'){
        statusIcon = require('../../../assets/transfer/trx_penging_2.png');
      }
      else{
        statusIcon = require('../../../assets/transfer/trx_penging_0.png');
      }
    }
    else if (tranStatus == 3) {
      statusIcon = require('../../../assets/transfer/trx_penging_1.png');
    }
    else if (tranStatus == 4) {
      statusIcon = require('../../../assets/transfer/trx_penging_2.png');
    }
    else if (tranStatus == 5) {
      statusIcon = require('../../../assets/transfer/trx_penging_3.png');
    }


    return (
        <ImageBackground
          style={styles.container}
          source={require('../../../assets/launch/splash_bg.png')}
        >
        <TransparentBgNoBackButtonHeader
          navigation = {navigation}
          text={I18n.t('transaction.transaction_details')}
        />
        <ScrollView style={styles.scrollView}>
          <View style={[{ flex: 1, justifyContent: 'center' }]}>
            <View style={styles.containerBox}>
              <View style={styles.countBox}>
                <Text style={styles.countTxt}>{amount}</Text>
                <Text style={styles.coinTypeTxt}>{transactionType}</Text>
              </View>
              <View style={styles.contentBox}>
                <View style={styles.content}>
                  <View style={[styles.fromAddressTitleBox]}>
                    <Text style={[styles.fontGray, { paddingTop: 10 }]}>
                      {I18n.t('transaction.sending_party')}
                    </Text>
                  </View>
                  <Text style={[styles.fontBlack, styles.marginTop2]}>{this.state.fromAddress}</Text>
                  <View style={[styles.fromAddressTitleBox]}>
                    <Text style={[styles.fontGray, { paddingTop: 10 }]}>
                      {I18n.t('transaction.beneficiary')}
                    </Text>
                  </View>
                  <Text style={[styles.fontBlack, styles.marginTop2]}>{toAddress}</Text>
                  <View style={[styles.fromAddressTitleBox]}>
                    <Text style={[styles.fontGray, styles.marginTop10]}>
                      {I18n.t('transaction.miner_cost')}
                    </Text>
                  </View>
                  <Text style={[styles.fontBlack, styles.marginTop2]}>{gasPrice}</Text>

                  <View style={styles.bottomBox}>
                    <View style={styles.infoLeftBox}>
                      <Text style={[styles.fontGray]}>
                        {I18n.t('transaction.transaction_number')}
                      </Text>
                      <TouchableOpacity
                        style={[styles.marginTop2]}
                        activeOpacity={0.6}
                        onPress={this.didTapTransactionNumber}
                      >
                        <Text style={[styles.fontBlue]} numberOfLines={1} ellipsizeMode="middle">
                          {transactionHash}
                        </Text>
                      </TouchableOpacity>
                      <Text style={[styles.fontGray, styles.marginTop10]}>
                        {I18n.t('transaction.block')}
                      </Text>
                      <Text style={[styles.fontBlack, styles.marginTop2]}>
                        {blockNumber}
                      </Text>
                      <Text style={[styles.fontGray, styles.marginTop10]}>
                        {I18n.t('transaction.transaction_time')}
                      </Text>
                      <Text style={[styles.fontBlack, styles.marginTop2]}>
                        {transactionTime}
                      </Text>
                    </View>
                    <View style={[styles.qrCodeBox, { marginTop: 6 }]}>
                      <QRCode
                        value={qrCodeValue}
                        size={96}
                        bgColor="#000"
                        fgColor="#fff"
                        onLoad={() => {}}
                        onLoadEnd={() => {}}
                      />
                      <TouchableOpacity
                        style={[styles.copyBtn]}
                        activeOpacity={0.6}
                        onPress={this.copyUrl}
                      >
                        <Text style={styles.copyBtnTxt}>{I18n.t('transaction.copy_address')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',marginTop:20,marginBottom:-20,justifyContent:'center'}}>
                  {
                    tranStatus == 1 ? (
                      <BlueButtonMiddle  onPress={() => this.didTapHomeBtn()}
                        text={I18n.t('activity.nodeVote.act_home')}  
                      >
                      </BlueButtonMiddle>
                    ):(
                      <GreyButtonMidele onPress={() => this.didTapHomeBtn()}
                        text={nextBtnTitle}
                      >
                      </GreyButtonMidele>
                    )
                  }
                  </View>
                </View>
                <Image style={styles.statusIcon} source={statusIcon} resizeMode="contain" />
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  };
}

const mapStateToProps = state => ({
    network : state.Core.network,
    activityEthAddress : state.Core.activityEthAddress,
    activityItcAddress : state.Core.activityItcAddress,
    selAvtivityContainerKey: state.Core.selAvtivityContainerKey,
});
const mapDispatchToProps = dispatch => ({

});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivityTrxPending);