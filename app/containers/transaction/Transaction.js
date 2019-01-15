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

import { BlueButtonBig } from '../../components/Button';
import Slider from '../../components/Slider';
import { androidPermission } from '../../utils/PermissionsAndroid';
import KeystoreUtils from '../../utils/KeystoreUtils';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import BaseComponent from '../base/BaseComponent';
import { showToast } from '../../utils/Toast';
import StaticLoading from '../../components/StaticLoading';

import { setNewTransaction } from '../../config/action/Actions';

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
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    height: 90,
  },
  sectionViewTopView: {
    flexDirection: 'row',
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    height: 42,
  },
  sectionViewBottomView: {
    marginTop: 3,
    marginLeft: 0,
    marginRight: 0,
    height: 46,
    backgroundColor: 'white',
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
    marginLeft: 20,
    marginTop: 20,
    height: 20,
    // width: ScreenWidth / 3,
    color: Colors.fontBlackColor_43,
    // backgroundColor:"green"
  },

  infoViewDetailTitleTouchable: {
    alignSelf: 'center',
    // textAlign: "right",
    height: 42,
    marginLeft: 0,
    paddingRight: 20,
    justifyContent: 'flex-end',
  },
  blueText: {
    color: Colors.fontBlueColor,
    height: 20,
    textAlign: 'center',
    // width: 2 * ScreenWidth / 3 - 40,
  },
  sectionViewTextInput: {
    marginLeft: 20,
    height: 38,
    marginRight: 20,
    fontSize: 12,
    color: Colors.fontBlackColor_43,
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
    width: ScreenWidth - 50 * 2,
    height: 40,
    marginTop: 20,
    marginLeft: 50,
    // backgroundColor:Colors.RedColor
  },
  sliderAlertView: {
    alignSelf: 'center',
    width: ScreenWidth - 80,
    marginTop: 5,
    // marginLeft: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transferPrice: {
    textAlign: 'center',
    color: Colors.fontBlackColor_43,
  },
  buttonBox: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 80,
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
          style={[styles.sectionViewBottomView, Platform.OS === 'ios' ? styles.shadowStyle : {}]}
        >
          <TextInput
            style={styles.sectionViewTextInput}
            placeholderTextColor={Colors.fontGrayColor_a0}
            placeholder={placeholder}
            returnKeyType={returnKeyType}
            keyboardType={keyboardType}
            onChangeText={onChangeText}
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
      <View style={[styles.sliderBottomView, styles.shadowStyle]}>
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

    this.inputTransferValue = 0;
    this.inputToAddress = '';

    this.timeInterval = null;
    this.timeIntervalCount = 0;

    this.state = {
      transferType: params.transferType,
      minGasPrice: 1,
      maxGasPrice: 100,
      currentGas: params.suggestGasPrice,
      gasStr: this.getPriceTitle(params.suggestGasPrice),
      transferValue: -1,
      // toAddress: '0x6e7d1b1bdE9A02b1F3ad2D5f81baD90eF68b7994',
      toAddress: '',
      fromAddress: params.fromAddress,
      detailData: '',
      defaultTransferValue: '',
      isDisabled: true,

      isShowSLoading: false,
      sLoadingContent: '',
    };
  }

  /** static navigationOptions = ({navigation}) => ({
        header:<WhiteBgHeader navigation={navigation} text={ComponentTitle()}/>
    })* */

  getPriceTitle = gasPrice => {
    const { wallet } = store.getState().Core;
    let gasLimit;
    if (wallet.type === 'itc') {
      gasLimit = TransferGasLimit.itcGasLimit;
    } else if (wallet.type === 'eht') {
      gasLimit =
        this.params.transferType === TransferType.ETH
          ? TransferGasLimit.ethGasLimit
          : TransferGasLimit.tokenGasLimit;
    }
    let totalGas = gasPrice * 0.001 * 0.001 * 0.001 * gasLimit;
    totalGas = Number(totalGas.toFixed(8));
    // let totalGasPrice = totalGas * ethPrice;
    // totalGasPrice = totalGasPrice.toFixed(8);
    // return totalGas + "ether≈" + totalGasPrice + "$";

    return totalGas + (wallet.type === 'itc' ? ' itc' : ' ether');
  };

  getDetailPriceTitle = () => {
    const { wallet } = store.getState().Core;
    let gasLimit;
    if (wallet.type === 'itc') {
      gasLimit = TransferGasLimit.itcGasLimit;
    } else if (wallet.type === 'eht') {
      gasLimit =
        this.params.transferType === TransferType.ETH
          ? TransferGasLimit.ethGasLimit
          : TransferGasLimit.tokenGasLimit;
    }
    return `=Gas(${gasLimit})*Gas Price(${this.state.currentGas})gwei`;
  };

  async startSendTransaction(privateKey) {
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
          } else if (wallet.type === 'eht') {
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
      console.log('exportKeyPrivateErr:', err);
    } finally {
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
    // 计算gas消耗
    const { wallet } = store.getState().Core;
    let gasLimit;
    if (wallet.type === 'itc') {
      gasLimit = TransferGasLimit.itcGasLimit;
    } else if (wallet.type === 'eht') {
      gasLimit =
        this.params.transferType === TransferType.ETH
          ? TransferGasLimit.ethGasLimit
          : TransferGasLimit.tokenGasLimit;
    }
    let totalGas = this.state.currentGas * 0.001 * 0.001 * 0.001 * gasLimit;
    totalGas = totalGas.toFixed(8);

    if (this.params.ethBalance < totalGas) {
      // alert(I18n.t('transaction.alert_4'));
      this._showAlert(I18n.t('transaction.alert_4'));
      return;
    }

    const params = {
      fromAddress: this.state.fromAddress,
      toAddress: this.state.toAddress,
      totalAmount: `${this.state.transferValue} ${this.params.transferType}`,
      payType: /* this.params.transferType + */ I18n.t('transaction.transfer'),
      gasPrice: this.getPriceTitle(this.state.currentGas),
      gasPriceInfo: this.getDetailPriceTitle(),
    };

    this.dialog.showStepView(params);
  };

  _closeModal() {
    this.dialog.closeStepView();
  }

  // ----视图的事件方法
  sliderValueChanged = value => {
    const price = this.getPriceTitle(value);
    this.setState({
      currentGas: value,
      gasStr: price,
    });
  };

  valueTextInputChangeText = () => {
    const value = parseFloat(this.inputTransferValue);
    this.setState({
      transferValue: value,
    });
    this.judgeCanSendInfoCorrect();
  };

  toAddressTextInputChangeText = () => {
    const address = this.inputToAddress;
    this.setState({
      toAddress: address,
    });
    this.judgeCanSendInfoCorrect();
  };

  judgeCanSendInfoCorrect() {
    const totalValue = this.params.balance;
    // console.log('######'+this.inputTransferValue)
    const amountIsNotValid =
      this.inputTransferValue === undefined ||
      Number.isNaN(this.inputTransferValue) ||
      parseFloat(this.inputTransferValue) > totalValue;
    const addressIsNotValid = this.inputToAddress.length !== 42;
    const addressIsSame = this.inputToAddress === this.state.fromAddress;

    this.setState({
      isDisabled: amountIsNotValid || addressIsNotValid || addressIsSame,
    });
  }

  routeContactList = () => {
    const _this = this;
    this.props.navigation.navigate('AddressList', {
      from: 'transaction',
      callback(data) {
        const address = data.toAddress;
        _this.inputToAddress = address;
        _this.setState({
          toAddress: address,
        });
        _this.judgeCanSendInfoCorrect();
      },
    });
  };

  detailTextInputChangeText = text => {
    this.setState({
      detailData: text,
    });
  };

  scanClick = async () => {
    const _this = this;
    // const {navigate} = this.props.navigation;//页面跳转
    // navigation('页面');
    let isAgree = true;
    if (Platform.OS === 'android') {
      isAgree = await androidPermission(PermissionsAndroid.PERMISSIONS.CAMERA);
    }
    if (isAgree) {
      this.props.navigation.navigate('ScanQRCode', {
        callback(data) {
          const address = data.toAddress;
          _this.inputToAddress = address;
          _this.setState({
            toAddress: address,
          });
          _this.judgeCanSendInfoCorrect();
        },
      });
    } else {
      this._showAlert(I18n.t('transaction.alert_2'));
    }
  };

  renderComponent() {
    const title = /* params.transferType + ' ' + */ I18n.t('transaction.transfer');
    const alertHeight =
      this.state.toAddress.length === 42 && this.state.toAddress !== this.state.fromAddress
        ? 0
        : 18;
    const isShowAddressWarn = this.state.toAddress !== '' && alertHeight === 18;

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
        <StaticLoading visible={this.state.isShowSLoading} content={this.state.sLoadingContent} />
        <View style={styles.contentBox}>
          <TransactionStep
            didTapSurePasswordBtn={password => {
              /* this._showLoading();
                        setTimeout(async () => {
                            this.didTapSurePasswordBtn(password)
                        }, 1200) */
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
          <InfoView
            title={I18n.t('transaction.amount')}
            detailTitle={`${I18n.t('transaction.balance')}:${Number(
              parseFloat(this.params.balance).toFixed(4)
            )}${this.params.transferType}`}
            placeholder={
              I18n.t(
                'transaction.enter'
              ) /* + this.params.transferType + I18n.t('transaction.amount') */
            }
            returnKeyType="next"
            keyboardType="numeric"
            onChangeText={txt => {
              this.inputTransferValue = parseFloat(txt);
              this.valueTextInputChangeText();
            }}
          />
          {/* 转账地址栏 */}
          <InfoView
            title={I18n.t('transaction.collection_address')}
            detailTitle={I18n.t('transaction.address_list')}
            placeholder={I18n.t('transaction.enter_transfer_address')}
            returnKeyType="next"
            onChangeText={txt => {
              this.inputToAddress = txt;
              this.toAddressTextInputChangeText();
            }}
            defaultValue={this.state.toAddress}
            detailTitlePress={this.routeContactList}
          />
          {/* 备注栏 */}
          {/* <InfoView title={"备注"}
                        placeholder={"输入备注"}
                        returnKeyType={"done"}
                        onChangeText={this.detailTextInputChangeText} /> */}
          {/* 滑竿视图 */}
          {isShowAddressWarn ? (
            <Text
              style={{
                color: Colors.fontRedColor,
                textAlign: 'right',
                marginTop: 8,
                marginLeft: 20,
                marginRight: 20,
                fontSize: 14,
              }}
              adjustsFontSizeToFit
            >
              {I18n.t('modal.enter_valid_transfer_address')}
            </Text>
          ) : null}
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
              isDisabled={this.state.isDisabled}
              onPress={() => this.didTapNextBtn()}
              text={I18n.t('transaction.next_step')}
            />
          </View>
        </View>
      </View>
    );
  }
}
