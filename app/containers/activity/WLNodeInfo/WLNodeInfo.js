/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Image, ScrollView,StatusBar } from 'react-native';
import NodeCard from '../../../components/NodeCard';
import DisplayForm from './components/DisplayForm';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import NetworkManager from '../../../utils/NetworkManager';
import { showToast } from '../../../utils/Toast';
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

  renderComponent = () => {
    const { navigation } = this.props;
    let { task } = this.state;
    const taskInfos = [
      // { label: '节点编号', value: 'NO.1' },
      { label: I18n.t('activity.nodeinfo.totalAmount'), value: task.totalAmount+' ITC' },
      { label: I18n.t('activity.nodeinfo.myVote'), value: task.myVote+' ITC' },
      { label: I18n.t('activity.nodeinfo.unlockTime'), value: task.unlockTime },
      { label: I18n.t('activity.nodeinfo.txHash'), value: task.txHash, valueStyle: { color: '#50A6E5' } },
    ];
    const activateInfos = [
      { label: I18n.t('activity.nodeinfo.inviter'), value: task.inviter },
      { label: I18n.t('activity.nodeinfo.activeTime'), value: task.activeTime },
      { label: I18n.t('activity.nodeinfo.activeTxHash'), value: task.activeTxHash, valueStyle: { color: '#50A6E5' } },
      { label: I18n.t('activity.nodeinfo.benefitTime'), value: task.benefitTime },
    ];

    let nodeType = I18n.t('activity.common.normalNode');
    if (task.vip){
      nodeType = I18n.t('activity.common.superNode')
    } else{
      switch(task.nodeType){
        case 'normal':
          nodeType = I18n.t('activity.common.normalNode')
          break
        case 'benefit':
          nodeType = I18n.t('activity.common.benefitNode')
          break
        case 'active':
          nodeType = I18n.t('activity.common.activeNode')
          break
      }
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text={I18n.t('activity.nodeinfo.nodeinfo')} />
        <ScrollView>
          <View style={styles.node}>
            <NodeCard
              icon={<Image source={require('./images/quanyi.png')} style={styles.icon} resizeMode='contain'/>}
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
