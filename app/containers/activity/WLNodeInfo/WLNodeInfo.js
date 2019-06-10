/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Image, ScrollView,StatusBar,Linking} from 'react-native';
import NodeCard from '../../../components/NodeCard';
import DisplayForm from './components/DisplayForm';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import NetworkManager from '../../../utils/NetworkManager';
import { showToast } from '../../../utils/Toast';
import { Network } from '../../../config/GlobalConfig';
import {connect} from 'react-redux'
import { I18n } from '../../../config/language/i18n';

class WLNodeInfo extends BaseComponent {
  constructor(props) {
    super(props);
    this.address = this.props.activityEthAddress
    this.state = {
      task: {
        totalAmount: 0,
        myVote:0
      }
    };
  }

  _initData = async () => {
    this._showLoading()
    try {
      var result = await NetworkManager.queryTaskInfo({
        address: this.address
      });
      this.setState({
        task: result.data
      })
      this._hideLoading();
    } catch (e) {
      this._hideLoading();  
      showToast('query task info error', 30);
    }
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
    let { task } = this.state;
    let taskInfos = [];

    if(task.vip){
      taskInfos = [
        { label: I18n.t('activity.nodeinfo.nodeNo'), value: 'NO.'+task.vipNo },
        { label: I18n.t('activity.nodeinfo.totalAmount'), value: task.totalAmount+' ITC' },
        { label: I18n.t('activity.nodeinfo.myVote'), value: task.myVote+' ITC' },
        { label: I18n.t('activity.nodeinfo.partnerVote'), value: task.partnerVote+' ITC' },
        { label: I18n.t('activity.nodeinfo.unlockTime'), value: task.unlockTime },
        { label: I18n.t('activity.nodeinfo.txHash'), value: task.txHash, valueStyle: { color: '#50A6E5' } },
      ];
    }else if(task.taskType==='vote'){
      taskInfos = [
        { label: I18n.t('activity.nodeinfo.nodeNo'), value: 'NO.'+task.vipNo },
        { label: I18n.t('activity.nodeinfo.totalAmount'), value: task.totalAmount+' ITC' },
        { label: I18n.t('activity.nodeinfo.myVote'), value: task.myVote+' ITC' },
        { label: I18n.t('activity.nodeinfo.unlockTime'), value: task.unlockTime },
        { label: I18n.t('activity.nodeinfo.txHash'), value: task.txHash, valueStyle: { color: '#50A6E5' } },
      ];
    }else if(task.taskType==='mapping'){
      taskInfos = [
        { label: I18n.t('activity.nodeinfo.mappingAmount'), value: task.mappingAmount+' ITC' },
        { label: I18n.t('activity.nodeinfo.mappingTime'), value: task.mappingTime },
      ];
      const mappingRecords = task.mappingRecords
      if(mappingRecords && mappingRecords.length>0){
        taskInfos.push({ 
          label: I18n.t('activity.nodeinfo.mappingHash'), 
          value: mappingRecords[0],
          valueStyle: { color: '#50A6E5' },
          onPress: async () =>{
            const resp = await NetworkManager.queryTransactionDetail({
              txhash: mappingRecords[0]
            });
            let mappingDetail = resp.data
            this.props.navigation.navigate('MappingRecordDetail', { mappingDetail });
          }
        })
        taskInfos = taskInfos.concat(mappingRecords.slice(1).map(r => {
          return {
            label: '', 
            value: r,
            valueStyle: { color: '#50A6E5' },
            onPress: async () =>{
              const resp = await NetworkManager.queryTransactionDetail({
                txhash: r
              });
              let mappingDetail = resp.data
              this.props.navigation.navigate('MappingRecordDetail', { mappingDetail });
            }
          }
        }))
      }
    }

    let activateInfos = [];
    let nodeType = I18n.t('activity.common.normalNode');
    let nodeIcon = (<Image source={require('./images/normal.png')} style={styles.icon} resizeMode='contain' />)
    if (task.vip){
      nodeType = I18n.t('activity.common.superNode')
      nodeIcon = (<Image source={require('./images/super.png')} style={styles.icon} resizeMode='contain' />)
    } else{
      switch(task.nodeType){
        case 'normal':
          nodeType = I18n.t('activity.common.normalNode')
          nodeIcon = (<Image source={require('./images/normal.png')} style={styles.icon} resizeMode='contain' />)
          break
        case 'benefit':
          nodeType = I18n.t('activity.common.benefitNode')
          nodeIcon = (<Image source={require('./images/quanyi.png')} style={styles.icon} resizeMode='contain' />)
          activateInfos = [
            { label: I18n.t('activity.nodeinfo.inviter'), value: task.inviter },
            { label: I18n.t('activity.nodeinfo.activeTime'), value: task.activeTime },
            { label: I18n.t('activity.nodeinfo.activeTxHash'), value: task.activeTxHash, valueStyle: { color: '#50A6E5' }, onPress: () => {
              
              let detailUrl;
              if (this.props.network === Network.rinkeby) {
                detailUrl = `https://rinkeby.etherscan.io/tx/${task.activeTxHash}`;
              } else if (this.props.network === Network.main) {
                detailUrl = `https://etherscan.io/tx/${task.activeTxHash}`;
              }
              Linking.canOpenURL(detailUrl)
                .then(supported => {
                  if (!supported) {
                    return null;
                  }
                  return Linking.openURL(detailUrl);
                })
                .catch(err => console.log('An error occurred', detailUrl, ' err:', err));
            } },
            { label: I18n.t('activity.nodeinfo.benefitTime'), value: task.benefitTime },
          ];
          break
        case 'active':
          nodeType = I18n.t('activity.common.activeNode')
          nodeIcon = (<Image source={require('./images/active.png')} style={styles.icon} resizeMode='contain' />)
          activateInfos = [
            { label: I18n.t('activity.nodeinfo.inviter'), value: task.inviter },
            { label: I18n.t('activity.nodeinfo.activeTime'), value: task.activeTime },
            { label: I18n.t('activity.nodeinfo.activeTxHash'), value: task.activeTxHash, valueStyle: { color: '#50A6E5' }, onPress: () => {
              
              let detailUrl;
              if (this.props.network === Network.rinkeby) {
                detailUrl = `https://rinkeby.etherscan.io/tx/${task.activeTxHash}`;
              } else if (this.props.network === Network.main) {
                detailUrl = `https://etherscan.io/tx/${task.activeTxHash}`;
              }
              Linking.canOpenURL(detailUrl)
                .then(supported => {
                  if (!supported) {
                    return null;
                  }
                  return Linking.openURL(detailUrl);
                })
                .catch(err => console.log('An error occurred', detailUrl, ' err:', err));
            } },
          ];
          break
      }
    }
    let isShowLoading = this.state.isShowLoading
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text={I18n.t('activity.nodeinfo.nodeinfo')} />
        {
          !isShowLoading?
          <ScrollView>
            <View style={styles.node}>
              <NodeCard
                icon={nodeIcon}
                name={nodeType}
                address={task.address}
                showArrow={false}
              />
            </View>
            <DisplayForm title={I18n.t('activity.nodeinfo.taskinfo')} items={taskInfos} />
            {
              !task.vip && task.actived?
              <DisplayForm title={I18n.t('activity.nodeinfo.activeinfo')} items={activateInfos} />
              :null
            }
          </ScrollView>
          :null
        }
        
      </View>
    );
  }
}

const mapStateToProps = state => ({
  network : state.Core.network,
  activityEthAddress : state.Core.activityEthAddress,
  activityItcAddress : state.Core.activityItcAddress,
  selAvtivityContainerKey: state.Core.selAvtivityContainerKey,
});
export default connect(
  mapStateToProps,
)(WLNodeInfo);

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  node: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  icon: {
    width: 40,
    height: 40
  },
  cardContainer: {
    textAlign: 'center',
    alignItems: 'center',
  },
};
