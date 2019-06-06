/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, Image, ScrollView,StatusBar } from 'react-native';
import NodeInfo from './components/NodeInfo';
import BenefitInfo from './components/BenefitInfo';
import DescView from './components/DescView';
import ChildNodeItem from './components/ChildNodeItem';
import Button from './components/Button';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import NetworkManager from '../../../utils/NetworkManager';
import { showToast } from '../../../utils/Toast';

export default class NodeSummary extends BaseComponent {
  
  _initData = async () => {
   
      let { nodeData } = this.props.navigation.state.params;

      this.setState({
        ...nodeData
      })
  }
  
  componentWillMount() {
    super.componentWillMount()
    this._isMounted=true
  }
  componentWillUnmount(){
    super.componentWillUnmount()
  }

  renderComponent = () => {
    const { navigation } = this.props;
    let { activeRound,address,bonusReward,children,inviteReward,totalReward,treeReward,type,vip,childNum } = this.state;
    let nodeType = '普通节点';
    if (vip){
      nodeType = '超级节点'
    } else{
      switch(type){
        case 'normal':
          nodeType = '普通节点'
          break
        case 'benefit':
          nodeType = '权益节点'
          break
        case 'active':
          nodeType = '激活节点'
          break
      }
    }

    let maxNodeNum = 1;
    if(children){
      children.forEach((item,index) => {
        maxNodeNum = item.nodeNum>maxNodeNum?item.nodeNum:maxNodeNum
      })
    }else{
      children = []
    }

    if(children.length<5){
      const len = children.length
      for(var i=0;i<5-len;i++){
        children.push({
          level: children.length+1,
          nodeNum: 0
        })
      }
    }
    
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text="涡轮计划" />
        <ScrollView>
          <NodeInfo
            icon={<Image source={require('./images/super.png')} />}
            name={nodeType}
            address={address}
            onRankPress={() => {
              navigation.navigate('WebViewScreen',{
                webType:'1'
              })
            }}
            onPoolPress={() => {
              navigation.navigate('WebViewScreen',{
                webType:'2'
              })
            }}
          />
          {
            type=='benefit' || type=='active'?
            <BenefitInfo 
              total={totalReward} 
              forest={type=='active'?'--':bonusReward} 
              cycle={type=='active'?'--':activeRound} 
              invite={inviteReward} 
              source={treeReward}
              onPress={() => {
                navigation.navigate("WLBenefit")
              }} />
            :null
          }

          {/* 超级节点 & 权益节点 */}
          {
            type=='benefit'?
            <View style={styles.extContainer}>
              <View style={styles.extHeader}>
                <Image source={require('./images/ziJD.png')} />
                <Text style={styles.headerText}>我的子节点</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.childNodeList}>
                {children.map(item => (
                  <ChildNodeItem key={item.level} no={'L'+item.level} value={item.nodeNum} total={maxNodeNum} />
                ))}
              </View>
              <Button text="拓展子节点" />
            </View>
            :null
          }

          {/* 激活节点 */}
          {
            type=='active'?
            <View style={styles.extContainer}>
              <View style={styles.extHeader}>
                <Image source={require('./images/backdate-l.png')} />
                <Text style={styles.headerText}>升级成为权益节点</Text>
              </View>
              <View style={styles.divider} />
              <Image source={require('./images/up5L1.png')} />
              <View style={styles.activeLabel}>
                <Text>激活节点</Text>
                <Text>权益节点</Text>
              </View>
              <DescView
                descArr={[
                  '激活节点的第一层5个节点充满后，激活节点成为权益节点',
                  '权益节点可参与森林收益、溯源收益、邀请收益',
                ]}
              />
              {
                childNum===0?<Image source={require("./images/zt0.png")} style={{ marginVertical: 15 }} />:null
              }
              {
                childNum===1?<Image source={require("./images/zt1.png")} style={{ marginVertical: 15 }} />:null
              }
              {
                childNum===2?<Image source={require("./images/zt2.png")} style={{ marginVertical: 15 }} />:null
              }
              {
                childNum===3?<Image source={require("./images/zt3.png")} style={{ marginVertical: 15 }} />:null
              }
              {
                childNum===4?<Image source={require("./images/zt4.png")} style={{ marginVertical: 15 }} />:null
              }
              {
                childNum>=5?<Image source={require("./images/zt5.png")} style={{ marginVertical: 15 }} />:null
              }
              <Button text="拓展子节点" />
            </View>
            :null
          }
          
          {/* 普通节点 */}
          {
            type=='normal'?
            <View style={styles.extContainer}>
              <View style={styles.extHeader}>
                <Image source={require('./images/backdate-l.png')} />
                <Text style={styles.headerText}>升级成为激活节点</Text>
              </View>
              <View style={styles.divider} />
              <Image source={require('./images/levelUP15.png')} />
              <View style={styles.activeLabel}>
                <Text>普通节点</Text>
                <Text>激活节点</Text>
              </View>
              <DescView
                descArr={[
                  '普通节点花费15ITC升级成为激活节点',
                  '升级花费的ITC不会返还',
                  '激活节点可享受子节点的邀请收益',
                ]}
              />
              <Button text="激活" />
            </View>
            :null
          }

        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  extContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  extHeader: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    color: '#4DA9F3',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e4e4e4',
    width: '90%',
    marginVertical: 15,
  },
  childNodeList: {
    width: '90%',
    marginBottom: 10,
  },

  activeLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 205,
    marginTop: 8,
  },
};
