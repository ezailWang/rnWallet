/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TextInput,StatusBar } from 'react-native';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import NetworkManager from '../../../utils/NetworkManager';
import { defaultTokens} from '../../../utils/Constants';
import { connect } from 'react-redux';
import { showToast } from '../../../utils/Toast';
import VoteTrxComfirm from './VoteTrxComfirm'
import MyAlertComponent from '../../../components/MyAlertComponent';
import KeystoreUtils from '../../../utils/KeystoreUtils';
import StaticLoading from '../../../components/StaticLoading';
import { I18n } from '../../../config/language/i18n';
import LayoutConstants from '../../../config/LayoutConstants';

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
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
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
    backgroundColor: '#959595',
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
    line:1
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

class WLVote extends BaseComponent {

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
      webType:0
    })
  }

  
  _onBackPressed = ()=>{
    console.log('重写安卓返回事件')
    if(this.state.isShowVoteTrx){
      return true;
    }
    else{
      this.props.navigation.goBack();
      return true;
    }
  }

  didTapVoteBtn = async ()=>{
    
    if(this.props.gameStart ==  false){
      this._showAlert(I18n.t('activity.extra.alert_0'))
      return;
    }

    let voteValue = Number(this.state.value)

    if(voteValue<this.props.voteLimit || isNaN(voteValue)){

      this._showAlert(I18n.t('activity.nodeVote.limit_1').replace("%s",this.props.voteLimit))
    }
    else if (voteValue > this.state.itcErc20Balance){

      this._showAlert(I18n.t('activity.nodeVote.no_itc'))
    }
    else{

      let allowance = await NetworkManager.getAllowance(defaultTokens[1].address,this.props.activityEthAddress,this.props.voteContractAddress)
      //判断授权额度，如果不够则跳转至合约授权界面，否则弹出界面
      if(allowance < voteValue){
  
        this.setState({
          showApproveModalVisible:true
        })
      }
      else{
        this.showPayView()
      }
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
    
    let voteValue = parseFloat(this.state.value)
    this.props.navigation.navigate('WLAuth',{
      voteValue,
      callback:async ()=>{
        console.log('一些刷新操作')

        this._showLoading()
        let allowance = await NetworkManager.getAllowance(defaultTokens[1].address,this.props.activityEthAddress,this.props.voteContractAddress)
        //判断授权额度，如果不够则跳转至合约授权界面，否则弹出界面
        this.setState({
          allowance:allowance
        })
        this._hideLoading()

        this._showAlert(I18n.t("activity.extra.approve_vote"))
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

    let { nodeInfo } = this.props.navigation.state.params;
    let address = nodeInfo.address
    let voteValue = parseFloat(this.state.value)
    let {activityEthAddress, voteContractAddress} = this.props    

    this._showLoading()

    try{
      var trxData = NetworkManager.generalVoteTrxData(voteContractAddress,address,voteValue)
    }
    catch(err){
      this._hideLoading()
      showToast(err.toString())
      return
    }
      
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
        inputAmount:voteValue,
        payAddress:activityEthAddress,
        lockDate:lockDate,
        nodeNumber:nodeInfo.rank,
        amount:voteValue,
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
  
  let {activityEthAddress, voteContractAddress} = this.props

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
       
        let voteValue = parseFloat(this.state.value)

        this.props.navigation.navigate('NodeTrxPending',{
          amount:voteValue, 
          fromAddress:activityEthAddress,
          toAddress:voteContractAddress,
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
    this._isMounted=false
  }

  componentDidMount(){
    let {activityEthAddress, ethWalletList, voteContractAddress} = this.props

    ethWalletList.map((wallet,id)=>{
      if(wallet.address == activityEthAddress){
        this.setState({
          currentWallet:wallet
        })
      }
    })

    NetworkManager.getAllowance(defaultTokens[1].address,this.props.activityEthAddress,voteContractAddress).then(allowance=>{
      this.setState({
        allowance:allowance
      })
    })

    // console.warn(this.state.currentWallet)

    this._showLoading()
    //获取余额
    NetworkManager.getEthERC20Balance(
      activityEthAddress,
      defaultTokens[1].address,
      defaultTokens[1].decimal
    ).then(balance=>{

      this.setState({
        itcErc20Balance:balance
      })

      this._hideLoading()

    }).catch(err=>{

    })
  }

  renderComponent = () => {
    const { navigation, activityEthAddress} = this.props
    const {itcErc20Balance, currentWallet, isShowVoteTrx,inputAmount,payAddress,lockDate,nodeNumber,showApproveModalVisible,totalGasUsed,detailGas} = this.state

    let { nodeInfo } = this.props.navigation.state.params;
    let {rank,amount} = nodeInfo

    // let address = activityEthAddress.substr(0,12)+'...'+activityEthAddress.substr(activityEthAddress.length - 12 ,12)

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text={I18n.t('activity.nodeVote.ballot')} rightText={I18n.t('activity.nodeVote.explain_1')} rightAction={()=>{this.didTapDetailExplainBtn()}}/>
        <View style={styles.editor}>
          <Text style={styles.title}>{I18n.t('activity.nodeVote.vote_amount')}</Text>
          <View style={{flexDirection:'row'}}>
            <TextInput keyboardType={'number-pad'}  style={styles.input} placeholder={I18n.t('activity.nodeVote.vote_limit').replace("%s",this.props.voteLimit)} placeholderTextColor="#e6e6e6"
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
              <Text style={styles.descItemTitle}>{I18n.t('activity.nodeVote.lock_limit')}</Text>
              <Text style={styles.descItemValue}>{I18n.t('activity.nodeVote.lock_day')}</Text>
            </View>
            <View style={styles.descItem}>
              <Text style={styles.descItemTitle}>{I18n.t('activity.nodeVote.identify')}</Text>
              <Text style={styles.descItemValue}>{I18n.t('activity.nodeVote.super_node')}</Text>
            </View>
            <View style={styles.descItem}>
              <Text style={styles.descItemTitle}>{I18n.t('activity.nodeVote.node_id')}</Text>
              <Text style={styles.descItemValue}>{rank}</Text>
            </View>
            <View style={styles.descItem}>
              <Text style={styles.descItemTitle}>{I18n.t('activity.nodeVote.lock_total')}</Text>
              <Text style={styles.descItemValue}>{amount+' ITC'}</Text>
            </View>
          </View>
          <Text style={styles.title}>{I18n.t('activity.nodeVote.pay_address')}</Text>
          <View style={styles.divider} />

          <View style={styles.payInfo}>
            <View style={{flex:6,marginRight:20}}>
              <Text style={styles.payInfoTitle}>{currentWallet.name}</Text>
              <Text style={styles.payInfoSubTitle} ellipsizeMode="middle" numberOfLines={1}>{activityEthAddress}</Text>
            </View>
            <View style={{flex:4}}>
              <Text style={[styles.payInfoTitle,{alignSelf: 'flex-end'}]}>{itcErc20Balance + ' ITC'}</Text>
              <Text style={[styles.payInfoSubTitle, { alignSelf: 'flex-end' }]}>{I18n.t('activity.nodeVote.balance')}</Text>
            </View>
          </View>
          <TouchableHighlight onPress={this.didTapVoteBtn} style={[styles.button, { backgroundColor: '#01a1f1' }]}>
            <Text style={{ color: 'white' }}>{I18n.t('activity.nodeVote.ballot')}</Text>
          </TouchableHighlight>
          <VoteTrxComfirm
            show={isShowVoteTrx}
            didTapSurePasswordBtn={this.didTapSurePasswordBtn}
            amount={inputAmount}
            nodeNumber={nodeNumber}
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
  activityEthAddress : state.Core.activityEthAddress,
  voteContractAddress : state.Core.voteContractAddress,
  gameStart:state.Core.gameStart,
  voteLimit:state.Core.voteLimit,
});
export default connect(
  mapStateToProps,
)(WLVote);

// export default WLVote