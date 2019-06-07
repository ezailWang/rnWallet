import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as Actions from '../../config/action/Actions';
import { BlueButtonBig } from '../../components/Button';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n';
import Layout from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';
import NetworkManager from '../../utils/NetworkManager';
import { showToast } from '../../utils/Toast';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentBox: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  contentDescBox: {
    width: Layout.WINDOW_WIDTH * 0.9,
    height: 40,
    borderRadius: 5,
    backgroundColor: Colors.bg_blue,
    justifyContent: 'center',
    marginTop: 20,
    // marginBottom: 20,
  },
  contentDescText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'center',
  },
  listContainer: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
  },

  bottomBox: {
    width: Layout.WINDOW_WIDTH,
    height: Layout.DEVICE_IS_IPHONE_X() ? 100 : 80,
    backgroundColor: 'white',
    paddingBottom: Layout.DEVICE_IS_IPHONE_X() ? 20 : 0,
    alignItems: 'center',
  },

  item: {
    flexDirection: 'row',
    height: 66,
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 20,
  },
  itemConetntView: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    color: Colors.fontBlackColor_43,
  },
  itemBindName: {
    fontSize: 15,
    color: Colors.fontGrayColor_a1,
  },
  itemAddress: {
    fontSize: 13,
    color: Colors.fontGrayColor_a1,
    marginTop: 2,
  },
  itemCheckedImg: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  itemSeparator: {
    height: 1,
    width: Layout.WINDOW_WIDTH - 20,
    backgroundColor: Colors.bgGrayColor_ed,
    alignSelf: 'center',
  },
  emptyListContainer: {
    marginTop: 150,
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
    fontSize: 16,
    width: Layout.WINDOW_WIDTH * 0.9,
    color: Colors.fontGrayColor_a,
    textAlign: 'center',
  },
  footer: {
    width: Layout.WINDOW_WIDTH * 0.8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  footerTouch: {
    flex: 1,
    marginTop: 22,
  },
  footerImg: {
    width: Layout.WINDOW_WIDTH * 0.8,
    height: ((Layout.WINDOW_WIDTH * 0.8) / 268) * 44,
  },
  footerTxt: {
    color: Colors.fontGrayColor_a,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },
});

class ChooseActivityETHWallet extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      ethWallets: [],
      isDisabled: true,
      selectedWallet: null,
    };
    this.flatList = React.createRef();
  }

  _initData = () => {
    const { ethWalletList } = this.props;
    this.setState({
      ethWallets: ethWalletList,
    });
  };

  async confirmBtn() {
    const { selectedWallet } = this.state;

    this._showLoading()
    try{            
      var result = await NetworkManager.queryActivityAddressInfo({
        eth:selectedWallet.address
      });

    } catch (e) {
      this._hideLoading();  
      showToast('query avtivity info error', 30);
    }


    if(result && Number(result.code) == 200){

      this.props.setActivityETHAddress(selectedWallet.address)

      //根据条件判断用户进入哪个界面
      //1，如果用户未绑定ITC地址，则进入绑定ITC页面
      //2，用户如果还未完成某个活动，则进入活动选择界面，
      //3，用户如果完成了某个活动，则进入活动界面
      if(result.data == null || result.data.itc.length == 0){

        this._hideLoading();
        this.props.navigation.navigate('ChooseActivityITCWallet');
      }
      else{
        let nodeInfo = await NetworkManager.queryNodeInfo({
          address:selectedWallet.address
        });

        this._hideLoading();
        if(nodeInfo.data && nodeInfo.data.address){
          this.props.navigation.navigate('NodeSummary',{
            nodeData:nodeInfo.data
          })
        }
        else{
          this.props.navigation.navigate('WLTask');
        }
      }
    }
  }

  // 自定义分割线
  _renderItemSeparatorComponent = () => <View style={styles.itemSeparator} />;

  //添加钱包
  _renderFooterView = () => <Footer onFooterItem={this._onFooterItem} />;

  _onFooterItem = () => {
    const _this = this;
    const params = {
      walletType: 'eth',
      from: 5,
    };
    this.props.setCreateWalletParams(params);
    this.props.navigation.navigate('ImportWallet', {
      callback() {
        _this.refreshPage();
      },
    });
    // this.props.navigation.navigate('ImportWallet');
  };

  refreshPage = async () => {
    const { ethWalletList } = this.props;
    this.setState({
      ethWallets: ethWalletList,
    });
  };

  // 空布局
  _renderEmptyView = () => (
    <View style={styles.emptyListContainer}>
      <Image
        style={styles.emptyListIcon}
        source={require('../../assets/common/no_icon.png')}
        resizeMode="contain"
      />
      <Text style={styles.emptyListText}>{I18n.t('settings.no_data')}</Text>
    </View>
  );

  _renderItem = item => (
    <Item
      item={item}
      choseWalletAddress={
        this.state.selectedWallet === null ? '' : this.state.selectedWallet.address
      }
      onPressItem={() => this._onPressItem(item)}
    />
  );

  _onPressItem = item => {
    const choseWallet = item.item;
    const { selectedWallet } = this.state;
    if (
      selectedWallet === null ||
      selectedWallet.address.toUpperCase() !== choseWallet.address.toUpperCase()
    ) {
      this.setState({
        selectedWallet: choseWallet,
        isDisabled: false,
      });
    } else {
      this.setState({
        selectedWallet: null,
        isDisabled: true,
      });
    }
  };

  componentWillMount() {
    super.componentWillMount()
    this._isMounted=true
  }
  componentWillUnmount(){
    super.componentWillUnmount()
  }

  //不知道为什么，获取这层的navigation key ，从其他界面goback的时候，会返回这个key的上层页面
  componentDidMount(){
    super.componentDidMount()
    let containerKey = this.props.navigation.state.key
    this.props.setSelectActivityContainerKey(containerKey)
  }

  renderComponent = () => (
    <View style={styles.container}>
      <WhiteBgHeader
        navigation={this.props.navigation}
        text={'涡轮计划'}
        // text={I18n.t('mapping.binding_replace_address')}
      />
      <View style={styles.contentBox}>
        <LinearGradient
          style={styles.contentDescBox}
          colors={['#3fc1ff', '#66ceff']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.contentDescText}>
            选择参与活动的ETH地址
          </Text>
        </LinearGradient>
        <FlatList
          style={styles.listContainer}
          ref={this.flatList}
          data={this.state.ethWallets}
          keyExtractor={(item, index) => index.toString()} // 给定的item生成一个不重复的key
          renderItem={this._renderItem}
          ListFooterComponent={this._renderFooterView}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          getItemLayout={(d, index) => ({ length: 80, offset: (80 + 1) * index, index })}
        />
      </View>

      <View style={styles.bottomBox}>
        <BlueButtonBig
          isDisabled={this.state.isDisabled}
          onPress={() => this.confirmBtn()}
        //   text={I18n.t('transaction.determine')}
        text={'下一步'}
        />
      </View>
    </View>
  );
}

class Footer extends PureComponent {
    render() {
      const { onFooterItem } = this.props;
      const img = require('../../assets/mapping/addBg.png');
      return (
        <View style={styles.footer}>
          <View style={styles.itemSeparator} />
          <TouchableOpacity activeOpacity={0.6} style={styles.footerTouch} onPress={onFooterItem}>
            <Image style={styles.footerImg} source={img} resizeMode="center" />
          </TouchableOpacity>
          <Text style={styles.footerTxt}>{I18n.t('mapping.import_erc_wallet')}</Text>
        </View>
      );
    }
  }

class Item extends PureComponent {
  render() {
    const { item, choseWalletAddress, onPressItem } = this.props || {};
    const { name, address} = item.item || {};

    const _name = name;
    const _address = `${address.substr(0, 8)}...${address.substr(34, 42)}`;

    const checkIcon =
      choseWalletAddress.toUpperCase() === address.toUpperCase()
        ? require('../../assets/launch/check_on.png')
        : require('../../assets/launch/check_off.png');
    const icon = checkIcon;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        {...this.props}
        style={styles.item}
        onPress={onPressItem}
      >
        <View style={styles.itemConetntView}>
          <Text style={styles.itemName}>{_name}</Text>
          <Text style={styles.itemAddress}>{_address}</Text>
        </View>
        <Image style={styles.itemCheckedImg} source={icon} resizeMode="center" />
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  ethWalletList: state.Core.ethWalletList,
});
const mapDispatchToProps = dispatch => ({
    setCreateWalletParams: params => dispatch(Actions.setCreateWalletParams(params)),
    setActivityETHAddress: params => dispatch(Actions.setActivityEthAddress(params)),
    setSelectActivityContainerKey: params => dispatch(Actions.setSelectActivityContainerKey(params)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseActivityETHWallet);
