import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Keyboard,
} from 'react-native';

import PropTypes from 'prop-types';
import I18n from 'react-native-i18n';
import { Colors, TransferGasLimit, TransferType } from '../../config/GlobalConfig';
import TransactionStep from './TransactionStep';
import NetworkManager from '../../utils/NetworkManager';
import store from '../../config/store/ConfigureStore';
import Layout from '../../config/LayoutConstants';
import { BlueButtonBig } from '../../components/Button';
import Slider from '../../components/Slider';
import { androidPermission } from '../../utils/PermissionsAndroid';
import KeystoreUtils from '../../utils/KeystoreUtils';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import BaseComponent from '../base/BaseComponent';
import { showToast } from '../../utils/Toast';
import StaticLoading from '../../components/StaticLoading';
import { getMonetaryUnitSymbol } from '../../utils/CommonUtil';
import { setNewTransaction } from '../../config/action/Actions';
import Analytics from '../../utils/Analytics';

const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  contentBox: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  sectionView: {
    marginTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  sectionViewTopView: {
    flexDirection: 'row',
  },
  sectionViewBottomView: {
    justifyContent: 'center',
  },
  shadowStyle: {
    shadowColor: '#A9A9A9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    // elevation: 3
  },
  sectionViewTitleText: {
    flex: 1,
    fontSize: 13,
    color: Colors.fontBlackColor_43,
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },

  infoViewDetailTitleTouchable: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    paddingTop: 10,
    paddingBottom: 10,
  },
  blueText: {
    color: Colors.fontBlueColor,
    fontSize: 13,
    textAlign: 'center',
  },
  sectionViewTextInput: {
    fontSize: 13,
    color: Colors.fontBlackColor_43,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  sliderBottomView: {
    marginTop: 12,
    marginLeft: 0,
    marginRight: 0,
    height: 140,
    backgroundColor: 'white',
  },
  sliderTitleContainerView: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ScreenWidth,
  },
  sliderTitle: {
    marginLeft: 20,
    color: Colors.fontBlackColor,
  },
  buttonTitle: {
    fontSize: 20,
    color: Colors.fontWhiteColor,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sliderContainerView: {
    width: ScreenWidth - 50 * 2 + 20,
    height: 40,
    marginTop: 20,
    marginLeft: 50,
    paddingLeft: 10,
    paddingRight: 10,
  },
  sliderAlertView: {
    alignSelf: 'center',
    width: ScreenWidth - 80,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transferPrice: {
    textAlign: 'center',
    color: Colors.fontGrayColor_a,
  },
  buttonBox: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 80,
  },

  amountBox: {
    width: Layout.WINDOW_WIDTH,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 10,
    marginTop: 12,
  },
  amountTitle: {
    color: Colors.fontBlackColor_43,
    marginBottom: 12,
  },
  amountInputBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  amountInput: {
    flex: 1,
    fontSize: 30,
    color: Colors.fontBlackColor_43,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  amountType: {
    fontSize: 20,
    color: Colors.fontBlueColor,
    marginBottom: 5,
  },
  curBalanceBox: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  curBalance: {
    color: Colors.fontGrayColor_a,
    fontSize: 13,
  },
  sendAll: {
    height: 40,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  sendAllTxt: {
    color: Colors.fontBlueColor,
    fontSize: 13,
  },
  vLine: {
    width: Layout.WINDOW_WIDTH - 40,
    height: 1,
    backgroundColor: Colors.bgGrayColor_e5,
  },
});

const sliderStyle = StyleSheet.create({
  track: {
    height: 14,
    borderRadius: 7,
  },
  thumb: {
    width: 28,
    height: 28,
    borderRadius: 28 / 2,
    backgroundColor: 'white',
    shadowColor: '#808080',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.45,
    elevation: 5,
  },
});

class InfoView extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    returnKeyType: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    detailTitle: PropTypes.string,
    detailTitlePress: PropTypes.func,
    keyboardType: PropTypes.string,
    defaultValue: PropTypes.string,
  };

  static defaultProps = {
    barStyle: 'dark-content',
  };

  render() {
    const {
      title,
      detailTitlePress,
      detailTitle,
      placeholder,
      returnKeyType,
      keyboardType,
      onChangeText,
      defaultValue,
    } = this.props;
    return (
      <View style={styles.sectionView}>
        <View style={styles.sectionViewTopView}>
          <Text style={styles.sectionViewTitleText}>{title}</Text>
          <TouchableOpacity
            style={styles.infoViewDetailTitleTouchable}
            activeOpacity={0.6}
            disabled={detailTitlePress === undefined}
            onPress={detailTitlePress}
          >
            <Text style={styles.blueText}>{detailTitle}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.sectionViewBottomView /* Platform.OS === 'ios' ? styles.shadowStyle : {} */,
          ]}
        >
          <TextInput
            style={styles.sectionViewTextInput}
            placeholderTextColor={Colors.fontGrayColor_a0}
            placeholder={placeholder}
            returnKeyType={returnKeyType}
            keyboardType={keyboardType}
            onChangeText={onChangeText}
            multiline
          >
            {defaultValue}
          </TextInput>
        </View>
      </View>
    );
  }
}

class SliderView extends Component {
  static propTypes = {
    gasStr: PropTypes.string.isRequired,
    minGasPrice: PropTypes.number.isRequired,
    maxGasPrice: PropTypes.number.isRequired,
    initValue: PropTypes.number.isRequired,
    onValueChange: PropTypes.func.isRequired,
  };

  render() {
    const { onValueChange, initValue, minGasPrice, maxGasPrice, gasStr } = this.props;
    return (
      <View style={[styles.sliderBottomView /* styles.shadowStyle */]}>
        <View style={styles.sliderTitleContainerView}>
          <Text style={styles.sliderTitle}>{I18n.t('transaction.miner_fee')}</Text>
        </View>
        <View style={styles.sliderContainerView}>
          <Slider
            style={sliderStyle.container}
            trackStyle={sliderStyle.track}
            thumbStyle={sliderStyle.thumb}
            minimumTrackTintColor={Colors.themeColor}
            maximumTrackTintColor={Colors.fontGrayColor}
            thumbTouchSize={{ width: 30, height: 24 }}
            onValueChange={onValueChange}
            value={initValue}
            minimumValue={minGasPrice}
            maximumValue={maxGasPrice}
            step={1}
          />
        </View>
        <View style={styles.sliderAlertView}>
          <Text>{I18n.t('transaction.slow')}</Text>
          <Text style={styles.transferPrice}>{gasStr}</Text>
          <Text style={{ alignSelf: 'flex-end' }}>{I18n.t('transaction.fast')}</Text>
        </View>
      </View>
    );
  }
}

export default class Transaction extends BaseComponent {
  constructor(props) {
    super(props);
    // 参数
    const params = store.getState().Core.walletTransfer;
    this.didTapSurePasswordBtn = this.didTapSurePasswordBtn.bind(this);
    this.didTapNextBtn = this.didTapNextBtn.bind(this);
    this.getPriceTitle = this.getPriceTitle.bind(this);
    this.sliderValueChanged = this.sliderValueChanged.bind(this);
    this.getDetailPriceTitle = this.getDetailPriceTitle.bind(this);
    this.params = params;

    this.timeInterval = null;
    this.timeIntervalCount = 0;

    this.state = {
      transferType: params.transferType,
      minGasPrice: 1,
      maxGasPrice: 100,
      currentGas: params.suggestGasPrice,
      gasStr: this.getPriceTitle(params.suggestGasPrice),
      transferValue: undefined,
      toAddress: '',
      fromAddress: params.fromAddress,
      detailData: '',
      isDisabled: true,

      isShowSLoading: false,
      sLoadingContent: '',
    };
  }

  componentWillMount() {
    super.componentWillMount();
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    super.componentWillUnmount();
  }

  /** static navigationOptions = ({navigation}) => ({
        header:<WhiteBgHeader navigation={navigation} text={ComponentTitle()}/>
    })* */

  getPriceTitle = gasPrice => {
    const { wallet } = store.getState().Core;
    const totalGas = this.getGas(gasPrice);
    // let totalGasPrice = totalGas * ethPrice;
    // totalGasPrice = totalGasPrice.toFixed(8);
    // return totalGas + "ether≈" + totalGasPrice + "$";

    const totalGasPrice = (this.params.ethPrice * totalGas).toFixed(6);
    const walletType = wallet.type === 'itc' ? ' itc' : ' ether';
    const gasStr = `${totalGas + walletType} ≈ ${getMonetaryUnitSymbol()}${totalGasPrice}`;

    return gasStr;
  };

  getDetailPriceTitle = () => {
    const gasLimit = this.getGas();
    // let totalGas = this.state.currentGas * 0.001 * 0.001 * 0.001 * gasLimit;
    // totalGas = Number(totalGas.toFixed(8));

    return `=Gas(${gasLimit})*Gas Price(${this.state.currentGas})gwei`;
  };

  getGas = gasPrice => {
    const { wallet } = store.getState().Core;
    let gasLimit;
    if (wallet.type === 'itc') {
      gasLimit = TransferGasLimit.itcGasLimit;
    } else if (wallet.type === 'eth') {
      gasLimit =
        this.params.transferType === TransferType.ETH
          ? TransferGasLimit.ethGasLimit
          : TransferGasLimit.tokenGasLimit;
    }
    if (gasPrice === undefined) {
      return gasLimit;
    }
    let totalGas = gasPrice * 0.001 * 0.001 * 0.001 * gasLimit;
    totalGas = Number(totalGas.toFixed(8));
    return totalGas;
  };

  async startSendTransaction(privateKey) {
    Analytics.recordClick('Transaction', 'startSendTransaction');
    try {
      const { address, symbol, decimal } = store.getState().Core.balance;

      const currentBlock = await NetworkManager.getCurrentBlockNumber();
      await NetworkManager.sendTransaction(
        {
          address,
          symbol,
          decimal,
        },
        this.state.toAddress,
        this.state.transferValue,
        this.state.currentGas,
        privateKey,
        hash => {
          if (hash === null) {
            this.hideLoading();
            this._showAlert(I18n.t('transaction.alert_1'));
            return;
          }
          const { wallet } = store.getState().Core;
          const timestamp = new Date().getTime();

          let gasLimit;
          if (wallet.type === 'itc') {
            gasLimit = TransferGasLimit.itcGasLimit;
          } else if (wallet.type === 'eth') {
            gasLimit =
              this.params.transferType === TransferType.ETH
                ? TransferGasLimit.ethGasLimit
                : TransferGasLimit.tokenGasLimit;
          }
          let totalGas = this.state.currentGas * 0.001 * 0.001 * 0.001 * gasLimit;
          totalGas = totalGas.toFixed(8);
          const txHash = hash.indexOf('0x') === -1 ? `0x${hash}` : hash;
          const newTransaction = {
            from: wallet.address,
            to: this.state.toAddress,
            timeStamp: timestamp.toString(),
            hash: txHash,
            value: this.state.transferValue,
            isError: '0',
            gasPrice: totalGas,
            blockNumber: currentBlock,
            symbol,
          };
          store.dispatch(setNewTransaction(newTransaction));
          this.hideLoading();

          // 回调刷新
          this.props.navigation.state.params.onGoBack();
          this.props.navigation.goBack();
        }
      );
    } catch (err) {
      this.hideLoading();
    }

    // if (!res) {
    //     setTimeout(() => {
    // alert(I18n.t('transaction.alert_1'));
    //         this._showAlert(I18n.t('transaction.alert_1'))
    //     }, 100);
    // }
  }

  changeLoading(num, password) {
    let content = '';
    if (num === 1) {
      content = I18n.t('transaction.getting_key');
    } else if (num === 2) {
      content = I18n.t('transaction.signing_transaction');
    } else {
      content = I18n.t('transaction.broadcasting_transaction');
    }
    this.setState({
      isShowSLoading: true,
      sLoadingContent: content,
    });
    if (num === 3) {
      clearInterval(this.timeInterval);
      setTimeout(() => {
        this.didTapSurePasswordBtn(password);
      }, 0);
    }
  }

  async didTapSurePasswordBtn(password) {
    const { wallet } = store.getState().Core;

    let privateKey;
    try {
      privateKey = await KeystoreUtils.getPrivateKey(password, wallet.address);
      if (privateKey == null) {
        this.hideLoading();
        showToast(I18n.t('modal.password_error'));
      } else {
        this.startSendTransaction(privateKey);
      }
    } catch (err) {
      this.hideLoading();
    }
  }

  hideLoading() {
    this.setState({
      isShowSLoading: false,
      sLoadingContent: '',
    });
  }

  didTapNextBtn = () => {
    this.INPUT_ADDRESS.blur();

    // 计算gas消耗
    const { wallet } = store.getState().Core;
    let gasLimit;
    if (wallet.type === 'itc') {
      gasLimit = TransferGasLimit.itcGasLimit;
    } else if (wallet.type === 'eth') {
      gasLimit =
        this.params.transferType === TransferType.ETH
          ? TransferGasLimit.ethGasLimit
          : TransferGasLimit.tokenGasLimit;
    }
    let totalGas = this.state.currentGas * 0.001 * 0.001 * 0.001 * gasLimit;
    totalGas = totalGas.toFixed(8);

    if (this.params.ethBalance < totalGas) {
      this._showAlert(I18n.t('transaction.alert_4'));
      return;
    }

    const gas = this.getGas(this.state.currentGas);
    const walletType = wallet.type === 'itc' ? ' itc' : ' ether';
    const params = {
      fromAddress: this.state.fromAddress,
      toAddress: this.state.toAddress,
      totalAmount: `${this.state.transferValue} ${this.params.transferType}`,
      payType: I18n.t('transaction.transfer'),
      gasPrice: `${gas}${walletType}`,
      gasPriceInfo: this.getDetailPriceTitle(),
    };

    this.dialog.showStepView(params);
  };

  _closeModal = () => {
    this.dialog.closeStepView();
  };

  // ----视图的事件方法
  sliderValueChanged = async value => {
    const gasStr = this.getPriceTitle(value);
    this.setState(
      {
        currentGas: value,
        gasStr,
      },
      this.judgeCanSendInfoCorrect
    );
  };

  valueTextInputChangeText = txt => {
    const value = txt.trim();
    this.setState(
      {
        // transferValue: Number.isNaN(value) ? '' : txt,
        transferValue: value,
      },
      this.judgeCanSendInfoCorrect
    );
  };

  toAddressTextInputChangeText = txt => {
    const address = txt.trim();
    this.setState(
      {
        toAddress: address,
      },
      this.judgeCanSendInfoCorrect
    );
  };

  judgeCanSendInfoCorrect = () => {
    const { wallet } = store.getState().Core;
    const { balance, transferType, ethBalance } = this.params;

    const { transferValue, toAddress, fromAddress, currentGas } = this.state;

    const gas = this.getGas(currentGas);
    let curBalance;
    let curMainBalance;
    if (wallet.type === transferType.toLowerCase()) {
      curBalance = parseFloat(balance - transferValue - gas).toFixed(8);
      curMainBalance = curBalance;
    } else {
      curBalance = parseFloat(balance - transferValue).toFixed(8);
      curMainBalance = parseFloat(ethBalance - gas).toFixed(8);
    }

    const amountIsNotValid =
      transferValue === undefined ||
      Number.isNaN(transferValue) ||
      parseFloat(transferValue) <= 0 ||
      curBalance < 0 ||
      curMainBalance < 0;
    const addressIsNotValid = !NetworkManager.isValidAddress(toAddress);
    const addressIsSame = toAddress === fromAddress;

    this.setState({
      isDisabled: amountIsNotValid || addressIsNotValid || addressIsSame,
    });
  };

  routeContactList = () => {
    Analytics.recordClick('Transaction', 'contactList');
    const _this = this;
    this.props.navigation.navigate('AddressList', {
      from: 'transaction',
      callback(data) {
        const address = data.toAddress;
        _this.setState(
          {
            toAddress: address,
          },
          _this.judgeCanSendInfoCorrect
        );
      },
    });
  };

  detailTextInputChangeText = text => {
    this.setState({
      detailData: text,
    });
  };

  scanClick = async () => {
    Analytics.recordClick('Transaction', 'san');
    const _this = this;
    let isAgree = true;
    if (Platform.OS === 'android') {
      isAgree = await androidPermission(PermissionsAndroid.PERMISSIONS.CAMERA);
    }
    if (isAgree) {
      this.props.navigation.navigate('ScanQRCode', {
        callback(data) {
          const address = data.toAddress;
          _this.setState(
            {
              toAddress: address,
            },
            _this.judgeCanSendInfoCorrect
          );
        },
      });
    } else {
      this._showAlert(I18n.t('transaction.alert_2'));
    }
  };

  sendAllPress = () => {
    const { wallet } = store.getState().Core;
    const { balance, transferType } = this.params;
    const { currentGas } = this.state;
    const gas = this.getGas(currentGas);

    let curBalance;

    if (wallet.type === transferType.toLowerCase()) {
      curBalance = Number(parseFloat(balance - gas).toFixed(8));
    } else {
      curBalance = Number(parseFloat(balance).toFixed(8));
    }
    this.setState(
      {
        transferValue: curBalance,
      },
      this.judgeCanSendInfoCorrect
    );
  };

  renderComponent = () => {
    const {
      toAddress,
      fromAddress,
      transferValue,
      isDisabled,
      isShowSLoading,
      sLoadingContent,
    } = this.state;
    const title = /* params.transferType + ' ' + */ I18n.t('transaction.transfer');
    const alertHeight =
      NetworkManager.isValidAddress(toAddress) && toAddress !== fromAddress ? 0 : 18;
    const isShowAddressWarn = toAddress !== '' && alertHeight === 18;
    const curBalance = `${I18n.t('transaction.balance')}:${Number(
      parseFloat(this.params.balance).toFixed(4)
    )} ${this.params.transferType}`;
    return (
      <View
        style={styles.container}
        onResponderGrant={() => {
          Keyboard.dismiss();
        }}
      >
        <WhiteBgHeader
          navigation={this.props.navigation}
          text={title}
          rightPress={() => this.scanClick()}
          rightIcon={require('../../assets/common/scanIcon.png')}
        />
        {/** <ScrollView style={styles.scrollView}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}>* */}
        <StaticLoading visible={isShowSLoading} content={sLoadingContent} />
        <View style={styles.contentBox}>
          <TransactionStep
            didTapSurePasswordBtn={password => {
              this.timeIntervalCount = 0;
              this.timeInterval = setInterval(() => {
                this.timeIntervalCount = this.timeIntervalCount + 1;
                this.changeLoading(this.timeIntervalCount, password);
              }, 500);
            }}
            ref={dialog => {
              this.dialog = dialog;
            }}
          />
          {/* 转账地址栏 */}
          <InfoView
            title={I18n.t('transaction.collection_address')}
            detailTitle={I18n.t('transaction.address_list')}
            placeholder={I18n.t('transaction.enter_transfer_address')}
            returnKeyType="next"
            onChangeText={txt => {
              this.toAddressTextInputChangeText(txt);
            }}
            defaultValue={toAddress}
            detailTitlePress={this.routeContactList}
          />
          {isShowAddressWarn ? (
            <Text
              style={{
                color: Colors.fontRedColor,
                textAlign: 'right',
                marginTop: 8,
                marginLeft: 20,
                marginRight: 20,
                fontSize: 13,
              }}
              adjustsFontSizeToFit
            >
              {I18n.t('modal.enter_valid_transfer_address')}
            </Text>
          ) : null}
          <View style={styles.amountBox}>
            <Text style={styles.amountTitle}>{I18n.t('transaction.amount')}</Text>
            <View style={styles.amountInputBox}>
              <TextInput
                style={styles.amountInput}
                placeholderTextColor={Colors.fontGrayColor_a0}
                // placeholder={I18n.t('transaction.enter')}
                // selectionColor={Colors.fontBlueColor}
                ref={textinput => {
                  this.INPUT_ADDRESS = textinput;
                }}
                returnKeyType="next"
                keyboardType="numeric"
                onChangeText={txt => {
                  this.valueTextInputChangeText(txt);
                }}
              >
                {transferValue}
              </TextInput>
              <Text style={styles.amountType}>{this.params.transferType}</Text>
            </View>
            <View style={styles.vLine} />
            <View style={styles.curBalanceBox}>
              <Text style={styles.curBalance}>{curBalance}</Text>
              <TouchableOpacity
                style={styles.sendAll}
                activeOpacity={0.6}
                // disabled={detailTitlePress === undefined}
                onPress={this.sendAllPress}
              >
                <Text style={styles.sendAllTxt}>全部发送</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 滑竿视图 */}
          <SliderView
            gasStr={this.state.gasStr}
            minGasPrice={this.state.minGasPrice}
            maxGasPrice={this.state.maxGasPrice}
            initValue={this.params.suggestGasPrice}
            onValueChange={this.sliderValueChanged}
          />
          {/* 下一步按钮 */}
          <View style={styles.buttonBox}>
            <BlueButtonBig
              buttonStyle={styles.button}
              isDisabled={isDisabled}
              onPress={() => this.didTapNextBtn()}
              text={I18n.t('transaction.next_step')}
            />
          </View>
        </View>
      </View>
    );
  };
}
