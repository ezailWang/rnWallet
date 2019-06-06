/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TextInput,StatusBar } from 'react-native';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import NetworkManager from '../../../utils/NetworkManager';
import { defaultTokens, contractInfo} from '../../../utils/Constants';
import { connect } from 'react-redux';
import { showToast } from '../../../utils/Toast';
import VoteTrxComfirm from './VoteTrxComfirm'
import MyAlertComponent from '../../../components/MyAlertComponent';
import KeystoreUtils from '../../../utils/KeystoreUtils';
import StaticLoading from '../../../components/StaticLoading';
import { I18n } from '../../../config/language/i18n';

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
    fontSize: 20,
    // fontWeight: 'bold',
    marginTop: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#959595',
  },
  desc: {
    padding: 10,
    backgroundColor: '#f8fbff',
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
  },
  button: {
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 15,
  },
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
      webType:'1'
    })
  }

  didTapVoteBtn = async ()=>{

    let voteValue = Number(this.state.value)

    if(voteValue<600 || isNaN(voteValue)){

      showToast('投票数量不少于600个ITC',30)
    }
    else if (voteValue > this.state.itcErc20Balance){

      showToast('ITC余额不足',30)
    }
    else{

      let allowance = await NetworkManager.getAllowance(defaultTokens[1].address,this.props.activityEthAddress,contractInfo.nodeBallot.address)
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

  showPayView = async ()=>{

    let { nodeInfo } = this.props.navigation.state.params;
    let address = nodeInfo.address
    let voteValue = parseFloat(this.state.value)
    let {activityEthAddress} = this.props    

    this._showLoading()

    //测试超级节点地址
    address = '0x19cc9D7CdD78248c8a141D8968397754ce24797d'

    let trxData = NetworkManager.generalVoteTrxData(contractInfo.nodeBallot.address,address,voteValue)
      
    NetworkManager.getTransactionEstimateGas(activityEthAddress,trxData).then(res=>{
     
      this._hideLoading()

      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      
      let detailGas = `Gas(${res.gas})*Gas Price(${parseInt(res.gasPrice)/Math.pow(10,9)} gwei) `

      this.setState({
        trxData:res.trx,
        estimateGas:res.gasUsed.toFixed(6),
        isShowVoteTrx:true,
        inputAmount:voteValue,
        payAddress:activityEthAddress,
        lockDate:year+':'+month+':'+day,
        nodeNumber:nodeInfo.rank,
        amount:voteValue,
        totalGasUsed:res.gasUsed.toFixed(6)+' ETH',
        detailGas:detailGas
      })
    })
  }

  didTapSurePasswordBtn = (password)=>{

    this.setState({
      isShowVoteTrx:false,
    },async ()=>{

      if (password === '' || password === undefined) {
        showToast(I18n.t('toast.enter_password'));
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
    console.log('privateKey'+privateKey)
    if (privateKey == null) {
      this.hideStaticLoading(); // 关闭Loading
      showToast(I18n.t('modal.password_error'));
    }
    else{
      console.log('开始发送交易'+privateKey+this.state.trxData)
      NetworkManager.sendETHTrx(privateKey,this.state.trxData,hash=>{
        this.hideStaticLoading(); // 关闭Loading
        console.log('txHash'+hash)
        if(hash){
          this.queryTXStatus(hash)
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

queryTXStatus = (hash)=>{

  this._showLoading()

  let time = new Date().valueOf()
  NetworkManager.listenETHTransaction(hash,time,(status)=>{

    this._hideLoading()

    if(status == 1){
      content = '授权成功'
    }
    else{
      content = '交易正在确认中..'
    }

    showToast(content,30)

    //5秒后查询服务器
    setTimeout(async () => {
      
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
    }, 5 * 1000);
  })
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

    let { nodeInfo } = this.props.navigation.state.params;
    let {rank,amount} = nodeInfo

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text="投票" rightText="详细说明" rightAction={()=>{this.didTapDetailExplainBtn()}}/>
        <View style={styles.editor}>
          <Text style={styles.title}>投票数量</Text>
          <TextInput keyboardType={'number-pad'} style={styles.input} placeholder="600 ITC起，1 ITC递增" placeholderTextColor="#e6e6e6"
            onChangeText={(text) => {
                this.state.value = text
            }}
          >
          </TextInput>
          <View style={styles.desc}>
            <View style={styles.descItem}>
              <Text style={styles.descItemTitle}>锁定期限</Text>
              <Text style={styles.descItemValue}>90天</Text>
            </View>
            <View style={styles.descItem}>
              <Text style={styles.descItemTitle}>对应身份</Text>
              <Text style={styles.descItemValue}>涡轮超级节点</Text>
            </View>
            <View style={styles.descItem}>
              <Text style={styles.descItemTitle}>节点编号</Text>
              <Text style={styles.descItemValue}>{rank}</Text>
            </View>
            <View style={styles.descItem}>
              <Text style={styles.descItemTitle}>总锁仓</Text>
              <Text style={styles.descItemValue}>{amount+' ITC'}</Text>
            </View>
          </View>
          <Text style={styles.title}>支付地址</Text>
          <View style={styles.divider} />

          <View style={styles.payInfo}>
            <View style={{flex:6,marginRight:20}}>
              <Text style={styles.payInfoTitle}>{currentWallet.name}</Text>
              <Text style={styles.payInfoSubTitle}>{currentWallet.address}</Text>
            </View>
            <View style={{flex:4}}>
              <Text style={[styles.payInfoTitle,{alignSelf: 'flex-end'}]}>{itcErc20Balance + ' ITC'}</Text>
              <Text style={[styles.payInfoSubTitle, { alignSelf: 'flex-end' }]}>余额</Text>
            </View>
          </View>
          <TouchableHighlight onPress={this.didTapVoteBtn} style={[styles.button, { backgroundColor: '#01a1f1' }]}>
            <Text style={{ color: 'white' }}>投票</Text>
          </TouchableHighlight>
          <VoteTrxComfirm
            show={isShowVoteTrx}
            didTapSurePasswordBtn={this.didTapSurePasswordBtn}
            amount={inputAmount}
            nodeNumber={nodeNumber}
            lockDate={lockDate}
            lockDay={'90天'}
            fromAddress={payAddress}
            totalGasUsed={totalGasUsed}
            detailGas={detailGas}
            onCancelClick={this.didTapCancelPayBtn}
          />
          <StaticLoading visible={this.state.isShowSLoading} content={this.state.sLoadingContent} />
          <MyAlertComponent
            visible={showApproveModalVisible}
            title={'提示'}
            contents={['投票数量超出授权额度，请先授权节点合约足够数量的投票额度']}
            leftBtnTxt={'取消'}
            rightBtnTxt={'去授权'}
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
)(WLVote);

// export default WLVote