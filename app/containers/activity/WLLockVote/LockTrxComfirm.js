import React, { Component } from 'react';

import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import { Colors } from '../../../config/GlobalConfig';
import { I18n } from '../../../config/language/i18n';
import LayoutConstants from '../../../config/LayoutConstants';

const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackOpacityColor,
    justifyContent: 'flex-end',
  },
  KeyboardContainer: {
    marginTop:
      Platform.OS === 'android'
        ? LayoutConstants.WINDOW_HEIGHT - 400 - StatusBarHeight
        : LayoutConstants.WINDOW_HEIGHT - 400,
    height: 400,
    marginBottom: 0,
    marginRight: 0,
    marginLeft: 0,
  },
  scrollView: {
    flexDirection: 'row',
    flex: 1,
    height: 400,
  },
  leftContainer: {
    marginLeft: 0,
    backgroundColor: 'white',
    height: 400,
    width: LayoutConstants.WINDOW_WIDTH,
    alignItems: 'center',
  },
  rightContainer: {
    marginRight: 0,
    marginTop: 0,
    backgroundColor: 'white',
    height: 400,
    width: LayoutConstants.WINDOW_WIDTH,
    alignItems: 'center',
  },
  firstStepTitleView: {
    height: 44,
    width: LayoutConstants.WINDOW_WIDTH,
    marginRight: 0,
    borderBottomColor: Colors.fontGrayColor,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelBtn: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleView: {
    color: Colors.fontBlackColor,
    // marginLeft:0,
    width: LayoutConstants.WINDOW_WIDTH - (30 + 25) * 2,
    fontSize: 17,
    textAlign: 'center',
  },
  costTextContainer: {
    height: 50,
    justifyContent: 'center',
  },
  costText: {
    fontSize: 20,
    textAlign: 'center',
  },
  leftInfoView: {
    height: 210,
    // backgroundColor:"red",
    width: LayoutConstants.WINDOW_WIDTH - 40,
  },
  infoTextViewFirst: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:"red",
    width: LayoutConstants.WINDOW_WIDTH - 60,
  },
  infoTitle: {
    fontSize: 13,
    width: 100,
    color: Colors.fontDarkGrayColor,
  },
  infoDetailTitle: {
    fontSize: 13,
    color: Colors.fontBlackColor,
    width: LayoutConstants.WINDOW_WIDTH - 140,
  },
  infoContent: {
    height: 210.0 / 3,
    flexDirection: 'row',
  },
  lineView: {
    height: 0.5,
    backgroundColor: Colors.fontGrayColor,
  },
  infoContentTitle: {
    marginTop: 10,
    width: 100,
  },
  infoContentDetailTitle: {
    fontSize: 13,
    color: Colors.fontBlackColor,
    width: LayoutConstants.WINDOW_WIDTH - 140,
  },
  infoContentDetailView: {
    width: LayoutConstants.WINDOW_WIDTH - 180,
    marginTop: 10,
    marginRight: 10,
    flex: 1,
    // backgroundColor:"blue"
  },
  nextBtn: {
    marginTop: 25,
    height: 44,
    borderRadius: 5,
    width: LayoutConstants.WINDOW_WIDTH - 60,
    backgroundColor: Colors.themeColor,
    justifyContent: 'center',
  },
  buttonTitle: {
    // flex:1,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  passwordFrameView: {
    borderWidth: 1,
    borderColor: Colors.fontGrayColor,
    borderRadius: 5,
    width: LayoutConstants.WINDOW_WIDTH - 50,
    marginTop: 20,
    height: 40,
  },
  passwordView: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
    // backgroundColor:"red",
    height: 40,
    fontSize: 15,
    paddingVertical: 0,
  },
});

const InfoTextView = ({
  amount,
  nodeNumber,
  lockDate,
  lockDay,
  fromAddress,
  totalGasUsed,
  detailGas
}) => (
  <View style={styles.leftInfoView}>
    {/* <View style={styles.infoTextViewFirst}>
      <Text style={styles.infoTitle}>{amount+'ITC'}</Text>
    </View> */}
    <InfoContentView title={'支付信息'} deatilContent={'超级节点'} />
    <InfoContentView title={'锁定日期'} deatilContent={lockDay} />
    <InfoContentView title={'锁定期限'} deatilContent={lockDate} />
    <InfoContentView title={'发起地址'} deatilContent={fromAddress} />
    <InfoContentView
      title={I18n.t('exchange.fees')}
      deatilContent={`${totalGasUsed}\n${detailGas}`}
    />
  </View>
);

const InfoContentView = ({ title, deatilContent }) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <View style={styles.lineView} />
    <View style={styles.infoContent}>
      <View style={styles.infoContentTitle}>
        <Text style={[styles.infoTitle]}>{title}</Text>
      </View>
      <View style={styles.infoContentDetailView}>
        <Text style={styles.infoContentDetailTitle}>{deatilContent}</Text>
      </View>
    </View>
  </View>
);

export default class LockTrxComfirm extends Component {
  static propsType = {
    didTapSurePasswordBtn: PropTypes.func.isRequired,
  };

  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      step: false,
      password: '',
    };
    this.changeStepPage = this.changeStepPage.bind(this);
    this.passWordTextInputChanged = this.passWordTextInputChanged.bind(this);
  }

  changeStepPage() {
    this.setState(
      previousState => ({ step: !previousState.step }),
      () => {
        const { step } = this.state;
        if (step === false) {
          this.scroll.scrollTo({ x: 0, y: 0, animated: true });
          this.INPUT.blur();
        } else {
          this.scroll.scrollTo({ x: LayoutConstants.WINDOW_WIDTH, y: 0, animated: true });
          this.INPUT.focus();
        }
      }
    );
  }

  passWordTextInputChanged(text) {
    this.setState({
      password: text,
    });
  }

  render() {

    const { password } = this.state;
    const {
      show,
      didTapSurePasswordBtn,
      amount,
      lockDate,
      lockDay,
      fromAddress,
      totalGasUsed,
      detailGas,
      onCancelClick,
    } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent
        visible={show}
        onShow={() => {
          // console.log('控件显示');
        }}
        onRequestClose={() => {
          // console.log('安卓物理返回');
        }}
      >
        <View style={styles.container}>
          <KeyboardAwareScrollView
            style={styles.KeyboardContainer}
            keyboardShouldPersistTaps="handled"
          >
            <ScrollView
              style={styles.scrollView}
              keyboardShouldPersistTaps="handled"
              horizontal // 水平方向
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              bounces={false}
              ref={scroll => {
                this.scroll = scroll;
              }}
              behavior="padding"
            >
              {/* 步骤一 确认交易信息 */}
              <View style={styles.leftContainer}>
                <View style={styles.firstStepTitleView}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={onCancelClick}>
                    <Image
                      resizeMode="contain"
                      source={require('../../../assets/common/cancel.png')}
                      style={{ width: 15, height: 15 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.titleView}>{I18n.t('exchange.exchange_details')}</Text>
                </View>
                <View style={styles.costTextContainer}>
                  <Text style={styles.costText}>{amount+' ITC'}</Text>
                </View>
                <InfoTextView
                  lockDate={lockDate}
                  lockDay={lockDay}
                  fromAddress={fromAddress}
                  totalGasUsed={totalGasUsed}
                  detailGas={detailGas}
                />

                <TouchableOpacity style={styles.nextBtn} onPress={this.changeStepPage}>
                  <Text style={styles.buttonTitle}>{I18n.t('transaction.next_step')}</Text>
                </TouchableOpacity>
              </View>

              {/* 步骤二 ，输入密码 */}
              <View style={styles.rightContainer}>
                <View style={[styles.firstStepTitleView, { borderBottomWidth: 0 }]}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={this.changeStepPage}>
                    <Image
                      resizeMode="contain"
                      source={require('../../../assets/common/common_back.png')}
                      style={{ height: 20, width: 20 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.titleView}>{I18n.t('transaction.wallet_password')}</Text>
                </View>
                <View style={styles.passwordFrameView}>
                  <TextInput
                    style={styles.passwordView}
                    placeholderTextColor={Colors.fontGrayColor_a0}
                    placeholder={I18n.t('transaction.enter_password_hint')}
                    returnKeyType="done"
                    secureTextEntry
                    onChangeText={this.passWordTextInputChanged}
                    ref={textinput => {
                      this.INPUT = textinput;
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.nextBtn}
                  onPress={() => {
                    didTapSurePasswordBtn(password);
                  }}
                >
                  <Text style={styles.buttonTitle}>{I18n.t('transaction.determine')}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}
