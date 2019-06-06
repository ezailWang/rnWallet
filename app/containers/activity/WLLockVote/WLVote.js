/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TextInput,StatusBar } from 'react-native';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import NetworkManager from '../../../utils/NetworkManager';
import { defaultTokens, contractInfo} from '../../../utils/Constants';
import { connect } from 'react-redux';
import { showToast } from '../../../utils/Toast';


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
      value:''
    }
  }

  didTapDetailExplainBtn = ()=>{

    this.props.navigation.navigate('WebViewScreen',{
      webType:'1'
    })
  }

  didTapVoteBtn = async ()=>{

    let voteValue = Number(this.state.value)

    if(voteValue<600){

      showToast('投票数量不少于600个ITC',30)
    }
    else if (voteValue > this.state.itcErc20Balance){

      showToast('ITC余额不足',30)
    }
    
    let allowance = await NetworkManager.getAllowance(defaultTokens[1].address,this.props.activityEthAddress,contractInfo.nodeBallot.address)
    //判断授权额度，如果不够则跳转至合约授权界面，否则弹出界面
    if(allowance < voteValue){

      this.props.navigation.navigate('WLAuth',{
        voteValue
      })
    }
    else{

    }
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

  render() {
    const { navigation, activityEthAddress} = this.props
    const {itcErc20Balance, currentWallet} = this.state

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