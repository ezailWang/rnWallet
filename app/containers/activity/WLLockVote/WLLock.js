/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput,StatusBar } from 'react-native';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import NetworkManager from '../../../utils/NetworkManager';
import { defaultTokens, contractInfo} from '../../../utils/Constants';
import { connect } from 'react-redux';
import LockTrxComfirm from './LockTrxComfirm'
import MyAlertComponent from '../../../components/MyAlertComponent';
import KeystoreUtils from '../../../utils/KeystoreUtils';
import StaticLoading from '../../../components/StaticLoading';
import { I18n } from '../../../config/language/i18n';
import LayoutConstants from '../../../config/LayoutConstants';

class WLLock extends BaseComponent {

  constructor(){
    super()

    this.state={
      itcErc20Balance:0,
      currentWallet:{},
      value:'',
      allowance:0,
      isShowVoteTrx:false,
      inputAmount:0,
      payAddress:'',
      lockDate:'',
      nodeNumber:'',
      showApproveModalVisible:false,
      totalGasUser:'',
      detailGas:'',
      trxData:{},
      isShowSLoading: false,
      sLoadingContent: '',
    }
  }

  didTapDetailExplainBtn = ()=>{

    this.props.navigation.navigate('WebViewScreen',{
      webType:3
    })
  }
  
  _onBackPressed = ()=>{
    console.log('重写安卓返回事件')
    return true;
  }

  didTapLockBtn = async ()=>{

    try{

      let nodeLockValue = Number(this.state.value)

      if(nodeLockValue<100000 || isNaN(nodeLockValue)){
  
        this._showAlert(I18n.t('activity.nodeVote.limit'))
      }
      else if (nodeLockValue > this.state.itcErc20Balance){
        this._showAlert(I18n.t('activity.nodeVote.no_itc'))
      }
      else{
  
        try{
          let allowance = await NetworkManager.getAllowance(defaultTokens[1].address,this.props.activityEthAddress,contractInfo.nodeBallot.address)

          // console.log('合约授权额度为->'+allowance)
  
          //判断授权额度，如果不够则跳转至合约授权界面，否则弹出界面
          if(allowance < nodeLockValue){
            
            this.setState({
              showApproveModalVisible:true
            })
          }
          else{
            this.showPayView()
          }
        }
        catch(err){
          this._showAlert(I18n.t('activity.nodeVote.trx_error'))
        } 
      }
    }
    catch(err){
      this._showAlert(I18n.t('activity.nodeVote.limit'))
    }

    
  }

  didTapModalLeftPress = ()=>{

    this.setState({
      showApproveModalVisible:false
    })
  }

  didTapModalRightPress = ()=>{
    
    this.setState({
      showApproveModalVisible:false
    })
    
    let nodeLockValue = parseFloat(this.state.value)
    this.props.navigation.navigate('WLAuth',{
      voteValue:nodeLockValue,
      callback:async ()=>{
        console.log('一些刷新操作')

        this._showLoading()
        let allowance = await NetworkManager.getAllowance(defaultTokens[1].address,this.props.activityEthAddress,contractInfo.nodeBallot.address)
        //判断授权额度，如果不够则跳转至合约授权界面，否则弹出界面
        this.setState({
          allowance:allowance
        })
        this._hideLoading()

      }
    })
  }

  didTapCancelPayBtn = ()=>{

    this.setState({
      isShowVoteTrx:false
    })
  }

  // 时间戳换时间格式
  timestampToDayTime = (timestamp)=>{
    let date;
    if (timestamp.length === 10) {
      date = new Date(parseInt(timestamp, 10) * 1000);
    } else if (timestamp.length === 13) {
      date = new Date(parseInt(timestamp, 10));
    }
    const Y = `${date.getFullYear()}-`;
    const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
    const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${Y + M + D}`;
  }

  showPayView = async ()=>{

    let nodeLockValue = parseFloat(this.state.value)
    let {activityEthAddress} = this.props    

    this._showLoading()

    let trxData = NetworkManager.generalSuperNodeLockTrxData(contractInfo.nodeBallot.address,nodeLockValue)
      
    NetworkManager.getTransactionEstimateGas(activityEthAddress,trxData).then(async res=>{
     
      let addressBalance = await NetworkManager.getEthBalance(activityEthAddress)

      this._hideLoading()

      if(addressBalance<res.gasUsed){

        this._showAlert(I18n.t('activity.nodeVote.no_gas'))
        return
      }
      
      let noewDate = new Date().valueOf();
      let lockDate = this.timestampToDayTime(noewDate.toString())
      
      let detailGas = `Gas(${res.gas})*Gas Price(${parseInt(res.gasPrice)/Math.pow(10,9)} gwei) `

      this.setState({
        trxData:res.trx,
        estimateGas:res.gasUsed.toFixed(6),
        isShowVoteTrx:true,
        inputAmount:nodeLockValue,
        payAddress:activityEthAddress,
        lockDate:lockDate,
        amount:nodeLockValue,
        totalGasUsed:res.gasUsed.toFixed(6)+' ETH',
        detailGas:detailGas
      })
    }).catch(err=>{
      this._hideLoading()
      this._showAlert(I18n.t('activity.nodeVote.trx_error'))
    })
  }

  didTapSurePasswordBtn = (password)=>{

    this.setState({
      isShowVoteTrx:false,
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
    // console.log('privateKey'+privateKey)
    if (privateKey == null) {
      this.hideStaticLoading(); // 关闭Loading
      this._showAlert(I18n.t('modal.password_error'))
    }
    else{
      // console.log('开始发送交易'+privateKey+this.state.trxData)
      NetworkManager.sendETHTrx(privateKey,this.state.trxData,hash=>{
        this.hideStaticLoading(); // 关闭Loading
        console.log('txHash'+hash)
        
        let nodeLockValue = parseFloat(this.state.value)

        this.props.navigation.navigate('NodeTrxPending',{
          amount:nodeLockValue, 
          fromAddress:activityEthAddress,
          toAddress:contractInfo.nodeBallot.address,
          gasPrice:this.state.estimateGas,
          txHash:hash
        })

      })
    }
  }
  catch(err){
    this.hideStaticLoading(); // 关闭Loading
    this._showAlert(err)
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

  componentDidMount(){
    let {activityEthAddress, ethWalletList} = this.props

    ethWalletList.map((wallet,id)=>{
      if(wallet.address == activityEthAddress){
        this.setState({
          currentWallet:wallet
        })
      }
    })

    NetworkManager.getAllowance(defaultTokens[1].address,this.props.activityEthAddress,contractInfo.nodeBallot.address).then(allowance=>{
      this.setState({
        allowance:allowance
      })
    })

    // console.warn(this.state.currentWallet)

    //获取余额
    NetworkManager.getEthERC20Balance(
      activityEthAddress,
      defaultTokens[1].address,
      defaultTokens[1].decimal
    ).then(balance=>{
      this.setState({
        itcErc20Balance:balance
      })
    }).catch(err=>{

    })
  }

  renderComponent = () => {
    
    const { navigation, activityEthAddress} = this.props
    const {itcErc20Balance, currentWallet, isShowVoteTrx,inputAmount,payAddress,lockDate,nodeNumber,showApproveModalVisible,totalGasUsed,detailGas} = this.state

    let address = activityEthAddress.substr(0,12)+'...'+activityEthAddress.substr(activityEthAddress.length - 12 ,12)

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text={I18n.t('activity.nodeVote.node_lock')} rightText={I18n.t('activity.nodeVote.explain_1')} rightAction={()=>{this.didTapDetailExplainBtn()}}/>
        <View style={styles.editor}>
          <Text style={styles.title}>{I18n.t('activity.nodeVote.lock_amount')}</Text>
          <View style={{flexDirection:'row'}}>
            <TextInput keyboardType={'number-pad'}  style={styles.input} placeholder={I18n.t('activity.nodeVote.place')} placeholderTextColor="#e6e6e6"
              onChangeText={(text) => {
                this.state.value = text
              }}
            />
            <Text style={[styles.input,styles.itcUnit]}>
              ITC
            </Text>
          </View>
          <View style={{height: 0.5,backgroundColor: '#e5e5e5'}} />
          <View style={styles.desc}>
            <View style={styles.descItem}>
              <Text style={styles.descItemTitle}>{I18n.t('activity.nodeVote.date')}</Text>
              <Text style={styles.descItemValue}>{I18n.t('activity.nodeVote.lock_day')}</Text>
            </View>
            <View style={styles.descItem}>
              <Text style={styles.descItemTitle}>{I18n.t('activity.nodeVote.identify')} </Text>
              <Text style={styles.descItemValue}>{I18n.t('activity.nodeVote.super_node')} </Text>
            </View>
          </View>
          <Text style={styles.title}>{I18n.t('activity.nodeVote.pay_address')}</Text>
          <View style={styles.divider} />
          <View style={styles.payInfo}>
            <View style={{flex:6,marginRight:20}}>
              <Text style={styles.payInfoTitle}>{currentWallet.name}</Text>
              <Text style={styles.payInfoSubTitle}>{address}</Text>
            </View>
            <View style={{flex:4}}>
              <Text style={[styles.payInfoTitle,{alignSelf: 'flex-end'}]}>{Number(itcErc20Balance) + ' ITC'}</Text>
              <Text style={[styles.payInfoSubTitle, { alignSelf: 'flex-end' }]}>{I18n.t('activity.nodeVote.balance')}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={this.didTapLockBtn} style={[styles.button, { backgroundColor: '#01a1f1' }]}>
            <Text style={{ color: 'white' }}>{I18n.t('activity.nodeVote.lock_t')}</Text>
          </TouchableOpacity>
          <LockTrxComfirm
            show={isShowVoteTrx}
            didTapSurePasswordBtn={this.didTapSurePasswordBtn}
            amount={inputAmount}
            lockDate={lockDate}
            lockDay={I18n.t('activity.nodeVote.lock_day')}
            fromAddress={payAddress}
            totalGasUsed={totalGasUsed}
            detailGas={detailGas}
            onCancelClick={this.didTapCancelPayBtn}
          />
          <StaticLoading visible={this.state.isShowSLoading} content={this.state.sLoadingContent} />
          <MyAlertComponent
            visible={showApproveModalVisible}
            title={''}
            contents={[I18n.t('activity.nodeVote.explain_0')]}
            leftBtnTxt={I18n.t('activity.nodeVote.cancel')}
            rightBtnTxt={I18n.t('activity.nodeVote.approve')}
            leftPress={this.didTapModalLeftPress}
            rightPress={this.didTapModalRightPress}
          />
        </View>
      </View>
    );
  }
}


const mapStateToProps = state => ({
  ethWalletList: state.Core.ethWalletList,
  activityEthAddress : state.Core.activityEthAddress
});
export default connect(
  mapStateToProps,
)(WLLock);

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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000'
    // marginBottom: 10,
  },
  input: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#959595',
    width:LayoutConstants.WINDOW_WIDTH - 40 -50
  },
  desc: {
    padding: 10,
    backgroundColor: '#f7fcff',
    marginBottom: 25,
  },
  descItem: {
    height: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descItemTitle: {
    color: '#acafb0',
    fontSize: 12,
  },
  descItemValue: {
    color: '#666a6b',
    fontSize: 12,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#e5e5e5',
    marginVertical: 20,
  },
  payInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  payInfoTitle: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 3,
  },
  payInfoSubTitle: {
    fontSize: 12,
    color: '#acafb0',
  },
  button: {
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 15,
  },
  itcUnit:{
    textAlign:'right',
    color:'#05b3eb',
    marginRight:20,
    width:40
  }
};
