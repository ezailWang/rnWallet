import React from 'react';
import { View, Text, ScrollView, TouchableHighlight, Dimensions,StatusBar } from 'react-native';
import NavHeader from '../../../components/NavHeader';

export default class WLPages extends React.Component {
  render() {
    const { navigation } = this.props;
    const { navigate } = navigation;
    return (
      <View>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} text="导航示例" color="white" />
        <ScrollView style={{ height: Dimensions.get('window').height - 70 }}>
          <PageItem name="首页" onPress={() => navigate('WLHome')} />
          <PageItem name="前置任务" onPress={() => navigate('WLTask')} />
          <PageItem name="锁仓" onPress={() => navigate('WLLock')} />
          <PageItem name="投票" onPress={() => navigate('WLVote')} />
          <PageItem name="合约授权" onPress={() => navigate('WLAuth')} />
          <PageItem name="选择节点" onPress={() => navigate('WLNode')} />
          <PageItem name="个人活动-超级节点" onPress={() => navigate('WLActiveSuper')} />
          <PageItem name="个人活动-激活节点" onPress={() => navigate('WLActiveActivate')} />
          <PageItem name="个人活动-普通节点" onPress={() => navigate('WLActiveNormal')} />
          <PageItem name="个人活动-权益节点" onPress={() => navigate('WLActiveAuth')} />
          <PageItem name="激活节点" onPress={() => navigate('WLNodeActivate')} />
          <PageItem name="节点信息" onPress={() => navigate('WLNodeInfo')} />
          <PageItem name="邀请好友" onPress={() => navigate('WLInvite')} />
          <PageItem name="收益明细" onPress={() => navigate('WLBenefit')} />
        </ScrollView>
      </View>
    );
  }
}

function PageItem({ name, onPress }) {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={{
        backgroundColor: 'white',
        padding: 20,
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1,
      }}
    >
      <Text>{name}</Text>
    </TouchableHighlight>
  );
}
