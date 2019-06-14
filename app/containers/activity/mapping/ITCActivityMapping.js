import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../../../config/action/Actions';
import { BlueButtonBig } from '../../../components/Button';
import { Colors, TransferGasLimit } from '../../../config/GlobalConfig';
import { WhiteBgHeader } from '../../../components/NavigaionHeader';
import { I18n } from '../../../config/language/i18n';
import Layout from '../../../config/LayoutConstants';
import BaseComponent from '../../base/BaseComponent';
import NetworkManager from '../../../utils/NetworkManager';
import KeystoreUtils from '../../../utils/KeystoreUtils';
import { defaultTokens } from '../../../utils/Constants';
import MyAlertComponent from '../../../components/MyAlertComponent';
import StaticLoading from '../../../components/StaticLoading';

const StatusBarHeight = StatusBar.currentHeight;
const contentWidth = Layout.WINDOW_WIDTH * 0.9;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  keyboardAwareScrollView: {
    flex: 1,
  },

  topImg: {
    width: contentWidth - 40,
    height: ((contentWidth - 40) / 288) * 76,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
    justifyContent: 'flex-end',
  },
  mappingGuideBox: {
    textAlignVertical: 'bottom',
    paddingTop: 15,
    paddingBottom: 5,
    alignSelf: 'center',
  },
  mappingGuideText: {
    fontSize: 14,
    color: Colors.fontBlueColor,
    textDecorationLine: 'underline',
  },
  mAddressBox: {
    width: contentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.bgGrayColor_ed,
  },
  mAddressContent: {
    flex: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  mAddressTitle: {
    color: Colors.fontBlackColor_43,
    fontSize: 15,
    marginBottom: 6,
  },
  mAddressText: {
    color: Colors.fontGrayColor_a,
    fontSize: 14,
  },
  changeBox: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    marginLeft: 20,
  },
  changeText: {
    color: Colors.fontGrayColor_a0,
    fontSize: 15,
    paddingRight: 5,
  },
  changeIcon: {
    width: 12,
    height: 12,
  },
  mapContainView:{
    flexDirection: 'row',
    marginLeft:20,
    width:Layout.WINDOW_WIDTH - 40
    // justifyContent: 'space-between',
  },
  mAmountTitle: {
    flex:6,
    // width: contentWidth,
    // alignSelf: 'center',
    color: Colors.fontBlueColor,
    fontSize: 14,
    marginTop: 16,
  },
  mappingShow: {
    flex:4,
    // width: contentWidth,
    // alignSelf: 'right',
    textAlign:'right',
    color: Colors.fontBlueColor,
    fontSize: 14,
    marginTop: 16,
  },
  mAmountInputView: {
    flexDirection: 'row',
    marginTop: 10,
    width: contentWidth,
    alignSelf: 'center',
    height: 40,
    alignItems: 'flex-end',
    padding: 0,
  },
  mAmountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '600',
    height: 40,
    padding: 0,
    margin: 0,
    // textAlignVertical: 'bottom',
    alignItems: 'flex-end',
    color: Colors.fontBlueColor,
  },
  unit: {
    fontSize: 26,
    fontWeight: '600',
    color: Colors.fontBlueColor,
  },
  vLine: {
    width: contentWidth,
    height: 1,
    backgroundColor: Colors.bgGrayColor_e5,
    marginBottom: 15,
    alignSelf: 'center',
  },
  commonText: {
    width: contentWidth,
    color: Colors.fontGrayColor_a,
    fontSize: 13,
    marginTop: 5,
    alignSelf: 'center',
  },
  btn: {
    alignSelf: 'center',
  },

  initiationAddressBox: {
    width: contentWidth,
    alignSelf: 'center',
  },
  initiationAddressContent: {
    width: contentWidth,
    flexDirection: 'row',
    height: 30,
  },
  initiationAddressText: {
    color: Colors.fontGrayColor_a,
    fontSize: 14,
    marginTop: 5,
  },
  promptBox: {
    flex: 1,
  },
  promptTouch: {
    width: 40,
    height: 30,
    paddingLeft: 5,
    paddingTop: 6,
  },
  promptIcon: {
    width: 12,
    height: 12,
  },
  triangleIcon: {
    width: 12,
    height: 10,
    marginTop: -8,
    marginLeft: 5,
  },
  promptDescView: {
    position: 'absolute',
    width: contentWidth,
    alignSelf: 'center',
    backgroundColor: 'rgba(63,193,255,0.8)',
    borderRadius: 5,
    padding: 10,
    marginTop: 30,
    zIndex: 10,
  },
  promptDesc: {
    fontSize: 13,
    color: 'white',
  },

  modalBox: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.blackOpacityColor,
  },
  modalContent: {
    // height: 450,
    flex: 1,
    marginTop: Layout.WINDOW_HEIGHT - 500,
    width: Layout.WINDOW_WIDTH,
  },
  modalKeyboardContainer: {
    width: Layout.WINDOW_WIDTH,
    height: 500,
    // marginTop:Layout.WINDOW_HEIGHT - 450,
    margin: 0,
  },
  modalScrollView: {
    // marginTop: Platform.OS === 'android' ? Layout.ScreenHeight - 450 - StatusBarHeight : Layout.ScreenHeight - 450,
    flexDirection: 'row',
    flex: 1,
    width: Layout.WINDOW_WIDTH,
    marginBottom: 0,
    height: 500,
    backgroundColor: 'white',
  },
  mDetailBox: {
    width: Layout.WINDOW_WIDTH,
    height: 500,
    alignItems: 'center',
  },
  mTitleView: {
    width: Layout.WINDOW_WIDTH,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  mDetailTitle: {
    width: Layout.WINDOW_WIDTH - 100,
    color: Colors.fontBlackColor_43,
    fontSize: 18,
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
    marginLeft: 50,
  },
  mDetailCancelBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  mDetailCancelIcon: {
    width: 40,
    height: 40,
  },
  mDetailAmount: {
    height: 50,
    lineHeight: 60,
    color: Colors.fontBlackColor_43,
    fontSize: 22,
    fontWeight: '600',
  },
  mDetailItemView: {
    flexDirection: 'row',
    width: Layout.WINDOW_WIDTH - 40,
    marginTop: 15,
    marginBottom: 15,
  },
  mDetailItemTitle: {
    color: Colors.fontGrayColor_a,
    fontSize: 15,
    width: 80,
  },
  mDetailItemDesc: {
    flex: 1,
  },
  mDetailItemGray: {
    fontSize: 14,
    color: Colors.fontGrayColor_a,
  },
  mDetailItemBlack: {
    fontSize: 14,
    color: Colors.fontBlackColor_43,
  },

  mVLine: {
    width: Layout.WINDOW_WIDTH,
    height: 1,
    backgroundColor: Colors.bgGrayColor_e5,
  },
  mItenLine: {
    width: Layout.WINDOW_WIDTH - 40,
    height: 1,
    backgroundColor: Colors.bgGrayColor_e5,
  },

  mPwdBox: {
    width: Layout.WINDOW_WIDTH,
    height: 500,
    alignItems: 'center',
    marginRight: 0,
    marginBottom: 0,
  },
  mPwdBackBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mPwdBackIcon: {
    width: 30,
    height: 30,
  },
  mPwdTitle: {
    width: Layout.WINDOW_WIDTH - 100,
    color: Colors.fontBlackColor_43,
    fontSize: 18,
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
    marginRight: 50,
  },
  mPwdContentBox: {
    flex: 1,
    alignItems: 'center',
  },
  mPwdInput: {
    marginTop: 15,
    height: 40,
    borderColor: Colors.bgGrayColor_e5,
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 10,
    width: Layout.WINDOW_WIDTH - 40,
    fontSize: 15,
    // color: Colors.fontGrayColor_a,
  },
  modalNextBtn: {
    marginBottom: 30,
  },
  modalConfirmBtnView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalConfirmBtn: {
    marginBottom: 30,
  },

  modalPromptBox: {
    flexDirection: 'row',
    width: 80,
  },
  mPropmptDetailItemTitle: {
    color: Colors.fontGrayColor_a,
    fontSize: 15,
    width: 60,
  },
  modalPromptTouch: {
    width: 20,
    height: 30,
  },
  modalTriangleIcon: {
    width: 12,
    height: 10,
    marginTop: -14,
  },
  modalPromptDescView: {
    position: 'absolute',
    width: contentWidth,
    alignSelf: 'center',
    backgroundColor: 'rgba(63,193,255,0.8)',
    borderRadius: 5,
    padding: 10,
    top: 38,
    zIndex: 10,
  },
  convertEthWalletItcBalance: {
    color: Colors.fontBlackColor_0a,
    fontSize: 14,
    marginTop: 5,
    marginRight: 0,
  },
});

class ITCActivityMapping extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      convertEthWallet: {}, // 发起钱包
      gasCost: 0, // Gas费用
      isShowPrompt: false,
      convertItcWallet: {},
      suggestGasPrice: 0,
      defaultInputAmount: '',
      isShowMappingDetail: false,
      mappingValue:0,
      trxData:'',
      ethBalance:0,
      itcErc20Balance:0,
      destoryAddress:'',
      didMappingValue:0,
      showActivityModalVisible:false,
      isShowSLoading: false,
      sLoadingContent: '',
    };

    this.inputAmount = '';
    this.ethAmount = '0.008';
    this.gasAmount = '600';

    this.stepItem1Ref = React.createRef();
    this.stepItem2Ref = React.createRef();

    // this.scroll = React.createRef();
    // this.inputText = React.createRef();
  }

  
  _onBackPressed = ()=>{
    console.log('重写安卓返回事件')
    if(this.state.isShowMappingDetail){
      return true;
    }
    else{
      return super._onBackPressed()
    }
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _initData = async () => {
    // const { mappingData } = this.props.navigation.state.params;
    const {activityEthAddress,activityItcAddress} = this.props
    let destoryAddress = NetworkManager.createBlackHoleAddress(activityEthAddress,activityItcAddress)

    this._showLoading();

    try{
      var trxData = await NetworkManager.generalSendERC20TokenTrxData(defaultTokens[1].address,activityItcAddress,1)
      var estimateGas = await NetworkManager.getTransactionEstimateGas(activityEthAddress,trxData)
      var {gasUsed, gasPrice} = estimateGas
  
      var ethBalance = await NetworkManager.getEthBalance(activityEthAddress)
  
      var itcErc20Balance = await NetworkManager.getEthERC20Balance(activityEthAddress,defaultTokens[1].address,defaultTokens[1].decimal)
  
      var didMappingValue = await NetworkManager.getEthERC20Balance(destoryAddress,defaultTokens[1].address,defaultTokens[1].decimal)
      
    }
    catch(err){

      console.log('查询错误')
    }

    
    this._hideLoading();

    //测试网络
    // didMappingValue = didMappingValue - 888888

    this.setState({
      gasCost:gasUsed,
      suggestGasPrice:gasPrice,
      ethBalance,
      destoryAddress,
      itcErc20Balance,
      didMappingValue
    })

    if(didMappingValue>=600){
      setTimeout(() => {
        
        this.setState({
          showActivityModalVisible:true
        })
      }, 0.5);
    }
  };

  confirmBtn = async () => {

    this.INPUT.blur();

    if(this.props.gameStart ==  false){

      this._showAlert('活动未开始')
      return;
    }
    
    const {activityEthAddress, activityItcAddress} = this.props
    const {gasCost, mappingValue, ethBalance, itcErc20Balance, destoryAddress, didMappingValue} = this.state;

    let value = parseFloat(mappingValue)

    if(isNaN(value) || value < (600 - didMappingValue)){

      this._showAlert(I18n.t('activity.mapping.limit')+(600-didMappingValue)+'ITC')
      return
    }


    if (ethBalance < parseFloat(gasCost)) {
      this._showAlert(I18n.t('exchange.insufficient_service_fee'));
      return;
    }

    if (itcErc20Balance < value) {
      // 余额不够
      this._showAlert(I18n.t('exchange.insufficient_balance'));
      return;
    }

    this._showLoading()
    
    let trxData = await NetworkManager.generalSendERC20TokenTrxData(defaultTokens[1].address,destoryAddress,value)
    let trxInfo = await NetworkManager.getTransactionEstimateGas(activityEthAddress,trxData)
    
    this._hideLoading()

    this.setState({
      trxData:trxData,
      isShowMappingDetail: true,
      gasCost:trxInfo.gasUsed,
      suggestGasPrice:trxInfo.gasPrice,
    });
  };

  warnBtn = () => {
    const isShow = this.state.isShowPrompt;
    this.setState({
      isShowPrompt: !isShow,
    });
  };

  onAmountChangeText = text => {
    
    this.setState({
      defaultInputAmount: text,
      mappingValue:text
    });
  };

  modalCancelBtn = () => {
    this.setState({
      isShowMappingDetail: false,
    });
  };

  getPriKey = async password => {

    let {activityEthAddress} =  this.props

    try {
      return await KeystoreUtils.getPrivateKey(
        password,
        activityEthAddress,
        'eth'
      );
    } catch (err) {
      this._showAlert('check privateKey error')
      return null;
    }
  };


  modalConfirmBtn = (password)=>{

    this.setState({
      isShowMappingDetail: false,
    },async ()=>{

      if (password === '' || password === undefined) {
        this._showAlert(I18n.t('toast.enter_password'))
      } else {
        this.timeIntervalCount = 0;
        this.timeInterval = setInterval(() => {
          this.timeIntervalCount = this.timeIntervalCount + 1;
          this.changeLoading(this.timeIntervalCount, password);
        }, 500);
      }
    })
}

hideStaticLoading() {
  this.setState({
    isShowSLoading: false,
    sLoadingContent: '',
  });
}

changeLoading(num, password) {
  let content = '';
  if (num === 1) {
    content = I18n.t('settings.verifying_password');
  } else if (num === 2) {
    content = I18n.t('settings.decrypting_keystore');
  }
  this.setState({
    isShowSLoading: true,
    sLoadingContent: content,
  });
  const n = 2;
  if (num === n) {
    clearInterval(this.timeInterval);
    setTimeout(() => {
      this.handleTrx(password);
    }, 0);
  }
}

handleTrx = async (password) => {

  const priKey = await this.getPriKey(password);
  if (priKey == null) {
    this.hideStaticLoading()
    this._showAlert(I18n.t('toast.password_error'))
  } else {
    const {trxData, gasCost, destoryAddress, mappingValue} = this.state;

    NetworkManager.sendETHTrx(priKey,trxData,(hash)=>{
      
      this.hideStaticLoading()

      const {activityEthAddress} = this.props
      let value = parseFloat(mappingValue)

      this.props.navigation.navigate('MappingTxPending',{
        amount:value, 
        fromAddress:activityEthAddress,
        toAddress:destoryAddress,
        gasPrice:gasCost,
        txHash:hash
      })
    })
  }
}


  didTapModalLeftPress = ()=>{

    this.setState({
      showActivityModalVisible:false
    },()=>{
      
    })

    this.props.navigation.goBack();
  }

  didTapModalRightPress = ()=>{
    
    this.setState({
      showActivityModalVisible:false
    },async ()=>{

      // this._showLoading()

      let {activityEthAddress, activityItcAddress} = this.props

    //调用接口激活映射任务
    let taskResult = await NetworkManager.completeMappingTask({
      eth:activityEthAddress,
      itc:activityItcAddress
    });

    if(taskResult.code == 200){

      let nodeInfo = await NetworkManager.queryNodeInfo({
        address:this.props.activityEthAddress
      });
  
      this._hideLoading();
      if(nodeInfo.data){
        this.props.navigation.navigate('NodeSummary',{
          nodeData:nodeInfo.data
        })
      }
      else{
        this.props.navigation.goBack();
      }
    }
    else{
      this._hideLoading();
      this.props.navigation.goBack();
    }
    })
  }
  renderComponent = () => {
    const {activityEthAddress, activityItcAddress} = this.props
    const {showActivityModalVisible, didMappingValue, gasCost, itcErc20Balance, mappingValue, isShowMappingDetail, suggestGasPrice, defaultInputAmount} = this.state;
    const topImg = require('../../../assets/mapping/mappingService.png');
    return (
      <View
        style={styles.container}
        onResponderGrant={() => {
          Keyboard.dismiss();
        }}
      >
        <WhiteBgHeader
          navigation={this.props.navigation}
          text={I18n.t('mapping.itc_mapping_service')}
        />

          <KeyboardAvoidingView
            style={styles.keyboardAwareScrollView}
            keyboardShouldPersistTaps="handled"
            behavior="padding"
            keyboardVerticalOffset={-StatusBarHeight}
          >
          <ConfirmMappingModal
            visible={isShowMappingDetail}
            amount={mappingValue}
            payAddress={activityEthAddress}
            receiveAddress={activityItcAddress}
            ethAmount={gasCost}
            gasPrice={suggestGasPrice/Math.pow(10,9)}
            pwdInputChangeText={this.pwdInputChangeText}
            modalCancelBtn={this.modalCancelBtn}
            modalConfirmBtn={this.modalConfirmBtn}
          />
          <ImageBackground style={styles.topImg} source={topImg} resizeMode="center">
          </ImageBackground>
          <View style={styles.mAddressBox}>
            <View style={styles.mAddressContent}>
              <Text style={styles.mAddressTitle}>
                {I18n.t('mapping.native_itc_receive_address')}
              </Text>
              <Text style={styles.mAddressText}>{activityItcAddress}</Text>
            </View>
          </View>
          <View style={styles.mapContainView}>
            <Text style={styles.mAmountTitle}>{I18n.t('mapping.map_amount')}</Text>
            <Text style={styles.mappingShow}>{didMappingValue+'/600 ITC'}</Text>
          </View>
          <View style={styles.mAmountInputView}>
            <TextInput
              style={[styles.mAmountInput]}
              ref={textinput => {
                this.INPUT = textinput;
              }}
              placeholderTextColor={Colors.fontGrayColor_a0}
              placeholder=""
              value={defaultInputAmount}
              underlineColorAndroid="transparent"
              selectionColor="#00bfff"
              multiline={false}
              returnKeyType="done"
              keyboardType="numeric"
              onChangeText={this.onAmountChangeText}
            />
            <Text style={styles.unit}>ITC</Text>
          </View>
          <View style={styles.vLine} />
          <View style={styles.initiationAddressBox}>
            <View style={styles.initiationAddressContent}>
              <Text style={styles.initiationAddressText}>
                {I18n.t('mapping.initiation_address')}
              </Text>
              <View style={styles.promptBox}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.promptTouch}
                  onPress={this.warnBtn}
                >
                  <Image
                    style={styles.promptIcon}
                    source={require('../../../assets/mapping/sighIcon.png')}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {this.state.isShowPrompt ? (
                  <Image
                    style={styles.triangleIcon}
                    source={require('../../../assets/common/up_triangle.png')}
                    resizeMode="contain"
                  />
                ) : null}
              </View>
              <Text style={styles.convertEthWalletItcBalance}>{I18n.t('transaction.balance') + ': ' + itcErc20Balance+' ITC'}</Text>
            </View>
            <Text style={styles.commonText}>{activityEthAddress}</Text>
            <Text style={styles.commonText}>{`Gas${I18n.t('mapping.cost')}:${gasCost} eth`}</Text>

            {this.state.isShowPrompt ? (
              <View style={styles.promptDescView}>
                <Text style={styles.promptDesc}>{I18n.t('mapping.initiation_address_prompt')}</Text>
              </View>
            ) : null}
          </View>

          <BlueButtonBig
            buttonStyle={styles.btn}
            isDisabled={mappingValue == '' || isNaN(parseFloat(mappingValue))}
            onPress={this.confirmBtn}
            text={I18n.t('mapping.confirm_mapping')}
          />
          <MyAlertComponent
            visible={showActivityModalVisible}
            title={''}
            contents={[I18n.t('activity.mapping.condition')]}
            leftBtnTxt={I18n.t('activity.mapping.other')}
            rightBtnTxt={I18n.t('activity.mapping.sure')}
            leftPress={this.didTapModalLeftPress}
            rightPress={this.didTapModalRightPress}
          />
          <StaticLoading visible={this.state.isShowSLoading} content={this.state.sLoadingContent} />
        </KeyboardAvoidingView>
      </View>
    );
  };
}

class ConfirmMappingModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmBtnIsDisabled: true,
    };
    this.inputPwd = '';
  }

  toInputPwd = () => {
    this.SCROLL.scrollTo({ x: Layout.WINDOW_WIDTH, y: 0, animated: true });
  };

  toMappingDetail = () => {
    this.SCROLL.scrollTo({ x: 0, y: 0, animated: true });
  };

  pwdInputChangeText = text => {
    this.inputPwd = text;
    const isDisabled = !!(text === '' || text.length < 8);
    this.setState({
      confirmBtnIsDisabled: isDisabled,
    });
  };

  confirmBtn = () => {
    const { modalConfirmBtn } = this.props;
    modalConfirmBtn(this.inputPwd);
  };

  render() {
    const {
      amount,
      payAddress,
      ethAmount,
      gasPrice,
      visible,
      receiveAddress,
      modalCancelBtn,
    } = this.props;
    const { confirmBtnIsDisabled } = this.state;
    const amountInfo = `${amount} ITC`;
    const ethAmountInfo = `${ethAmount}ether`;
    const gasAmountInfo = `= GasLimt(${
      TransferGasLimit.tokenGasLimit
    })*Gas price(${gasPrice} gwei)`;

    return (
      <Modal
        onStartShouldSetResponder={() => false}
        animationType="none"
        transparent
        visible={visible}
        onRequestClose={() => console.log('close')}
        onShow={() => console.log('show')}
      >
        <View style={styles.modalBox}>
          <View style={styles.modalContent}>
            <KeyboardAvoidingView
              style={styles.modalKeyboardContainer}
              keyboardShouldPersistTaps="handled"
              behavior="padding"
            >
              <ScrollView
                ref={scroll => {
                  this.SCROLL = scroll;
                }}
                style={styles.modalScrollView}
                keyboardShouldPersistTaps="handled"
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                bounces={false}
                behavior="padding"
              >
                <View style={styles.mDetailBox}>
                  <View style={styles.mVLine} />
                  <View style={styles.mTitleView}>
                    <Text style={styles.mDetailTitle}>{I18n.t('mapping.mapping_detail')}</Text>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={styles.mDetailCancelBtn}
                      onPress={modalCancelBtn}
                    >
                      <Image
                        style={styles.mDetailCancelIcon}
                        source={require('../../../assets/common/cancel.png')}
                        resizeMode="center"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.mVLine} />
                  <Text style={styles.mDetailAmount}>{amountInfo}</Text>
                  <View style={styles.mDetailItemView}>
                    <Text style={styles.mDetailItemTitle}>{I18n.t('mapping.ratio')}</Text>
                    <Text style={[styles.mDetailItemDesc, styles.mDetailItemBlack]}>1 : 1</Text>
                  </View>
                  <View style={styles.mItenLine} />
                  <View style={styles.mDetailItemView}>
                    <Text style={styles.mDetailItemTitle}>
                      {I18n.t('mapping.initiation_address')}
                    </Text>
                    <Text style={[styles.mDetailItemDesc, styles.mDetailItemBlack]}>
                      {payAddress}
                    </Text>
                  </View>
                  <View style={styles.mItenLine} />
                  <View style={styles.mDetailItemView}>
                    <Text style={styles.mDetailItemTitle}>
                      {I18n.t('mapping.native_itc_receive_address')}
                    </Text>
                    <Text style={[styles.mDetailItemDesc, styles.mDetailItemBlack]}>
                      {receiveAddress}
                    </Text>
                  </View>
                  <View style={styles.mItenLine} />
                  <View style={styles.mDetailItemView}>
                    <Text style={styles.mDetailItemTitle}>{I18n.t('transaction.miner_cost')}</Text>
                    <View style={styles.mDetailItemDesc}>
                      <Text style={styles.mDetailItemBlack}>{ethAmountInfo}</Text>
                      <Text style={styles.mDetailItemGray}>{gasAmountInfo}</Text>
                    </View>
                  </View>
                  <View style={styles.modalConfirmBtnView}>
                    <BlueButtonBig
                      buttonStyle={styles.modalNextBtn}
                      onPress={this.toInputPwd}
                      text={I18n.t('mapping.next')}
                    />
                  </View>
                </View>

                <View style={styles.mPwdBox}>
                  <View style={styles.mVLine} />
                  <View style={styles.mTitleView}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={styles.mPwdBackBtn}
                      onPress={this.toMappingDetail}
                    >
                      <Image
                        style={styles.mPwdBackIcon}
                        source={require('../../../assets/common/common_back.png')}
                        resizeMode="center"
                      />
                    </TouchableOpacity>
                    <Text style={styles.mPwdTitle}>{I18n.t('transaction.wallet_password')}</Text>
                  </View>
                  {/* <View style={styles.mPwdContentBox}> */}
                  <TextInput
                    style={styles.mPwdInput}
                    returnKeyType="done"
                    placeholderTextColor={Colors.fontGrayColor_a0}
                    placeholder={I18n.t('transaction.enter_password_hint')}
                    underlineColorAndroid="transparent"
                    selectionColor="#00bfff"
                    multiline={false}
                    secureTextEntry
                    onChangeText={this.pwdInputChangeText}
                  />
                  {/* </View> */}
                  <View style={styles.modalConfirmBtnView}>
                    <BlueButtonBig
                      buttonStyle={styles.modalConfirmBtn}
                      onPress={this.confirmBtn}
                      isDisabled={confirmBtnIsDisabled}
                      text={I18n.t('modal.confirm')}
                    />
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  activityEthAddress : state.Core.activityEthAddress,
  activityItcAddress : state.Core.activityItcAddress,
  gameStart:state.Core.gameStart
});
const mapDispatchToProps = dispatch => ({

});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ITCActivityMapping);
