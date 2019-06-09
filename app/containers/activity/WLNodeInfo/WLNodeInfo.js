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

class WLNodeInfo extends BaseComponent {
  constructor(props) {
    super(props);
    this.address = this.props.activityEthAddress
    this.state = {
      task: {}
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
      { label: '总额度', value: task.totalAmount+' ITC' },
      { label: '我的投票', value: task.myVote+' ITC' },
      { label: '解锁日期', value: task.unlockTime },
      { label: '转入记录', value: task.txHash, valueStyle: { color: '#50A6E5' } },
    ];
    const activateInfos = [
      { label: '邀请人', value: task.inviter },
      { label: '激活时间', value: task.activeTime },
      { label: '激活记录', value: task.activeTxHash, valueStyle: { color: '#50A6E5' } },
      { label: '晋级时间', value: task.benefitTime },
    ];

    let nodeType = '普通节点';
    if (task.vip){
      nodeType = '超级节点'
    } else{
      switch(task.nodeType){
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

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text="节点信息" />
        <ScrollView>
          <View style={styles.node}>
            <NodeCard
              icon={<Image source={require('./images/quanyi.png')} style={styles.icon} resizeMode='contain'/>}
              name={nodeType}
              address={task.address}
              showArrow={false}
            />
          </View>
          <DisplayForm title="任务信息" items={taskInfos} />
          {
            !task.vip && task.actived?
            <DisplayForm title="激活信息" items={activateInfos} />
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
