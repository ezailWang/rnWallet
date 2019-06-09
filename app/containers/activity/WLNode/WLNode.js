/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, StatusBar } from 'react-native';
import NodeItem from './components/NodeItem';
import HeaderBackButton from '../../../components/HeaderBackButton';
import NavHeader from '../../../components/NavHeader';
import LayoutConstants from '../../../config/LayoutConstants';
import BaseComponent from '../../base/BaseComponent';
import NetworkManager from '../../../utils/NetworkManager';
import { showToast } from '../../../utils/Toast';

const { height } = Dimensions.get('window');
export default class WLNode extends BaseComponent {

  constructor(){
    super()
    this.state = {
      nodeList:[]
    }
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#00a8f3',
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
    headerBackImage: <HeaderBackButton />,
  };

  _initData = async () => {
    this._showLoading()
                
    try {
      var result = await NetworkManager.querySuperNodeList();
    } catch (e) {
      this._hideLoading();  
      showToast('query avtivity info error', 30);
    }

    this._hideLoading();

    if(result && Number(result.code) == 200){

      let nodeArr = []

      result.data.map((value,idx)=>{

        nodeArr.push({
          ...value,
          idx:idx,
          rank:'No.'+value.rank,
          amount:value.pledge+value.voteAmount
        })
      })

      this.setState({
        nodeList:nodeArr
      })
    }

  };

  selectNode = (idx)=>{

    let selNode = this.state.nodeList[idx]

    this.props.navigation.navigate('WLVote',{
      nodeInfo:{
        ...selNode
      }
    })
  }

  render() {
    const { navigation } = this.props;
    const {nodeList} = this.state;
    
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <NavHeader navigation={navigation} color="transparent" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>选择节点</Text>
          <Text style={styles.headerSubTitle}>选择一个节点，使用ITC进行投票</Text>
        </View>
        <View style={styles.nodeList}>
          <ScrollView>
            {nodeList.map(item => (
              <NodeItem idx={item.idx} key={item.vipNo} no={item.rank} address={item.address} count={item.amount} onPress={this.selectNode}/>
            ))}
            <View style={{'height':20}}></View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    // flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#00a8f3',
    paddingHorizontal: 30,
    paddingBottom: 50,
    height: LayoutConstants.DEVICE_IS_IPHONE_X() ? 200 : 180,
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: LayoutConstants.DEVICE_IS_ANDROID() ? 60 : 70,
  },
  headerSubTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
  nodeList: {
    marginTop: -30,
    backgroundColor: 'transparent',
    height: height - 100 - 30,
  },
};
