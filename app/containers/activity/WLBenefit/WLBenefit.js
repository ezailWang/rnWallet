/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { 
  View, 
  ImageBackground, 
  ScrollView, 
  Dimensions, 
  StatusBar,
  Image,
  Text,
  FlatList,
  RefreshControl } from 'react-native';
import BenefitOverview from './components/BenefitOverview';
import BenefitItem from './components/BenefitItem';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import NetworkManager from '../../../utils/NetworkManager';
import { showToast } from '../../../utils/Toast';
import { I18n } from '../../../config/language/i18n';
import PropTypes from 'prop-types';
import Layout from '../../../config/LayoutConstants';
import { Colors } from '../../../config/GlobalConfig';
import {connect} from 'react-redux'

const { height } = Dimensions.get('window');

class EmptyComponent extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
  };

  render() {
    const { show } = this.props;
    return show ? (
      <View style={styles.emptyListContainer}>
        <Image
          style={styles.emptyListIcon}
          source={require('../../../assets/common/no_icon.png')}
          resizeMode="contain"
        />
        <Text style={styles.emptyListText}>
          {I18n.t('activity.benefit.noData')}
        </Text>
      </View>
    ) : null;
  }
}

class WLBenefit extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      summary: {
        totalReward: 0,
        bonusReward: 0,
        inviteReward: 0,
        treeReward: 0
      },
      isRefreshing: false,
    };

    this.address = this.props.activityEthAddress;
    this.isLoadMoreing = false;
    this.offset = 0;
    this.pageSize = 10;
    this.isLoadMoreing = false;
    this.isHaveMoreData = true;
    this.flatListRef = React.createRef();
    this.onRefresh = this.onRefresh.bind(this);
  }
  componentWillMount() {
    super.componentWillMount();
    this._isMounted = true;
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this._isMounted = false;
  }

  _initData = async () => {
    this.getSummary()
    this._showLoading()
    try {
      await this.getRecords(true)
      this._hideLoading();
    } catch (e) {
      this._hideLoading();  
      showToast('query reward info error', 30);
    }
  }

  getSummary = async () => {
    try {
      var result = await NetworkManager.queryNodeInfo({
        address: this.address
      });
      this.setState({
        summary: result.data
      })
    } catch (e) {
      showToast('query node info error', 30);
    }
  }

  renderItem = item => {
    let type = I18n.t('activity.common.benefit');
    switch(item.item.type){
      case 'active':
        type = I18n.t('activity.common.inviteReward')
        break
      case 'tree':
        type = I18n.t('activity.common.treeReward')
        break
      case 'bonus':
        type = I18n.t('activity.common.poolReward')
        break
      case 'vip':
        type = I18n.t('activity.common.poolReward')+'('+I18n.t('activity.common.superNode')+')'
        break
    }
    return (
      <BenefitItem type={type} time={item.item.createTime} count={item.item.reward} />
    )
  };

  getRecords = async cleanDatas => {
    if(this._isMounted){
      var result = await NetworkManager.queryRewardList({
        address: this.address,
        offset: this.offset,
        size: this.pageSize
      });
      if(!result.data || result.data.length<this.pageSize){
        this.isHaveMoreData = false
      }else{
        this.isHaveMoreData = true
      }
      if(cleanDatas){
        this.offset = 0
        this.setState({
          datas: result.data
        })
      }else{
        this.offset = this.offset + this.pageSize
        const newDatas = this.state.datas.concat(result.data);
        this.setState({
          datas: newDatas
        })
      }
    }
  }

  onRefresh = async () => {
    if (this._isMounted) {
      this.setState({
        isRefreshing: true,
      });

      try {
        await this.getRecords(true);
      } catch (e) {
        showToast('query reward info error', 30);
      }
      this.setState({
        isRefreshing: false,
      });
    }
  };

  _onLoadMore = async () => {
    if(
      this.isHaveMoreData &&
      !this.isLoadMoreing &&
      !this.state.isRefreshing
    ){
      this.isLoadMoreing = true;
      try {
        await this.getRecords(false)
      } catch (e) {
        showToast('query reward info error', 30);
      }
      this.isLoadMoreing = false;
    }
  }

  renderComponent = () => {
    const { navigation } = this.props;
    let { datas,summary } = this.state;
    return (
      <View>
        <StatusBar barStyle="light-content" />
        <NavHeader navigation={navigation} color="transparent" />
        <ImageBackground
          resizeMode="cover"
          source={require('./images/banner.png')}
          style={styles.banner}
        >
          <View style={styles.benefitView}>
            <View style={styles.totalBenefit}>
              <BenefitOverview title={I18n.t('activity.common.totalReward')+'(ITC)'} count={summary.totalReward===0?'--':summary.totalReward} scale={5} />
            </View>
            <View style={styles.dividedBenefit}>
              <BenefitOverview title={I18n.t('activity.common.poolReward')} subtitle="IoT Chain" count={summary.bonusReward===0?'--':summary.bonusReward} />
              <View style={styles.divider} />
              <BenefitOverview title={I18n.t('activity.common.inviteReward')} subtitle="Erc 20" count={summary.inviteReward===0?'--':summary.inviteReward} />
              <View style={styles.divider} />
              <BenefitOverview title={I18n.t('activity.common.treeReward')} subtitle="Erc 20" count={summary.treeReward===0?'--':summary.treeReward} />
            </View>
          </View>
        </ImageBackground>
        <FlatList
          style={[styles.list]}
          ListEmptyComponent={<EmptyComponent show={datas.length===0} />}
          data={datas}
          renderItem={this.renderItem}
          refreshControl={
            <RefreshControl
              onRefresh={this.onRefresh}
              refreshing={this.state.isRefreshing}
              tintColor={Colors.whiteBackgroundColor}
            />
          }
          // getItemLayout={(data, index) => ({ length: 60, offset: (60 + 7) * index, index })}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          scrollEventThrottle={1}
          keyExtractor={(item, index) => index.toString()}
          ref={this.flatListRef}
          onEndReachedThreshold={1}
          onEndReached={this._onLoadMore}
        />
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
)(WLBenefit);


const styles = {
  banner: {
    width: '100%',
    height: 230,
    justifyContent: 'center',
  },
  benefitView: {
    marginTop: 45,
  },
  totalBenefit: {
    alignItems: 'center',
  },
  dividedBenefit: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  divider: {
    width: 0.5,
    height: 50,
    backgroundColor: 'white',
  },
  list: {
    height: height - 230,
    backgroundColor: 'white',
  },
  emptyListContainer: {
    color: Colors.fontDarkGrayColor,
    marginTop: 120,
    width: Layout.WINDOW_WIDTH * 0.9,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  emptyListIcon: {
    width: 94,
    height: 114,
    marginBottom: 23,
  },
  emptyListText: {
    width: Layout.WINDOW_WIDTH * 0.9,
    fontSize: 16,
    color: Colors.fontGrayColor_a,
    textAlign: 'center',
  },
};
