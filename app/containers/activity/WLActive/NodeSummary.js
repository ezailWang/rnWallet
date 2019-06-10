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
import {connect} from 'react-redux'
import { async } from 'rxjs/internal/scheduler/async';
import { I18n } from '../../../config/language/i18n';
import { NavigationActions} from 'react-navigation'
class NodeSummary extends BaseComponent {
  
  _initData = async () => {

      let { nodeData } = this.props.navigation.state.params;

      this.setState({
        ...nodeData
      })
  }

  didTapActivityBtn = async ()=>{ 

    let {activityEthAddress} = this.props
    this._showLoading()
    let result = await NetworkManager.queryAddressBindAddress({
      address:activityEthAddress
    })
    this._hideLoading()
    if(result.code == 200){

      //激活成功，回来刷新界面
      this.props.navigation.navigate('WLNodeActivate',{
        inviteAddress:result.data ? result.data:'',
        callback:(nodeData)=>{
          this.setState({
            ...nodeData
          })
        }
      })
    }
    else{
      showToast('查询地址绑定信息失败，请重试')
    }
    
  }

  _onBackPressed = ()=>{

    let {navigation, selAvtivityContainerKey} = this.props
    navigation.goBack(selAvtivityContainerKey)
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
    let { activeRound,address,bonusReward,children,inviteReward,totalReward,treeReward,type,vip,childNum,totalSubNodeNum } = this.state;
    let nodeType = I18n.t('activity.common.normalNode');
    let nodeIcon = (<Image source={require('./images/normal.png')} />)
    if (vip){
      nodeType = I18n.t('activity.common.superNode')
      nodeIcon = (<Image source={require('./images/super.png')} />)
    } else{
      switch(type){
        case 'normal':
          nodeType = I18n.t('activity.common.normalNode');
          nodeIcon = (<Image source={require('./images/normal.png')} />)
          break
        case 'benefit':
          nodeType = I18n.t('activity.common.benefitNode');
          nodeIcon = (<Image source={require('./images/quanyi.png')} />)
          break
        case 'active':
          nodeType = I18n.t('activity.common.activeNode');
          nodeIcon = (<Image source={require('./images/active.png')} />)
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
        <NavHeader navigation={navigation} color="white" text={I18n.t('activity.common.activityName')} leftAction={this._onBackPressed}/>
        <ScrollView>
          <NodeInfo
            icon={nodeIcon}
            name={nodeType}
            address={address}
            onNodePress={() => {
              navigation.navigate('WLNodeInfo')
            }}
            onRankPress={() => {
              this.props.navigation.navigate('WebViewScreen',{
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
              cycle={type=='active'?'--':I18n.t('activity.common.roundPrefix')+activeRound+I18n.t('activity.common.roundSuffix')} 
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
                <Text style={styles.headerText}>{I18n.t('activity.nodeSummary.myChildren')}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.childNodeSummary}>
                <Text style={{color:'#9f9f9f',textAlign:'center'}}>子节点数量</Text>
                <Text style={{color:'#4EAAED',fontSize:20,textAlign:'center'}}>{totalSubNodeNum}</Text>
                <Image source={require("./images/zt5.png")} style={{ marginVertical: 15 }} />
              </View>
              {/* <View style={styles.childNodeList}>
                {children.map(item => (
                  <ChildNodeItem key={item.level} no={'L'+item.level} value={item.nodeNum} total={maxNodeNum} />
                ))}
              </View> */}
              <Button text={I18n.t('activity.nodeSummary.inviteOthers')} onPress={() => {
                navigation.navigate("WLInvite")
              }}/>
            </View>
            :null
          }

          {/* 激活节点 */}
          {
            type=='active'?
            <View style={styles.extContainer}>
              <View style={styles.extHeader}>
                <Image source={require('./images/backdate-l.png')} />
                <Text style={styles.headerText}>{I18n.t('activity.nodeSummary.levelupBenefit')}</Text>
              </View>
              <View style={styles.divider} />
              <Image source={require('./images/up5L1.png')} />
              <View style={styles.activeLabel}>
                <Text>{I18n.t('activity.common.activeNode')}</Text>
                <Text>{I18n.t('activity.common.benefitNode')}</Text>
              </View>
              <DescView
                descArr={[
                  I18n.t('activity.nodeSummary.howToBenefit'),
                  I18n.t('activity.nodeSummary.whyBenefit'),
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
              <Button text={I18n.t('activity.nodeSummary.inviteOthers')} onPress={() => {
                navigation.navigate("WLInvite")
              }}/>
            </View>
            :null
          }
          
          {/* 普通节点 */}
          {
            type=='normal'?
            <View style={styles.extContainer}>
              <View style={styles.extHeader}>
                <Image source={require('./images/backdate-l.png')} />
                <Text style={styles.headerText}>{I18n.t('activity.nodeSummary.levelupActive')}</Text>
              </View>
              <View style={styles.divider} />
              <Image source={require('./images/act_levelUP15.png')} />
              <View style={styles.activeLabel}>
                <Text>{I18n.t('activity.common.normalNode')}</Text>
                <Text>{I18n.t('activity.common.activeNode')}</Text>
              </View>
              <DescView
                descArr={[
                  I18n.t('activity.nodeSummary.howToActive'),
                  I18n.t('activity.nodeSummary.activeWarning'),
                  I18n.t('activity.nodeSummary.whyActive'),
                ]}
              />
              <Button onPress={this.didTapActivityBtn} text={I18n.t('activity.common.active')} />
            </View>
            :null
          }

        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  activityEthAddress : state.Core.activityEthAddress,
  selAvtivityContainerKey: state.Core.selAvtivityContainerKey,
});
export default connect(
  mapStateToProps,
)(NodeSummary);

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
  childNodeSummary: {
    alignContent: 'center' ,
    marginBottom: 30
  },
  activeLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 205,
    marginTop: 8,
  },
};
