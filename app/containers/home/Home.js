import React from 'react';
import {
  Platform,
  SwipeableFlatList,
  View,
  StyleSheet,
  RefreshControl,
  Animated,
  Linking,
  Text,
  TouchableOpacity,
  findNodeHandle,
} from 'react-native';

import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import HeadView from './component/HeadView';
import { HomeCell, ItemDivideComponent, EmptyComponent } from './component/HomeCell';
import ImageButton from '../../components/ImageButton';
import LayoutConstants from '../../config/LayoutConstants';
import StatusBarComponent from '../../components/StatusBarComponent';
import NetworkManager from '../../utils/NetworkManager';
import {
  setAllTokens,
  setCoinBalance,
  setNetWork,
  removeToken,
  setIsNewWallet,
  setNewTransaction,
  setTotalAssets,
} from '../../config/action/Actions';
import StorageManage from '../../utils/StorageManage';
import { StorageKey, Colors } from '../../config/GlobalConfig';
import store from '../../config/store/ConfigureStore';
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n';
import MyAlertComponent from '../../components/MyAlertComponent';
import BaseComponent from '../base/BaseComponent';
import Analytics from '../../utils/Analytics';

const hiddenIconInvi = require('../../assets/home/psd_invi_w.png');
const hiddenIconVi = require('../../assets/home/psd_vi_w.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

class HomeScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      addTokenShow: false,
      changeNetworkShow: false,
      isRefreshing: false,
      // isShowLoading: false,
      scroollY: new Animated.Value(0),
      statusbarStyle: 'light-content',
      isTotalAssetsHidden: false,
      monetaryUnitSymbol: '', // 货币单位符号
      headBgImageRef: null,
      versionUpdateModalVisible: false,
    };

    this.versionUpdateInfo = null;
    this.headBackgroundImageRef = React.createRef();
    this.onClickCell = this.onClickCell.bind(this);
    this._setStatusBarStyleLight();
  }

  componentWillMount() {
    this._isMounted = true;
    this._addEventListener();
    this._addChangeListener();
    Analytics.setCurrentScreen('home');
  }

  componentWillUnmount() {
    this._isMounted = false;
    this._removeEventListener();
    this._removeChangeListener();
  }

  renderItem = item => {
    item.item.isTotalAssetsHidden = this.state.isTotalAssetsHidden;
    return (
      <HomeCell
        item={item}
        onClick={() => this.onClickCell(item)}
        monetaryUnitSymbol={this.state.monetaryUnitSymbol}
      />
    );
  };

  renderQuickActions = item => (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
      <TouchableOpacity
        style={{
          padding: 10,
          width: 80,
          justifyContent: 'center',
          backgroundColor: Colors.RedColor,
        }}
        onPress={() => {
          this.deleteItem(item);
        }}
      >
        <Text style={{ textAlign: 'center', color: 'white' }}>{I18n.t('home.delete')}</Text>
      </TouchableOpacity>
    </View>
  );

  deleteItem = item => {
    if (item.item.symbol === 'ETH' || item.item.symbol === 'ITC') {
      showToast(I18n.t('home.delete_main_token'));
      return;
    }
    this.props.removeToken(item.item.address);
    // this.removeTokenFromStorage(item.item.address)
  };

  onClickCell = async item => {
    const { address, symbol, decimal, price, balance, iconLarge } = item.item;
    const balanceInfo = {
      amount: balance,
      price,
      symbol,
      address,
      decimal,
      iconLarge,
    };
    store.dispatch(setCoinBalance(balanceInfo));
    this.props.navigation.navigate('TransactionRecoder', {
      async callback() {
        // await NetworkManager.loadTokenList()
      },
    });
  };

  pushAddtoken = async () => {
    /* this.props.navigation.navigate('AddAssets', {
            callback: async (token) => {
                this._showLoading()
                await this.saveTokenToStorage(token)
                await NetworkManager.loadTokenList()
                this._hideLoading()
            }
        }); */

    if (!this.props.allTokens || this.props.allTokens.length <= 0) {
      this._showLoading();
      this.getAllTokens(2);
    } else {
      const _this = this;
      this.props.navigation.navigate('AddToken', {
        tokens: _this.props.tokens,
        callback: async () => {},
      });
    }
  };

  showChangeNetwork = () => {
    this.setState({
      changeNetworkShow: true,
    });
  };

  showDrawer = () => {
    this.props.navigation.openDrawer();
  };

  /* changeNetworkDone = async () => {
        this.setState({
            changeNetworkShow: false
        })
        this._showLoading()
        await NetworkManager.loadTokenList()
        this._hideLoading()
    } */

  onRefresh = async () => {
    this.setState({
      isRefreshing: true,
    });
    await NetworkManager.loadTokenList();
    this.setState({
      isRefreshing: false,
    });
  };

  static formatAddress(address) {
    return `${address.substr(0, 10)}...${address.slice(-10)}`;
  }

  _changeWalletEmitter = async data => {
    this._showLoading();
    try {
      store.dispatch(setNewTransaction(null));
      await NetworkManager.loadTokenList();
      if (data.isChangeWalletList) {
        // 钱包列表发生变化，更新推送服务器数据
        this.userInfoUpdate();
      }
      this._hideLoading();
      /* this._hideLoading(() => {
        if (data.openRightDrawer) {
          this.props.navigation.openDrawer();
        }
      }); */
    } catch (err) {
      console.log('home changeWallet err:', err);
      Analytics.recordErr('homeChangeWalletErr', err);
      this._hideLoading();
    }
  };

  _changeTokensEmitter = async () => {
    await NetworkManager.getTokensBalance();
  };

  async userInfoUpdate() {
    const { ethWalletList, itcWalletList } = store.getState().Core;
    const ethWallets = ethWalletList.map(wallet => wallet.address);
    const itcWallets = itcWalletList.map(wallet => wallet.address);
    const params = {
      language: I18n.locale,
      // walletAddress: address,
      ethWallets,
      itcWallets,
    };
    NetworkManager.userInfoUpdate(params)
      .then(response => {
        if (response.code === 200) {
          // console.log('userInfoUpdate rsp:', response);
        } else {
          // console.log('userInfoUpdate err msg:', response.msg);
        }
      })
      .catch(err => {
        this._hideLoading();
        Analytics.recordErr('userInfoUpdateCatchErr', err);
        // console.log('userInfoUpdate err:', err)
      });
  }

  async getAllTokens(type) {
    const allTokensParams = {
      network: this.props.network,
    };
    const _this = this;
    NetworkManager.getAllTokens(allTokensParams)
      .then(response => {
        if (response.code === 200) {
          this.props.setAllTokens(response.data);
          this._hideLoading(() => {
            if (type === 2) {
              this.props.navigation.navigate('AddToken', {
                tokens: _this.props.tokens,
                callback: async () => {},
              });
            }
          });
        } else {
          this._hideLoading(() => {
            if (type === 2) {
              showToast(I18n.t('toast.net_request_err'));
            }
          });
          Analytics.recordErr('getAllTokensRspErr', response.msg);
        }
      })
      .catch(err => {
        this._hideLoading();
        Analytics.recordErr('getAllTokensCatchErr', err);
      });
  }

  _initData = async () => {
    SplashScreen.hide();
    try {
      if (this.props.isNewWallet === false) {
        this._verifyIdentidy();
        this.versionUpdate();
        Analytics.setUserProperty('buildVersion', DeviceInfo.getBrand());
      } else {
        this.props.setIsNewWallet(false);
        this._showLoading();
      }
      this.setState({
        monetaryUnitSymbol: this.props.monetaryUnit.symbol,
      });
      const hiddenAssets = await StorageManage.load(StorageKey.HiddenAssets);
      if (hiddenAssets) {
        this.setState({
          isTotalAssetsHidden: hiddenAssets,
        });
      }
      await NetworkManager.loadTokenList();

      this._hideLoading();
      this.userInfoUpdate();
      this.getAllTokens(1);
    } catch (err) {
      console.log('home initData err:', err);
      Analytics.recordErr('homeInitDataErr', err);
      this._hideLoading();
    }
  };

  /* async saveTokenToStorage(token) {
        let key = StorageKey.Tokens + this.props.wallet.address
        let localTokens = await StorageManage.load(key)
        if (!localTokens) {
            localTokens = []
        }

        localTokens.push({
            address: token.tokenAddress,
            symbol: token.tokenSymbol,
            decimal: token.tokenDecimal,
        })
        StorageManage.save(key, localTokens)
    }

    async removeTokenFromStorage(address) {
        let key = StorageKey.Tokens + this.props.wallet.address
        let localTokens = await StorageManage.load(key)
        if (!localTokens) {
            console.error('localTokens is null')
            return
        }
        localTokens.splice(localTokens.findIndex(item => item.address === address), 1)
        StorageManage.save(key, localTokens)
    } */

  static async saveIsTotalAssetsHiddenToStorage(isHidden) {
    StorageManage.save(StorageKey.HiddenAssets, isHidden);
  }

  _monetaryUnitChange = async data => {
    await NetworkManager.loadTokenList();
    this.setState({
      monetaryUnitSymbol: data.monetaryUnit.symbol,
    });
  };

  versionUpdateLeftPress = () => {
    this.setState({
      versionUpdateModalVisible: false,
    });
    this.versionUpdateInfo = null;
  };

  versionUpdateRightPress = () => {
    this.setState({
      versionUpdateModalVisible: false,
    });
    const { updateUrl } = this.versionUpdateInfo;
    Linking.canOpenURL(updateUrl).then(supported => {
      if (supported) {
        Linking.openURL(updateUrl);
      }
    });
    this.versionUpdateInfo = null;
  };

  async versionUpdate() {
    const params = {
      system: Platform.OS,
      version: `${DeviceInfo.getVersion()}(${DeviceInfo.getBuildNumber()})`,
      language: I18n.locale,
    };
    NetworkManager.getVersionUpdateInfo(params)
      .then(response => {
        if (response.code === 200) {
          const contents = response.data.content.split('&');
          const updateInfo = {
            contents,
            updateUrl: response.data.updateUrl,
          };
          this.versionUpdateInfo = updateInfo;
          this.setState({
            versionUpdateModalVisible: true,
          });
        }
      })
      .catch(err => {
        Analytics.recordErr('getVersionUpdateInfoCatchErr', err);
      });
  }

  renderComponent = () => {
    if (!this.props.wallet.address) {
      return null;
    }
    const headerHeight = this.state.scroollY.interpolate({
      inputRange: [
        -LayoutConstants.WINDOW_HEIGHT + LayoutConstants.HOME_HEADER_MAX_HEIGHT,
        0,
        LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT,
      ],
      outputRange: [
        LayoutConstants.WINDOW_HEIGHT,
        LayoutConstants.HOME_HEADER_MAX_HEIGHT,
        LayoutConstants.HOME_HEADER_MIN_HEIGHT,
      ],
      extrapolate: 'clamp',
    });
    const headerZindex = this.state.scroollY.interpolate({
      inputRange: [
        0,
        LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT,
      ],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const headerTextOpacity = this.state.scroollY.interpolate({
      inputRange: [
        LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT - 20,
        LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT,
      ],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const headerBgImageScale = this.state.scroollY.interpolate({
      inputRange: [
        -LayoutConstants.WINDOW_HEIGHT + LayoutConstants.HOME_HEADER_MAX_HEIGHT,
        0,
        LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT,
      ],
      outputRange: [
        LayoutConstants.WINDOW_HEIGHT / LayoutConstants.TRANSFER_HEADER_MAX_HEIGHT + 1.6,
        1,
        1,
      ],
      extrapolate: 'clamp',
    });

    const headerBgImageTranslateY = this.state.scroollY.interpolate({
      inputRange: [
        -LayoutConstants.WINDOW_HEIGHT + LayoutConstants.HOME_HEADER_MAX_HEIGHT,
        0,
        LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT,
      ],
      outputRange: [
        0,
        0,
        -(LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT),
      ],
      extrapolate: 'clamp',
    });

    const topBg =
      this.props.wallet.type === 'eth'
        ? require('../../assets/home/hp_bg_eth.png')
        : require('../../assets/home/hp_bg.png');
    return (
      <View style={styles.container}>
        <StatusBarComponent barStyle={this.state.statusbarStyle} />
        <MyAlertComponent
          visible={this.state.versionUpdateModalVisible}
          title={I18n.t('toast.update_tip')}
          contents={this.versionUpdateInfo ? this.versionUpdateInfo.contents : []}
          leftBtnTxt={I18n.t('modal.cancel')}
          rightBtnTxt={I18n.t('toast.go_update')}
          leftPress={this.versionUpdateLeftPress}
          rightPress={this.versionUpdateRightPress}
        />
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: Colors.themeColor,
            height: headerHeight,
            zIndex: headerZindex,
          }}
        >
          <Animated.Image
            onLoad={() =>
              this.setState({ headBgImageRef: findNodeHandle(this.refs.headBackgroundImage) })
            }
            ref={this.headBackgroundImageRef}
            style={{
              height: LayoutConstants.HOME_HEADER_MAX_HEIGHT,
              width: LayoutConstants.WINDOW_WIDTH,
              transform: [{ translateY: headerBgImageTranslateY }, { scale: headerBgImageScale }],
            }}
            source={topBg}
          />
          <Animated.View
            style={{
              position: 'absolute',
              left: 20,
              top: LayoutConstants.DEVICE_IS_IPHONE_X() ? 55 : 35,
              opacity: headerTextOpacity,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: 'white',
                // marginTop: 3,
                fontSize: 16,
                lineHeight: 16,
              }}
            >
              {I18n.t('home.total_assets')}
            </Text>
            <Text
              style={{
                marginTop: 3,
                marginLeft: 8,
                color: 'white',
                fontWeight: '400',
                fontSize: 18,
                lineHeight: 18,
              }}
            >
              {this.state.isTotalAssetsHidden
                ? '****'
                : `${this.state.monetaryUnitSymbol + this.props.totalAssets}`}
            </Text>
          </Animated.View>
        </Animated.View>
        <SwipeableFlatList
          maxSwipeDistance={80}
          bounceFirstRowOnMount={false}
          renderQuickActions={this.renderQuickActions}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scroollY } } },
          ])}
          ItemSeparatorComponent={ItemDivideComponent}
          ListEmptyComponent={EmptyComponent}
          getItemLayout={(data, index) => ({ length: 50, offset: 60 * index, index })}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          data={this.props.tokens}
          refreshControl={
            <RefreshControl
              onRefresh={this.onRefresh}
              refreshing={this.state.isRefreshing}
              colors={[Colors.themeColor]}
              tintColor={Colors.whiteBackgroundColor}
            />
          }
          ListHeaderComponent={
            <HeadView
              onAddAssets={() => {
                this.pushAddtoken();
              }}
              onQRCode={() => {
                this.props.navigation.navigate('ReceiptCode');
              }}
              onHideAssets={() => {
                this.setState(previousState => {
                  HomeScreen.saveIsTotalAssetsHiddenToStorage(!previousState.isTotalAssetsHidden);
                  return { isTotalAssetsHidden: !previousState.isTotalAssetsHidden };
                });
              }}
              walletName={this.props.wallet.name}
              address={HomeScreen.formatAddress(this.props.wallet.address)}
              totalAssets={
                this.state.isTotalAssetsHidden
                  ? '****'
                  : `${this.state.monetaryUnitSymbol + this.props.totalAssets}`
              }
              hideAssetsIcon={this.state.isTotalAssetsHidden ? hiddenIconInvi : hiddenIconVi}
              QRCodeIcon={require('../../assets/home/hp_qrc.png')}
              isHaveAddTokenBtn={this.props.wallet.type === 'eth'}
              addAssetsIcon={require('../../assets/home/plus_icon.png')}
            />
          }
        />
        <ImageButton
          btnStyle={{
            right: 17,
            width: 33,
            height: (23 / 16) * 13 + 10,
            top: LayoutConstants.DEVICE_IS_IPHONE_X() ? 55 : 35,
            position: 'absolute',
            zIndex: 2,
          }}
          imageStyle={{ width: 23, height: (23 / 16) * 13 }}
          onClick={() => {
            this.showDrawer();
          }}
          backgroundImageSource={require('../../assets/home/hp_menu.png')}
        />

        {/* <ChangeNetwork
                    open={this.state.changeNetworkShow}
                    close={() => {
                        this.setState({
                            changeNetworkShow: false
                        })
                    }}
                    onClick={(network) => {
                        this.props.setNetWork(network)
                        this.changeNetworkDone()
                    }}
                /> */}
      </View>
    );
  };
}

const mapStateToProps = state => ({
  tokens: state.Core.tokens,
  totalAssets: state.Core.totalAssets,
  wallet: state.Core.wallet,
  monetaryUnit: state.Core.monetaryUnit,
  isNewWallet: state.Core.isNewWallet,
  myLanguage: state.Core.myLanguage,
  network: state.Core.network,
  allTokens: state.Core.allTokens,
});

const mapDispatchToProps = dispatch => ({
  setNetWork: network => dispatch(setNetWork(network)),
  removeToken: token => dispatch(removeToken(token)),
  setTotalAssets: totalAssets => dispatch(setTotalAssets(totalAssets)),
  setIsNewWallet: isNewWallet => dispatch(setIsNewWallet(isNewWallet)),
  setAllTokens: allTokens => dispatch(setAllTokens(allTokens)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
