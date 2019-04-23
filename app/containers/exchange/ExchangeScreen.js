import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  Animated,
  View,
  DeviceEventEmitter,
  Platform,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import lodash from 'lodash';
import I18n from 'react-native-i18n';
import DeviceInfo from 'react-native-device-info';
import { showToast } from '../../utils/Toast';
import { ExchangeCell, ExchangeEmptyComponent } from './component/ExchangeCell';
import { ItemDivideComponent } from '../home/component/HomeCell';
import ExchangeHeadView from './component/ExchangeHeadView';
import StatusBarComponent from '../../components/StatusBarComponent';
import { Colors, TransferGasLimit } from '../../config/GlobalConfig';
import LayoutConstants from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';
import ExchangeFlatListModal from './component/ExchangeFlatListModal';
import ExchangeStepModal from './component/ExchangeStepModal';
import NetworkManager from '../../utils/NetworkManager';
import { defaultSupportExchangeTokens } from '../../utils/Constants';
import store from '../../config/store/ConfigureStore';
import { setCreateWalletParams, setExchangeDepositStatus } from '../../config/action/Actions';
import KeystoreUtils from '../../utils/KeystoreUtils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

class ExchangeScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      recordList: [],
      depositCoinArray: [],
      receiveCoinArray: [],
      depositWalletArray: [],
      receiveWalletArray: [],
      currentDepositCoin: '',
      currentReceiveCoin: '',
      currentDepositWallet: '',
      currentReceiveWallet: '',
      depositInputValue: '',
      receiveInputValue: '',
      depositMax: '',
      depositMin: '',
      instantRate: '',
      depositCoinFeeAmt: '',
      platformAddr: '',
      statusbarStyle: 'light-content',
      scroollY: new Animated.Value(0),
      isRefreshing: false,
    };
    this.listRef = React.createRef();
    this.depositInput = 0;
    this.receiveInput = 0;
  }

  // 钱包改变，重置币种列表
  reSetCoinList = async isDeposit => {
    try {
      let newCoinList = [];
      let newCurrentCoin = '';
      const depositCoinList = lodash.cloneDeep(
        defaultSupportExchangeTokens.filter(token => token.symbol !== (isDeposit ? 'ITC' : 'ETH'))
      );
      if (this.state.currentDepositWallet === '' && this.state.currentReceiveWallet === '') {
        newCoinList = depositCoinList;
        newCoinList.some(coin => {
          if (coin.symbol === (isDeposit ? 'ETH' : 'ITC')) {
            coin.isSelect = true;
            return true;
          }
          return false;
        });
        newCurrentCoin = isDeposit
          ? defaultSupportExchangeTokens[0]
          : defaultSupportExchangeTokens[1];
      } else {
        newCoinList = await Promise.all(
          depositCoinList.map(async coin => {
            coin.balance = await NetworkManager.getBalanceOfETH(
              isDeposit ? this.state.currentDepositWallet : this.state.currentReceiveWallet,
              {
                address: coin.address,
                symbol: coin.symbol,
                decimal: coin.decimal,
              }
            );
            if (isDeposit ? coin.symbol === 'ETH' : coin.symbol === 'ITC') {
              coin.isSelect = true;
              newCurrentCoin = coin;
            } else {
              coin.isSelect = false;
            }
            return coin;
          })
        );
      }
      if (isDeposit) {
        this.setState({ depositCoinArray: newCoinList, currentDepositCoin: newCurrentCoin });
      } else {
        this.setState({ receiveCoinArray: newCoinList, currentReceiveCoin: newCurrentCoin });
      }
    } catch (e) {
      console.log('reSetCoinList catch err:', e);
    }
  };

  // 代币类型选择
  updateCoinList = (isDeposit, item) => {
    if (isDeposit) {
      this.setState(
        preState => ({
          currentDepositCoin: item,
          depositCoinArray: preState.depositCoinArray.map(coin => {
            if (coin.id === item.id) {
              coin.isSelect = true;
            } else {
              coin.isSelect = false;
            }
            return coin;
          }),
          receiveCoinArray: (() => {
            const newReceiveCoinArray = preState.receiveCoinArray.filter(
              coin => coin.id !== item.id
            );
            newReceiveCoinArray.splice(
              defaultSupportExchangeTokens.findIndex(
                coin => coin.id === preState.currentDepositCoin.id
              ),
              0,
              { ...preState.currentDepositCoin, isSelect: false }
            );
            return newReceiveCoinArray;
          })(),
        }),
        () => {
          // 更新汇率
          this.updateCoinInfo(
            this.state.currentDepositCoin.symbol,
            this.state.currentReceiveCoin.symbol
          );
        }
      );
    } else {
      this.setState(
        preState => ({
          currentReceiveCoin: item,
          receiveCoinArray: preState.receiveCoinArray.map(coin => {
            if (coin.id === item.id) {
              coin.isSelect = true;
            } else {
              coin.isSelect = false;
            }
            return coin;
          }),
          depositCoinArray: (() => {
            const newDepositCoinArray = preState.depositCoinArray.filter(
              coin => coin.id !== item.id
            );
            newDepositCoinArray.splice(
              defaultSupportExchangeTokens.findIndex(
                coin => coin.id === preState.currentReceiveCoin.id
              ),
              0,
              { ...preState.currentReceiveCoin, isSelect: false }
            );
            return newDepositCoinArray;
          })(),
        }),
        () => {
          // 更新汇率
          this.updateCoinInfo(
            this.state.currentDepositCoin.symbol,
            this.state.currentReceiveCoin.symbol
          );
        }
      );
    }
  };

  updateWalletList = (isDeposit, item) => {
    let newWalletList = [];
    if (!item) {
      // 初始化或添加钱包
      const ethWalletLit = lodash.cloneDeep(this.props.ethWallets);
      const { wallet } = store.getState().Core;
      if (ethWalletLit.length === 0) {
        this.reSetCoinList(isDeposit);
        return;
      }
      if (wallet.type === 'eth') {
        newWalletList = ethWalletLit.map(ethWallet => {
          if (wallet.address === ethWallet.address) {
            ethWallet.isSelect = true;
            if (isDeposit) {
              this.setState({ currentDepositWallet: ethWallet }, () => {
                this.reSetCoinList(isDeposit);
              });
            } else {
              this.setState({ currentReceiveWallet: ethWallet }, () => {
                this.reSetCoinList(isDeposit);
              });
            }
            return ethWallet;
          }
          ethWallet.isSelect = false;
          return ethWallet;
        });
      } else {
        newWalletList = ethWalletLit.map((ethWallet, index) => {
          if (index === 0) {
            ethWallet.isSelect = true;
            if (isDeposit) {
              this.setState({ currentDepositWallet: ethWallet }, () => {
                this.reSetCoinList(isDeposit);
              });
            } else {
              this.setState({ currentReceiveWallet: ethWallet }, () => {
                this.reSetCoinList(isDeposit);
              });
            }
            return ethWallet;
          }
          ethWallet.isSelect = false;
          return ethWallet;
        });
      }
    } else {
      // 点击选择
      const preDepositWalletlist = lodash.cloneDeep(
        isDeposit ? this.state.depositWalletArray : this.state.receiveWalletArray
      );
      newWalletList = preDepositWalletlist.map(ethWallet => {
        if (ethWallet.address === item.address) {
          if (isDeposit) {
            this.setState({ currentDepositWallet: ethWallet }, () => {
              this.reSetCoinList(isDeposit);
            });
          } else {
            this.setState({ currentReceiveWallet: ethWallet }, () => {
              this.reSetCoinList(isDeposit);
            });
          }
          ethWallet.isSelect = true;
          return ethWallet;
        }
        ethWallet.isSelect = false;
        return ethWallet;
      });
    }
    if (isDeposit) {
      this.setState({ depositWalletArray: newWalletList });
    } else {
      this.setState({ receiveWalletArray: newWalletList });
    }
  };

  updateCoinInfo = async (depositCoinCode, receiveCoinCode) => {
    await NetworkManager.getBaseInfo({
      depositCoinCode,
      receiveCoinCode,
    })
      .then(getBaseInfoData => {
        if (getBaseInfoData.resCode === '800') {
          const dataInfo = getBaseInfoData.data;
          this.setState({
            depositMax: dataInfo.depositMax,
            depositMin: dataInfo.depositMin,
            instantRate: dataInfo.instantRate,
            depositInputValue: '',
            receiveInputValue: '',
          });
        } else {
          showToast(getBaseInfoData.resMsg, 30);
        }
      })
      .catch(e => {
        DeviceEventEmitter.emit('netRequestErr', e);
      });
  };

  getCurrentGas = async () => {
    const gasPrice = await NetworkManager.getSuggestGasPrice(this.state.currentDepositWallet);
    return this.state.currentDepositWallet.symbol === 'ETH'
      ? gasPrice * 0.001 * 0.001 * 0.001 * TransferGasLimit.ethGasLimit
      : gasPrice * 0.001 * 0.001 * 0.001 * TransferGasLimit.tokenGasLimit;
  };

  checkBalance = async () => {
    if (this.depositInput > parseFloat(this.state.currentDepositCoin.balance)) {
      showToast('余额不足', 20);
      return false;
    }
    if (
      this.depositInput < parseFloat(this.state.depositMin) ||
      this.depositInput > parseFloat(this.state.depositMax)
    ) {
      showToast(`兑换范围${this.state.depositMin}-${this.state.depositMax}`, 30);
      return false;
    }
    if (this.state.currentDepositCoin.symbol === 'ETH') {
      if (
        parseFloat(this.state.currentDepositCoin.balance) - this.depositInput <
        (await this.getCurrentGas())
      ) {
        showToast('服务费不足', 30);
        return false;
      }
    } else if (
      (await NetworkManager.getEthBalance(this.state.currentDepositWallet.address)) <
      (await this.getCurrentGas())
    ) {
      showToast('服务费不足', 30);
      return false;
    }
    return true;
  };

  requestExchange = async params => {
    await NetworkManager.accountExchange(params)
      .then(accountExchangeData => {
        if (accountExchangeData.resCode === '800') {
          this.props.setExchangeDepositStatus(false);
          this.setState(
            {
              depositCoinFeeAmt: accountExchangeData.data.depositCoinFeeAmt,
              platformAddr: accountExchangeData.data.platformAddr,
            },
            () => {
              this.modalExchangeStep.showStepView();
            }
          );
        } else {
          showToast(accountExchangeData.resMsg, 30);
        }
        this._hideLoading();
      })
      .catch(e => {
        DeviceEventEmitter.emit('netRequestErr', e);
      });
  };

  updateOrderList = async () => {
    await NetworkManager.queryAllTrade({
      equipmentNo: DeviceInfo.getUniqueID(),
      sourceType: Platform.OS.toUpperCase(),
      pageNo: 1,
      pageContent: 100,
    })
      .then(rsp => {
        if (rsp.resCode === '800') {
          this.setState({
            recordList: rsp.data.pageContent,
          });
        } else {
          showToast(rsp.resMsg, 30);
        }
      })
      .catch(e => {
        DeviceEventEmitter.emit('netRequestErr', e);
      });
  };

  getPriKey = async password => {
    try {
      return await KeystoreUtils.getPrivateKey(
        password,
        this.state.currentDepositWallet.address,
        this.state.currentDepositWallet.type
      );
    } catch (err) {
      showToast('check privateKey error', 30);
      return null;
    }
  };

  startSendTransaction = async privateKey => {
    let txHash;
    try {
      await NetworkManager.sendTransaction(
        {
          address: this.state.currentDepositCoin.address,
          symbol: this.state.currentDepositCoin.symbol,
          decimal: this.state.currentDepositCoin.decimal,
        },
        this.state.platformAddr,
        this.depositInput,
        await NetworkManager.getSuggestGasPrice(this.state.currentDepositWallet),
        privateKey,
        async hash => {
          txHash = hash;
        },
        true,
        this.state.currentDepositWallet.address
      );
    } catch (e) {
      this._hideLoading();
      showToast('transaction error', 30);
    }
    await this.updateOrderList();
    this.updateWalletList(true);
    this.updateWalletList(false);
    this._hideLoading();
    if (txHash) {
      showToast('存币成功', -30);
      this.props.setExchangeDepositStatus(true);
    } else {
      showToast('存币失败', -30);
    }
  };

  onRefresh = async () => {
    this.setState({
      isRefreshing: true,
    });
    await this.updateCoinInfo(
      this.state.currentDepositCoin.symbol,
      this.state.currentReceiveCoin.symbol
    );
    await this.updateOrderList();
    this.updateWalletList(true);
    this.updateWalletList(false);
    this.setState({
      isRefreshing: false,
    });
  };

  _changeWalletEmitter = () => {
    this.updateWalletList(true);
    this.updateWalletList(false);
  };

  componentWillMount() {
    super.componentWillMount();
    this._isMounted = true;
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this._isMounted = false;
  }

  componentDidMount() {
    super.componentDidMount();
    this.updateWalletList(true);
    this.updateWalletList(false);
    this.updateCoinInfo('ETH', 'ITC');
    this.updateOrderList();
  }

  renderItem = item => <ExchangeCell item={item} onClick={() => this.onClickCell(item)} />;

  onClickCell = item => {
    const orderItem = item.item;
    this.props.navigation.navigate('ExchangeDetail', { orderItem });
  };

  renderComponent = () => {
    const {
      recordList,
      depositCoinArray,
      depositWalletArray,
      receiveCoinArray,
      receiveWalletArray,
      statusbarStyle,
      scroollY,
    } = this.state;
    const topBg = require('../../assets/exchange/bg1.png');
    const headerHeight = scroollY.interpolate({
      inputRange: [
        -LayoutConstants.WINDOW_HEIGHT + LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT,
        0,
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT - LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT,
      ],
      outputRange: [
        LayoutConstants.WINDOW_HEIGHT,
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT,
        LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT,
      ],
      extrapolate: 'clamp',
    });
    const headerZindex = scroollY.interpolate({
      inputRange: [
        0,
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT - LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT,
      ],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const headerTextOpacity = scroollY.interpolate({
      inputRange: [
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT -
          LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT -
          20,
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT - LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT,
      ],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const headerBgImageScale = scroollY.interpolate({
      inputRange: [
        -LayoutConstants.WINDOW_HEIGHT + LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT,
        0,
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT - LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT,
      ],
      outputRange: [
        LayoutConstants.WINDOW_HEIGHT / LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT + 1.1,
        1,
        1,
      ],
      extrapolate: 'clamp',
    });

    const headerBgImageTranslateY = scroollY.interpolate({
      inputRange: [
        -LayoutConstants.WINDOW_HEIGHT + LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT,
        0,
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT - LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT,
      ],
      outputRange: [
        0,
        0,
        -(LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT - LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT),
      ],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.container}>
        <StatusBarComponent barStyle={statusbarStyle} />
        <ExchangeFlatListModal
          ref={modalCoinList => {
            this.modalCoinListDeposit = modalCoinList;
          }}
          items={depositCoinArray}
          selectCategory="coinSelect"
          onSelect={item => {
            if (item.item.id !== this.state.currentDepositCoin.id) {
              this.updateCoinList(true, item.item);
            }
            this.modalCoinListDeposit.closeFlatModal();
          }}
        />
        <ExchangeFlatListModal
          ref={modalCoinList => {
            this.modalCoinListReceive = modalCoinList;
          }}
          items={receiveCoinArray}
          selectCategory="coinSelect"
          onSelect={item => {
            if (item.item.id !== this.state.currentReceiveCoin.id) {
              this.updateCoinList(false, item.item);
            }
            this.modalCoinListReceive.closeFlatModal();
          }}
        />
        <ExchangeFlatListModal
          ref={modalWalletList => {
            this.modalWalletListDeposit = modalWalletList;
          }}
          items={depositWalletArray}
          selectCategory="walletSelect"
          onEmptyCreatWallet={() => {
            // 创建eth钱包
            this.modalWalletListDeposit.closeFlatModal();
            const params = {
              walletType: 'eth',
              from: 1,
            };
            store.dispatch(setCreateWalletParams(params));
            this.props.navigation.navigate('CreateWallet');
          }}
          onSelect={item => {
            if (item.item.address !== this.state.currentDepositWallet.address) {
              this.updateWalletList(true, item.item);
            }
            this.modalWalletListDeposit.closeFlatModal();
          }}
        />
        <ExchangeFlatListModal
          ref={modalWalletList => {
            this.modalWalletListReceive = modalWalletList;
          }}
          items={receiveWalletArray}
          selectCategory="walletSelect"
          onEmptyCreatWallet={() => {
            // 创建eth钱包
            this.modalWalletListDeposit.closeFlatModal();
            const params = {
              walletType: 'eth',
              from: 1,
            };
            store.dispatch(setCreateWalletParams(params));
            this.props.navigation.navigate('CreateWallet');
          }}
          onSelect={item => {
            if (item.item.address !== this.state.currentReceiveWallet.address) {
              this.updateWalletList(false, item.item);
            }
            this.modalWalletListReceive.closeFlatModal();
          }}
        />
        <ExchangeStepModal
          ref={modalExchangeStep => {
            this.modalExchangeStep = modalExchangeStep;
          }}
          didTapSurePasswordBtn={async password => {
            const priKey = await this.getPriKey(password);
            if (priKey == null) {
              showToast(I18n.t('modal.password_error'), 30);
            } else {
              this.modalExchangeStep.closeStepView();
              this._showLoading();
              await this.startSendTransaction(priKey);
            }
          }}
          onCancelClick={() => {
            this.modalExchangeStep.closeStepView();
            this.updateOrderList();
            showToast('订单尙未完成，可在兑换记录中查看详情继续', 30);
          }}
          depositSymbol={this.state.currentDepositCoin.symbol}
          receiveSymbol={this.state.currentReceiveCoin.symbol}
          depositValue={this.depositInput}
          receiveValue={this.receiveInput}
          instantRate={this.state.instantRate}
          fromAddress={this.state.currentDepositWallet.address}
          depositCoinFeeAmt={this.state.depositCoinFeeAmt}
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
            style={{
              height: LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT,
              width: LayoutConstants.WINDOW_WIDTH,
              transform: [{ translateY: headerBgImageTranslateY }, { scale: headerBgImageScale }],
            }}
            source={topBg}
          />
          <Animated.View
            style={{
              position: 'absolute',
              left: (LayoutConstants.WINDOW_WIDTH - 200) / 2,
              top: LayoutConstants.DEVICE_IS_IPHONE_X() ? 55 : 35,
              opacity: headerTextOpacity,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                width: 200,
                color: 'white',
                fontSize: 13,
                lineHeight: 16,
                textAlign: 'center',
              }}
              onPress={() => {
                this.listRef.current.scrollToOffset(0);
              }}
            >
              {`1 ${this.state.currentDepositCoin.symbol} ≈ ${parseFloat(
                this.state.instantRate
              ).toFixed(6)} ${this.state.currentReceiveCoin.symbol}`}
            </Text>
          </Animated.View>
        </Animated.View>
        <FlatList
          renderItem={this.renderItem}
          data={recordList}
          ref={this.listRef}
          ItemSeparatorComponent={ItemDivideComponent}
          ListEmptyComponent={ExchangeEmptyComponent}
          refreshControl={
            <RefreshControl
              onRefresh={this.onRefresh}
              refreshing={this.state.isRefreshing}
              colors={[Colors.themeColor]}
              tintColor={Colors.whiteBackgroundColor}
            />
          }
          ListHeaderComponent={
            <ExchangeHeadView
              currentDepositCoin={this.state.currentDepositCoin}
              currentReceiveCoin={this.state.currentReceiveCoin}
              currentDepositWallet={
                this.state.currentDepositWallet === ''
                  ? { name: '创建ETH钱包' }
                  : this.state.currentDepositWallet
              }
              currentReceiveWallet={
                this.state.currentReceiveWallet === ''
                  ? { name: '创建ETH钱包' }
                  : this.state.currentReceiveWallet
              }
              depositInputValue={this.state.depositInputValue}
              receiveInputValue={this.state.receiveInputValue}
              depositPlaceholder={
                this.state.depositMin !== ''
                  ? `范围${this.state.depositMin}-${this.state.depositMax}`
                  : ''
              }
              receivePlaceholder=""
              titleInstantRate={`1 ${this.state.currentDepositCoin.symbol} ≈ ${
                this.state.instantRate !== ''
                  ? parseFloat(this.state.instantRate).toFixed(6)
                  : 'unkown'
              } ${this.state.currentReceiveCoin.symbol}`}
              onDepositInputChange={value => {
                this.depositInput = value === '' ? 0 : parseFloat(value).toFixed(6);
                this.receiveInput = (value === ''
                  ? 0
                  : parseFloat(value) * parseFloat(this.state.instantRate)
                ).toFixed(6);
                this.setState({
                  depositInputValue: value,
                  receiveInputValue: this.receiveInput.toString(),
                });
              }}
              onReceiveInputChange={value => {
                this.receiveInput = value === '' ? 0 : parseFloat(value).toFixed(6);
                this.depositInput = (value === ''
                  ? 0
                  : parseFloat(value) / parseFloat(this.state.instantRate)
                ).toFixed(6);
                this.setState({
                  depositInputValue: this.depositInput.toString(),
                  receiveInputValue: value,
                });
              }}
              onCoinTypeSelectDeposit={() => {
                this.modalCoinListDeposit.showFlatModal();
              }}
              onCoinTypeSelectRecevie={() => {
                this.modalCoinListReceive.showFlatModal();
              }}
              onWalletSelectDeposit={() => {
                this.modalWalletListDeposit.showFlatModal();
              }}
              onWalletSelectRecevie={() => {
                this.modalWalletListReceive.showFlatModal();
              }}
              onExchange={async () => {
                this._showLoading();
                if (await this.checkBalance()) {
                  // 验证通过
                  const params = {
                    equipmentNo: DeviceInfo.getUniqueID(),
                    sessionUuid: '',
                    sourceType: Platform.OS.toUpperCase(),
                    userNo: '',
                    depositCoinCode: this.state.currentDepositCoin.symbol,
                    receiveCoinCode: this.state.currentReceiveCoin.symbol,
                    depositCoinAmt: this.depositInput.toString(),
                    receiveCoinAmt: this.receiveInput.toString(),
                    receiveSwftAmt: '0',
                    destinationAddr: this.state.currentReceiveWallet.address,
                    refundAddr: this.state.currentDepositWallet.address,
                  };
                  await this.requestExchange(params);
                } else {
                  this._hideLoading();
                }
              }}
            />
          }
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scroollY } } }])}
          scrollEventThrottle={16}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={(data, index) => ({ length: 50, offset: 60 * index, index })}
        />
      </View>
    );
  };
}

const mapStateToProps = state => ({
  ethWallets: state.Core.ethWalletList,
});

const mapDispatchToProps = dispatch => ({
  setExchangeDepositStatus: depositStatus => dispatch(setExchangeDepositStatus(depositStatus)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeScreen);
