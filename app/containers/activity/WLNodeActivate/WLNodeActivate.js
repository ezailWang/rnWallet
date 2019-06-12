/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image,StatusBar } from 'react-native';
import NavHeader from '../../../components/NavHeader';
import ImageButton from '../../../components/ImageButton';
import BaseComponent from '../../base/BaseComponent';
import KeystoreUtils from '../../../utils/KeystoreUtils';
import StaticLoading from '../../../components/StaticLoading';
import { I18n } from '../../../config/language/i18n';
import { defaultTokens, contractInfo} from '../../../utils/Constants';
import { connect } from 'react-redux';
import { showToast } from '../../../utils/Toast';
import NetworkManager from '../../../utils/NetworkManager';
import ActivityTrxComfirm from './ActivityTrxComfirm';
import Layout from '../../../config/LayoutConstants';
import { async } from 'rxjs/internal/scheduler/async';

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  editor: {
    flex: 1,
    marginTop: 10,
    padding: 20,
    backgroundColor: 'white',
  },
  img: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },
  imgDesc: {
    flexDirection: 'row',
    width: 205,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  title: {
    fontSize: 15,
    // fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    fontSize: 15,
    // fontWeight: 'bold',
    marginTop: 10,
    paddingVertical: 12,
    width:Layout.WINDOW_WIDTH - 80
  },
  desc: {
    padding: 5,
    backgroundColor: '#f7fcff',
    marginBottom: 25,
    borderTopWidth: 0.5,
    borderColor: '#005ab2',
  },
  descItem: {
    color: '#999C9D',
    fontSize: 12,
    padding: 2,
  },
  descItemWeight: {
    color: '#4E9BF4',
    fontSize: 12,
    padding: 2,
  },
  button: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 15,
  },
};


class WLNodeActivate extends BaseComponent {


  constructor(){
    super()

    this.state = {
      showActivityTrxView:false,
      originalInviteAddress:'',
      newInviteAddress:'',
      defaultAddress:'',
      isShowSLoading: false,
      sLoadingContent: '',
      totalGasUser:'',
      detailGas:'',
    }
  }

  didTapScanButton = ()=>{
    const _this = this;
    this.props.navigation.navigate('ScanQRCode',{
      callback(data) {
        const address = data.toAddress;
        _this.changeInviteAddress(address);
      },
    })
  }
  

  changeInviteAddress = (text)=>{

    this.setState({
      newInviteAddress:text,
      defaultAddress:text
    })
  }

  didTapDefaultAddress = ()=>{

    let {originalInviteAddress} = this.state
    if(originalInviteAddress.length == 0){

      let {rootAddress} = this.props
      this.setState({
        defaultAddress:rootAddress,
        newInviteAddress:rootAddress
      })
    }
  }

  _initData = ()=>{

    let { inviteAddress } = this.props.navigation.state.params;
    this.setState({
      originalInviteAddress:inviteAddress
    })

    if(inviteAddress.length != 0){
      this.setState({
        newInviteAddress:inviteAddress
      })
    }
  }

  didTapAvtivityBtn = async ()=>{

    let {newInviteAddress, originalInviteAddress} = this.state
    let {activityEthAddress} = this.props

    this._showLoading()

    if(NetworkManager.isValidAddress(newInviteAddress) == false){

      showToast(I18n.t('activity.nodeVote.format_err'))
      return
    }

    this._hideLoading()

    this.showPayView()
  }

  didTapCancelPayBtn = ()=>{

    this.setState({
      showActivityTrxView:false
    })
  }

  showPayView = async ()=>{

    let {activeAddress, activityEthAddress} = this.props  

    let transferValue = 15

    let trxData = NetworkManager.generalSendERC20TokenTrxData(defaultTokens[1].address,activeAddress,transferValue)
      
    NetworkManager.getTransactionEstimateGas(activityEthAddress,trxData).then(async res=>{
     
      let addressBalance = await NetworkManager.getEthBalance(activityEthAddress)

      this._hideLoading()

      if(addressBalance<res.gasUsed){

        showToast(I18n.t('activity.nodeVote.no_gas'))
        return
      }
      
      let detailGas = `Gas(${res.gas})*Gas Price(${parseInt(res.gasPrice)/Math.pow(10,9)} gwei) `

      this.setState({
        trxData:res.trx,
        estimateGas:res.gasUsed.toFixed(6),
        showActivityTrxView:true,
        inputAmount:transferValue,
        payAddress:activityEthAddress,
        totalGasUsed:res.gasUsed.toFixed(6)+' ETH',
        detailGas:detailGas
      })
    })
  }


didTapSurePasswordBtn = (password)=>{

    let {newInviteAddress, originalInviteAddress} = this.state
    let {activityEthAddress} = this.props


    this.setState({
      showActivityTrxView:false,
    },async ()=>{

      try{

        //判断如果需要绑定地址，则先绑定邀请地址，成功后调用showPayView，失败则显示错误原因
        if(originalInviteAddress.length == 0){

          // this._showLoading()

          let result = await NetworkManager.bindActivityInviteAddress({
            inviter:newInviteAddress,
            invitee:activityEthAddress
          })

          // this._hideLoading()

          if(result.code == 200){
            //更新状态
            this.setState({
              originalInviteAddress:newInviteAddress
            },()=>{
              this.showParesePrivateView(password)    
            })
          }
          else{
            this._showAlert(I18n.t('activity.nodeVote.act_failed'))
          }
        }
        else{
          this.showParesePrivateView(password)
        }
      }
      catch(err){

        this._hideLoading()
      }
    })
}

showParesePrivateView = (password)=>{


    if (password === '' || password === undefined) {
      showToast(I18n.t('toast.enter_password'));
    } else {
      this.timeIntervalCount = 0;
      this.timeInterval = setInterval(() => {
        this.timeIntervalCount = this.timeIntervalCount + 1;
        this.changeLoading(this.timeIntervalCount, password);
      }, 500);
    }
}

_onBackPressed = ()=>{
  this.props.navigation.goBack();
  return true
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
  
  let {activityEthAddress} = this.props

  try {
    var privateKey = await KeystoreUtils.getPrivateKey(password, activityEthAddress, 'eth');
    console.log('privateKey'+privateKey)
    if (privateKey == null) {
      this.hideStaticLoading(); // 关闭Loading
      showToast(I18n.t('modal.password_error'));
    }
    else{
      // console.log('开始发送交易'+privateKey+this.state.trxData)
      NetworkManager.sendETHTrx(privateKey,this.state.trxData, hash=>{
        this.hideStaticLoading(); // 关闭Loading
        console.log('txHash'+hash)
        if(hash){

          const {activeAddress, estimateGas} = this.props

          let {key,params} = this.props.navigation.state

          this.props.navigation.navigate('ActivityTrxPending',{
            amount:15, 
            fromAddress:activityEthAddress,
            toAddress:activeAddress,
            gasPrice:estimateGas,
            txHash:hash,
            goBackKey:key,
            refreshCall:params.callback
          })
        }
        else{
          
          this._showAlert(I18n.t('activity.nodeVote.act_failed'))
        }
      })
    }
  }
  catch(err){
    showToast(err);
    this.hideStaticLoading(); // 关闭Loading
  }
}

hideStaticLoading() {
  this.setState({
    isShowSLoading: false,
    sLoadingContent: '',
  });
}

  componentWillMount() {
    super.componentWillMount()
    this._isMounted=true
  }
  componentWillUnmount(){
    super.componentWillUnmount()
  }

  renderComponent = ()=>{
    const { navigation } = this.props;
    const {defaultAddress, originalInviteAddress, newInviteAddress, showActivityTrxView,payAddress,totalGasUsed,detailGas} = this.state

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text={I18n.t('activity.nodeVote.act_title')} />
        <View style={styles.editor}>
          <View style={styles.img}>
            <Image source={require('./images/levelUP15.png')} />
            <View style={styles.imgDesc}>
              <Text>{I18n.t('activity.nodeVote.normal_node')}</Text>
              <Text>{I18n.t('activity.nodeVote.act_node')}</Text>
            </View>
          </View>
          <Text style={styles.title}>{I18n.t('activity.nodeVote.invite_address')}</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} onCh placeholder={I18n.t('activity.nodeVote.explain_2')}
              onChangeText={this.changeInviteAddress}
              defaultValue={originalInviteAddress.length == 0? defaultAddress : originalInviteAddress}
              editable={originalInviteAddress.length==0}
            >
            </TextInput>
            <ImageButton
              btnStyle={{
                marginTop:5, width: 20, height: 20
              }}
              imageStyle={{ width: 20, height: 20}}
              onClick={this.didTapScanButton}
              backgroundImageSource={require('./images/saomiao.png')}
            />
            {/* <Image source={require('./images/saomiao.png')} style={{marginTop:5, width: 20, height: 20 }} /> */}
          </View>
          <View style={styles.desc}>
            <Text style={styles.descItem}>{I18n.t('activity.nodeVote.explain_3')}</Text>
            <View style={{flexDirection:'row'}}>
              <Text style={styles.descItem}>
                {I18n.t('activity.nodeVote.explain_4')}
              </Text>
              <TouchableOpacity onPress={this.didTapDefaultAddress}>
                <Text style={styles.descItemWeight}>{I18n.t('activity.nodeVote.explain_5')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={this.didTapAvtivityBtn} style={[styles.button, { backgroundColor: '#46b6fe' }]}>
            <Text style={{ color: 'white' }}>{I18n.t('activity.nodeVote.act_title')}</Text>
          </TouchableOpacity>
          <ActivityTrxComfirm
            show={showActivityTrxView}
            didTapSurePasswordBtn={this.didTapSurePasswordBtn}
            amount={'15'}
            inviteAddress={newInviteAddress}
            fromAddress={payAddress}
            totalGasUsed={totalGasUsed}
            detailGas={detailGas}
            onCancelClick={this.didTapCancelPayBtn}
          />
          <StaticLoading visible={this.state.isShowSLoading} content={this.state.sLoadingContent} />
        </View>
      </View>
    );
  }
}


const mapStateToProps = state => ({
  activityEthAddress : state.Core.activityEthAddress,
  activeAddress:state.Core.activeAddress,
  rootAddress:state.Core.rootAddress
});
export default connect(
  mapStateToProps,
)(WLNodeActivate);
