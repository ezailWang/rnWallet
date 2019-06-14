/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image,StatusBar, ScrollView} from 'react-native';
import AddressItem from './components/AddressItem';
import DescItem from './components/DescItem';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import { contractInfo, defaultTokens} from '../../../utils/Constants';
import { connect } from 'react-redux';
import NetworkManager from '../../../utils/NetworkManager'
import { showToast } from '../../../utils/Toast';
import InputPasswordDialog from '../../../components/InputPasswordDialog';
import { I18n } from '../../../config/language/i18n';
import StaticLoading from '../../../components/StaticLoading';
import KeystoreUtils from '../../../utils/KeystoreUtils';
import { async } from 'rxjs/internal/scheduler/async';


const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  transfer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingTop: 35,
    backgroundColor: '#f8f8f8',
  },
  arrow: {
    marginBottom: 80,
  },
  desc: {
    paddingHorizontal: 35,
    paddingVertical: 25,
  },
  text: {
    fontSize: 14,
  },
  numberText: {
    color: '#00b7fe',
    fontWeight: '600',
  },
  button: {
    // position: 'absolute',
    bottom: 20,
    width: '90%',
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 15,
  },
};

class WLAuth extends BaseComponent {

  constructor(){
    super()
    this.state = {
      estimateGas:'0',
      trxData:{},
      passwordModalVisible:false,
      pwdRightBtnDisabled:true,
      password:'',
      isShowSLoading: false,
      sLoadingContent: '',
      showResultModalVisible:false,
      resultContent:''
    }

    this.inputPasswordDialog = React.createRef();

  }


  pwdOnChangeText = text => {
    
    const isDisabled = !!(text === '' || text.length < 8);
    this.setState({
      pwdRightBtnDisabled: isDisabled,
      password:text
    });
  };

  passwordConfirmClick() {
    // var password = this.refs.inputPasswordDialog.state.text;
    const {password} = this.state;
    this.closePasswordModal();
    if (password === '' || password === undefined) {
      this._showAlert(I18n.t('toast.enter_password'))
    } else {
      this.timeIntervalCount = 0;
      this.timeInterval = setInterval(() => {
        this.timeIntervalCount = this.timeIntervalCount + 1;
        this.changeLoading(this.timeIntervalCount, password);
      }, 500);
    }
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

  async handleTrx(password) {
    let privateKey;

    let {activityEthAddress} = this.props

    try {
      privateKey = await KeystoreUtils.getPrivateKey(password, activityEthAddress, 'eth');
      console.log('privateKey'+privateKey)
      if (privateKey == null) {
        this.hideStaticLoading(); // 关闭Loading
        this._showAlert(I18n.t('modal.password_error'))
      }
      else{
        // console.log('开始发送交易'+privateKey+this.state.trxData)
        NetworkManager.sendETHTrx(privateKey,this.state.trxData,hash=>{
          this.hideStaticLoading(); // 关闭Loading
          // console.warn(hash)
          if(hash){
            this.queryTXStatus(hash)
          }
        })
      }
    }
    catch(err){
      this._showAlert(err)
      this.hideStaticLoading(); // 关闭Loading
    }
  }

  queryTXStatus = (hash)=>{

    this._showLoading()

    let time = new Date().valueOf()
    NetworkManager.listenETHTransaction(hash,time,(status)=>{

      this._hideLoading()

      if(status){
        content = I18n.t('activity.auth.success')
      }
      else{
        content = I18n.t('activity.auth.notfound')
      }

      this.props.navigation.state.params.callback();
      this.props.navigation.goBack();
      
      showToast(content,30)
    })
  }

  hideStaticLoading() {
    this.setState({
      isShowSLoading: false,
      sLoadingContent: '',
    });
  }

  closePasswordModal() {
    this.setState({ passwordModalVisible: false });
  }


  componentWillUnmount(){
    super.componentWillUnmount()
  }

  componentWillMount(){
    super.componentWillMount()
    this._isMounted=true
    
  }

  _initData = async () => {

    this._showLoading()

    try {
      const {activityEthAddress, voteContractAddress} = this.props;
      
      const {voteValue} = this.props.navigation.state.params

      let trxData = NetworkManager.generalApproveTrxData(defaultTokens[1].address,voteContractAddress,voteValue)
      
      NetworkManager.getTransactionEstimateGas(activityEthAddress,trxData).then(res=>{
        this.setState({
          trxData:res.trx,
          estimateGas:res.gasUsed.toFixed(6)
        })

        this._hideLoading()
      }).catch(err=>{
        this._hideLoading();  
        this._showAlert(err.toString())
      })

    } catch (e) {
      this._hideLoading();  
      this._showAlert('get transaction estimateGas info error')
    }
  }

  didTapApproveBtn =async ()=>{

    const {activityEthAddress} = this.props;
    const {estimateGas} = this.state

    this._showLoading()

    let addressBalance = await NetworkManager.getEthBalance(activityEthAddress)

    this._hideLoading()

    if(addressBalance<estimateGas){

      this._showAlert(I18n.t('activity.auth.no_gas'))
      return
    }

    this.setState({
      passwordModalVisible:true
    })
  }

  didTapResultSureBtn = ()=>{

  }

  renderComponent = () => {
    
    const { navigation, activityEthAddress, voteContractAddress} = this.props;
    const {estimateGas, resultContent, showResultModalVisible} = this.state
    const {voteValue} = this.props.navigation.state.params
  
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text={I18n.t('activity.auth.approve')} />
        <View style={styles.transfer}>
          <AddressItem
            icon={<Image source={require('./images/qianbaodizhi.png')} />}
            title={I18n.t('activity.auth.address')}
            address={activityEthAddress}
          />
          <Image source={require('./images/bangding.png')} style={styles.arrow} />
          <AddressItem
            icon={<Image source={require('./images/heyue.png')} />}
            title={I18n.t('activity.auth.contract')}
            address={voteContractAddress}
          />
        </View>
        <ScrollView 
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          flex={1}
        >
        <View style={styles.desc}>
          <DescItem
            text={
              <Text style={styles.text}>
                {I18n.t('activity.auth.explain')}
              </Text>
            }
          />
          <DescItem
            text={
              <Text style={styles.text}>
                {I18n.t('activity.auth.explain_1')}
              </Text>
            }
          />
          <DescItem
            text={
              <Text style={styles.text}>
                {I18n.t('activity.auth.allwance')}<Text style={styles.numberText}>{voteValue+' ITC'}</Text>
                {I18n.t('activity.auth.allwance_sub')}
              </Text>
            }
          />
          <DescItem
            text={
              <Text style={styles.text}>
                {I18n.t('activity.auth.gas')}<Text style={styles.numberText}>{estimateGas+' ETH'}</Text>
                {I18n.t('activity.auth.gas_sub')}
              </Text>
            }
          />
        </View>

        <TouchableOpacity onPress={this.didTapApproveBtn} style={[styles.button,{ backgroundColor: '#01a1f1' }]}>
          <Text style={{ color: 'white' }}>{I18n.t('activity.auth.makesure')}</Text>
        </TouchableOpacity>
        <StaticLoading visible={this.state.isShowSLoading} content={this.state.sLoadingContent} />
        <InputPasswordDialog
          ref={this.inputPasswordDialog}
          placeholder={I18n.t('settings.enter_passowrd_hint')}
          leftTxt={I18n.t('modal.cancel')}
          rightTxt={I18n.t('modal.confirm')}
          leftPress={() => this.closePasswordModal()}
          rightPress={() => this.passwordConfirmClick()}
          modalVisible={this.state.passwordModalVisible}
          rightBtnDisabled={this.state.pwdRightBtnDisabled}
          onChangeText={this.pwdOnChangeText}
        />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  activityEthAddress : state.Core.activityEthAddress,
  voteContractAddress : state.Core.voteContractAddress
});
export default connect(
  mapStateToProps,
)(WLAuth);
