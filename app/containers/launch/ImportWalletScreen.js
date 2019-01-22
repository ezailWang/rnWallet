import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Animated,
  Keyboard,
  DeviceEventEmitter,
  TouchableOpacity,
  findNodeHandle,
  UIManager,
  Platform,
} from 'react-native';
import keythereum from 'keythereum';
import HDWallet from 'react-native-hdwallet';
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils';
import { connect } from 'react-redux';
import KeystoreUtils from '../../utils/KeystoreUtils';
import StorageManage from '../../utils/StorageManage';
import * as Actions from '../../config/action/Actions';
import { Colors, StorageKey } from '../../config/GlobalConfig';
import { BlueButtonBig } from '../../components/Button';
import { showToast } from '../../utils/Toast';
import Layout from '../../config/LayoutConstants';
import { WhiteBgNoTitleHeader } from '../../components/NavigaionHeader';
import { vertifyPassword, resetStringBlank, stringTrim } from './Common';
import { I18n } from '../../config/language/i18n';
import StaticLoading from '../../components/StaticLoading';
import BaseComponent from '../base/BaseComponent';
import { defaultTokens, defaultTokensOfITC } from '../../utils/Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  keyboardAwareScrollView: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  contentContainer: {
    width: Layout.WINDOW_WIDTH * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  titleBox: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop:40,
    // paddingBottom:20,
  },
  icon: {
    width: 72,
    // height: 72,
    marginBottom: 10,
  },
  titleTxt: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.fontBlueColor,
  },
  inputArea: {
    height: 90,
    // textAlign:'start',
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
    color: Colors.fontBlackColor_43,
  },
  inputText: {
    height: 40,
  },
  inputTextBox: {
    alignSelf: 'stretch',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    borderColor: 'rgb(241,241,241)',
    borderWidth: 1,
    color: 'rgb(146,146,146)',
  },
  buttonBox: {
    // flex: 1,
    // justifyContent:'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  inputBox: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 5,
    borderColor: Colors.borderColor_e,
    borderWidth: 1,
    paddingLeft: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: Colors.fontBlackColor_43,
  },
  pwdBtnOpacity: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pwdIcon: {
    width: 20,
    height: (20 / 14) * 9,
  },
  warnTxt: {
    fontSize: 10,
    color: 'red',
    alignSelf: 'flex-end',
    paddingTop: 5,
    paddingLeft: 10,
  },
  warnTxtHidden: {
    height: 0,
  },
});

class ImportWalletScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: true, // 创建按钮是否可以点击
      isShowPassword: false,
      isShowNameWarn: false,
      isShowPwdWarn: false,
      isShowRePassword: false,
      nameWarn: I18n.t('launch.enter_normative_wallet_name'),
      pwdWarn: I18n.t('launch.password_warn'),
      rePwdWarn: I18n.t('launch.enter_same_password'),

      isShowSLoading: false,
      sLoadingContent: '',
      walletType: 'eth',
    };
    this.from = 0; // 0.第一次创建   1.从侧滑点击进入   2.从钱包工具点击进入
    this.nametxt = '';
    this.mnemonictxt = '';
    this.pwdtxt = '';
    this.rePwdtxt = '';
    this.keyBoardIsShow = false;
    this.isPwdFocus = false; // 密码框是否获得焦点
    this.isRePwdFocus = false;

    this.keyboardHeight = 0;
    this.textInputMarginBottom = 0;
    this.titleHeight = new Animated.Value(160);
    this.imageHeight = new Animated.Value(72);
    this.textFontSize = new Animated.Value(18);
    this.containerMarginTop = new Animated.Value(0);

    this.timeInterval = null;
    this.timeIntervalCount = 0;
    this.rePwdRef = React.createRef();
  }

  _initData() {
    const params = this.props.createWalletParams;
    if (params) {
      this.setState({
        walletType: params.walletType,
      });
      this.from = params.from;
    }
  }

  layout() {
    const handle = findNodeHandle(this.rePwdRef.current);
    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      if (this.keyBoardIsShow) {
        this.textInputMarginBottom = Layout.WINDOW_HEIGHT - pageY - 40;
      } else {
        this.textInputMarginBottom = Layout.WINDOW_HEIGHT - pageY - 40 + 160;
      }
    });
  }

  _addEventListener() {
    super._addEventListener();
    if (Platform.OS === 'ios') {
      this.keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this.keyboardWillShowHandler
      ); // android不监听keyboardWillShow和keyboardWillHide
      this.keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this.keyboardWillHideHandler
      );
    } else {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this.keyboardDidShowHandler
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this.keyboardDidHideHandler
      );
    }
  }

  _removeEventListener() {
    super._removeEventListener();
    if (Platform.OS === 'ios') {
      if (this.keyboardWillShowListener) {
        this.keyboardWillShowListener.remove();
      }
      if (this.keyboardWillHideListener) {
        this.keyboardWillHideListener.remove();
      }
    } else {
      if (this.keyboardDidShowListener) {
        this.keyboardDidShowListener.remove();
      }
      if (this.keyboardDidHideListener) {
        this.keyboardDidHideListener.remove();
      }
    }
  }

  keyboardWillShowHandler = event => {
    this.keyBoardIsShow = true;
    this.keyboardHeight = event.endCoordinates.height; // 软键盘高度
    this.titleBoxAnimated(event.duration, 0, 0, 0, 0);
  };

  keyboardWillHideHandler = event => {
    this.keyBoardIsShow = false;
    this._isShowRePwdWarn();
    this.keyboardHeight = 0;
    this.titleBoxAnimated(event.duration, 0, 160, 72, 18);
  };

  keyboardDidShowHandler = event => {
    this.keyBoardIsShow = true;
    // 'event',
    const duration = 100;
    this.keyboardHeight = event.endCoordinates.height;

    const t = this.textInputMarginBottom - this.keyboardHeight;
    if (this.isRePwdFocus && t < 0) {
      this.titleBoxAnimated(duration, t, 0, 0, 0);
    } else {
      this.titleBoxAnimated(duration, 0, 0, 0, 0);
    }
  };

  keyboardDidHideHandler = () => {
    this.keyBoardIsShow = false;
    this._isShowRePwdWarn();
    const duration = 100;
    this.keyboardHeight = 0;
    this.titleBoxAnimated(duration, 0, 160, 72, 18);
  };

  titleBoxAnimated(duration, marginTopToValue, titleToValue, imageToValue, textToValue) {
    Animated.parallel([
      Animated.timing(this.containerMarginTop, {
        duration,
        toValue: marginTopToValue,
      }),
      Animated.timing(this.titleHeight, {
        duration,
        toValue: titleToValue,
      }),
      Animated.timing(this.imageHeight, {
        duration,
        toValue: imageToValue,
      }),
      Animated.timing(this.textFontSize, {
        duration,
        toValue: textToValue,
      }),
    ]).start();
  }

  // 所有信息都输入完成前，“创建”按钮显示为灰色
  btnIsEnableClick() {
    if (
      this.mnemonictxt === '' ||
      this.nametxt === '' ||
      this.pwdtxt === '' ||
      this.rePwdtxt === '' ||
      this.pwdtxt !== this.rePwdtxt ||
      vertifyPassword(this.pwdtxt) !== '' ||
      this.nametxt.length > 12
    ) {
      const isShowRe = this.state.isShowRePwdWarn;
      this.setState({
        isDisabled: true,
        isShowRePwdWarn: this.pwdtxt === this.rePwdtxt ? false : isShowRe,
        isShowNameWarn: !!(this.nametxt === '' || this.nametxt.length > 12),
      });
    } else {
      this.setState({
        isDisabled: false,
        isShowRePwdWarn: false,
        isShowNameWarn: false,
      });
    }
  }

  _isShowRePwdWarn() {
    if (
      this.pwdtxt !== '' &&
      !this.state.isShowPwdWarn &&
      this.rePwdtxt !== '' &&
      this.pwdtxt !== this.rePwdtxt
    ) {
      if (!this.state.isShowRePwdWarn) {
        this.setState({
          isShowRePwdWarn: true,
        });
      }
    } else if (this.state.isShowRePwdWarn) {
      this.setState({
        isShowRePwdWarn: false,
      });
    }
  }

  _isShowPwdWarn() {
    let isMatchPwd = '';
    if (this.pwdtxt !== '') {
      isMatchPwd = vertifyPassword(this.pwdtxt);
      if (isMatchPwd !== '') {
        // 密码不匹配
        this.setState({
          isShowPwdWarn: true,
          isDisabled: true,
          pwdWarn: isMatchPwd,
        });
      } else {
        // 密码匹配
        this.setState({
          isShowPwdWarn: false,
          pwdWarn: '',
        });
        this.btnIsEnableClick();
      }
    } else {
      this.setState({
        isShowPwdWarn: true,
        isDisabled: true,
        pwdWarn: I18n.t('launch.password_warn'),
      });
    }
  }

  async vertifyInputData() {
    Keyboard.dismiss();
    let warnMessage = '';
    const mnemonic = this.mnemonictxt;
    const pwd = this.pwdtxt;
    const rePwd = this.rePwdtxt;
    if (mnemonic === '') {
      warnMessage = I18n.t('toast.enter_mnemonic');
    } else if (pwd === '') {
      warnMessage = I18n.t('toast.enter_password');
    } else if (rePwd === '') {
      warnMessage = I18n.t('toast.enter_repassword');
    } else if (pwd !== rePwd) {
      warnMessage = I18n.t('toast.enter_same_password');
    } else {
      const str = stringTrim(mnemonic);
      const m = resetStringBlank(str); // 将字符串中的多个空格缩减为一个空格
      const mnemonicIsOk = await walletUtils.validateMnemonic(m); // 验证助记词
      if (!mnemonicIsOk) {
        warnMessage = I18n.t('toast.check_mnemonic_is_correct');
      }
    }

    if (warnMessage !== '') {
      showToast(warnMessage);
    } else {
      this.timeIntervalCount = 0;
      this.timeInterval = setInterval(() => {
        this.timeIntervalCount = this.timeIntervalCount + 1;
        this.changeLoading(this.timeIntervalCount);
      }, 500);
    }
  }

  changeLoading(num) {
    let content = '';
    if (num === 1) {
      content = I18n.t('launch.start_import_wallet');
    } else if (num === 2) {
      content = I18n.t('launch.generating_key_pairs');
    } else {
      content = I18n.t('launch.generating_keystore_file');
    }
    this.setState({
      isShowSLoading: true,
      sLoadingContent: content,
    });
    if (num === 3) {
      clearInterval(this.timeInterval);
      setTimeout(() => {
        this.importWallet();
      }, 0);
    }
  }

  async importWallet() {
    try {
      const seed = walletUtils.mnemonicToSeed(this.mnemonictxt);
      // const seedHex = seed.toString('hex');
      const hdwallet = HDWallet.fromMasterSeed(seed);
      const derivePath = "m/44'/60'/0'/0/0";
      hdwallet.setDerivePath(derivePath);
      const privateKey = hdwallet.getPrivateKey();
      const checksumAddress = hdwallet.getChecksumAddressString();

      const password = this.pwdtxt;
      const params = { keyBytes: 32, ivBytes: 16 };
      const dk = keythereum.create(params);

      const keyObject = await KeystoreUtils.dump(password, privateKey, dk.salt, dk.iv);
      await KeystoreUtils.exportToFile(keyObject, 'keystore');

      const wallet = {
        name: this.nametxt,
        address: checksumAddress,
        extra: '',
        type: this.state.walletType,
      };

      let isExist = false;
      let wallets = [];
      if (this.from === 1 || this.from === 2) {
        const itcWalletList = await StorageManage.load(StorageKey.ItcWalletList);
        const ethWalletList = await StorageManage.load(StorageKey.EthWalletList);

        if (itcWalletList && itcWalletList.length > 0) {
          for (let i = 0; i < itcWalletList.length; i++) {
            if (checksumAddress.toLowerCase() === itcWalletList[i].address.toLowerCase()) {
              isExist = true;
              break;
            }
          }
        }
        if (ethWalletList && ethWalletList.length > 0) {
          for (let i = 0; i < ethWalletList.length; i++) {
            if (checksumAddress.toLowerCase() === ethWalletList[i].address.toLowerCase()) {
              isExist = true;
              break;
            }
          }
        }

        let preWalletList = [];
        if (this.state.walletType === 'itc') {
          preWalletList = itcWalletList;
        } else {
          preWalletList = ethWalletList;
        }

        if (!preWalletList) {
          preWalletList = [];
        }

        if (!isExist) {
          wallets = preWalletList.concat(wallet);
        }
      } else {
        wallets.push(wallet);
        this.props.setIsNewWallet(true);
      }

      if (isExist) {
        this.setState({
          isShowSLoading: false,
        });
        this._showAlert(I18n.t('settings.import_wallet_already'));
      } else {
        if (this.state.walletType === 'itc') {
          StorageManage.save(StorageKey.ItcWalletList, wallets);
          this.props.setItcWalletList(wallets);
        } else {
          StorageManage.save(StorageKey.EthWalletList, wallets);
          this.props.setEthWalletList(wallets);
        }
        StorageManage.save(StorageKey.User, wallet);
        this.props.setCurrentWallet(wallet);

        this.routeTo();
      }
    } catch (err) {
      this.setState({
        isShowSLoading: false,
      });

      showToast(I18n.t('toast.import_mnemonic_error'));
      console.log('createWalletErr:', err);
    }
  }

  routeTo() {
    this.setState({
      isShowSLoading: false,
    });
    if (this.state.walletType === 'itc') {
      this.props.loadTokenBalance(defaultTokensOfITC);
    } else {
      this.props.loadTokenBalance(defaultTokens);
    }
    if (this.from === 1 || this.from === 2) {
      this.props.setTransactionRecordList([]);
      StorageManage.clearMapForkey(StorageKey.TransactionRecoderInfo);

      DeviceEventEmitter.emit('changeWallet', { openRightDrawer: false, isChangeWalletList: true });

      if (this.from === 1) {
        this.props.navigation.navigate('Home');
        this.props.navigation.openDrawer();
      } else if (this.from === 2) {
        this.props.navigation.navigate('WalletList');
      }
    } else {
      this.props.navigation.navigate('Home');
    }
  }

  isOpenPwd() {
    const isShow = this.state.isShowPassword;
    this.setState({ isShowPassword: !isShow });
  }

  isOpenRePwd() {
    const isShow = this.state.isShowRePassword;
    this.setState({ isShowRePassword: !isShow });
  }

  renderComponent() {
    const pwdIcon = this.state.isShowPassword
      ? require('../../assets/launch/pwdOpenIcon.png')
      : require('../../assets/launch/pwdHideIcon.png');
    const rePwdIcon = this.state.isShowRePassword
      ? require('../../assets/launch/pwdOpenIcon.png')
      : require('../../assets/launch/pwdHideIcon.png');
    // let titleText = this.keyBoardIsShow ? '' : I18n.t('launch.import_wallet');
    // let titleIcon = this.keyBoardIsShow ? null : require('../../assets/launch/importIcon.png');
    const titleText =
      this.state.walletType === 'itc'
        ? I18n.t('settings.import_itc_wallet')
        : I18n.t('settings.import_eth_wallet');

    const titleIcon = require('../../assets/launch/importIcon.png');
    return (
      <View
        style={styles.container}
        onStartShouldSetResponder={() => true}
        onResponderGrant={() => {
          Keyboard.dismiss();
        }}
      >
        <WhiteBgNoTitleHeader navigation={this.props.navigation} />
        {/* <TouchableOpacity style={{flex:1}} activeOpacity={1} onPress={this.hideKeyboard}>
                <KeyboardAvoidingView style={styles.keyboardAwareScrollView}
                                         keyboardShouldPersistTaps='handled'
        behavior="padding"> */}

        <StaticLoading visible={this.state.isShowSLoading} content={this.state.sLoadingContent} />
        <Animated.View style={[styles.contentContainer, { marginTop: this.containerMarginTop }]}>
          <Animated.View style={[styles.titleBox, { height: this.titleHeight }]}>
            <Animated.Image
              style={[styles.icon, { height: this.imageHeight }]}
              source={titleIcon}
              resizeMode="contain"
            />
            <Animated.Text style={[styles.titleTxt, { fontSize: this.textFontSize }]}>
              {titleText}
            </Animated.Text>
          </Animated.View>

          <View style={styles.inputTextBox}>
            <TextInput
              style={[styles.inputArea]}
              // returnKeyType='next'
              placeholderTextColor={Colors.fontGrayColor_a0}
              placeholder={I18n.t('launch.input_mnemonic_hint')}
              underlineColorAndroid="transparent"
              selectionColor="#00bfff"
              multiline
              // defaultValue={'violin stamp exist price hard coyote cream decide solution cargo sign mixture'}
              onChange={event => {
                this.mnemonictxt = event.nativeEvent.text;
                this.btnIsEnableClick();
              }}
            />
          </View>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholderTextColor={Colors.fontGrayColor_a0}
              returnKeyType="next"
              placeholder={I18n.t('launch.wallet_name_hint')}
              underlineColorAndroid="transparent"
              selectionColor="#00bfff"
              onChange={event => {
                this.nametxt = event.nativeEvent.text;
                this.btnIsEnableClick();
              }}
              onFocus={() => {
                this.btnIsEnableClick();
              }}
            />
          </View>
          <Text style={this.state.isShowNameWarn ? styles.warnTxt : styles.warnTxtHidden}>
            {this.state.nameWarn}
          </Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholderTextColor={Colors.fontGrayColor_a0}
              returnKeyType="next"
              placeholder={I18n.t('launch.set_password_hint')}
              underlineColorAndroid="transparent"
              selectionColor="#00bfff"
              secureTextEntry={!this.state.isShowPassword}
              onChange={event => {
                this.pwdtxt = event.nativeEvent.text;
                this._isShowPwdWarn();
              }}
              onFocus={() => {
                this.isPwdFocus = true;
                this._isShowPwdWarn();
              }}
              onBlur={() => {
                this.isPwdFocus = false;
              }}
            />
            <TouchableOpacity
              style={[styles.pwdBtnOpacity]}
              activeOpacity={0.6}
              onPress={() => this.isOpenPwd()}
            >
              <Image style={styles.pwdIcon} source={pwdIcon} resizeMode="center" />
            </TouchableOpacity>
          </View>
          <Text style={this.state.isShowPwdWarn ? styles.warnTxt : styles.warnTxtHidden}>
            {this.state.pwdWarn}
          </Text>
          <View style={styles.inputBox} ref={this.rePwdRef}>
            <TextInput
              style={styles.input}
              placeholderTextColor={Colors.fontGrayColor_a0}
              returnKeyType="done"
              placeholder={I18n.t('launch.re_password_hint')}
              underlineColorAndroid="transparent"
              selectionColor="#00bfff"
              secureTextEntry={!this.state.isShowRePassword}
              onChange={event => {
                this.rePwdtxt = event.nativeEvent.text;
                this.btnIsEnableClick();
              }}
              onFocus={() => {
                this.isRePwdFocus = true;
                this.layout();
              }}
              onBlur={() => {
                this.isRePwdFocus = false;
                this._isShowRePwdWarn();
              }}
            />
            <TouchableOpacity
              style={[styles.pwdBtnOpacity]}
              activeOpacity={0.6}
              onPress={() => this.isOpenRePwd()}
            >
              <Image style={styles.pwdIcon} source={rePwdIcon} resizeMode="center" />
            </TouchableOpacity>
          </View>
          <Text style={this.state.isShowRePwdWarn ? styles.warnTxt : styles.warnTxtHidden}>
            {this.state.rePwdWarn}
          </Text>
          <BlueButtonBig
            buttonStyle={styles.buttonBox}
            isDisabled={this.state.isDisabled}
            onPress={() => this.vertifyInputData()}
            text={I18n.t('launch.import')}
          />
        </Animated.View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  createWalletParams: state.Core.createWalletParams,
});
const mapDispatchToProps = dispatch => ({
  setIsNewWallet: isNewWallet => dispatch(Actions.setIsNewWallet(isNewWallet)),
  loadTokenBalance: tokens => dispatch(Actions.loadTokenBalance(tokens)),
  setItcWalletList: itcWalletList => dispatch(Actions.setItcWalletList(itcWalletList)),
  setEthWalletList: ethWalletList => dispatch(Actions.setEthWalletList(ethWalletList)),
  setCurrentWallet: wallet => dispatch(Actions.setCurrentWallet(wallet)),
  setTransactionRecordList: records => dispatch(Actions.setTransactionRecordList(records)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportWalletScreen);
