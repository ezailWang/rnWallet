import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions';
import { BlueButtonBig } from '../../components/Button';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n';
import Layout from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';

const StatusBarHeight = StatusBar.currentHeight;
const contentWidth = Layout.WINDOW_WIDTH * 0.9;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  keyboardAwareScrollView: {
    flex: 1,
  },

  topImg: {
    width: contentWidth - 40,
    height: ((contentWidth - 40) / 288) * 76,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
    justifyContent: 'flex-end',
  },
  mappingGuideBox: {
    textAlignVertical: 'bottom',
    paddingTop: 15,
    paddingBottom: 5,
    alignSelf: 'center',
  },
  mappingGuideText: {
    fontSize: 14,
    color: Colors.fontBlueColor,
    textDecorationLine: 'underline',
  },
  mAddressBox: {
    width: contentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.bgGrayColor_ed,
  },
  mAddressContent: {
    flex: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  mAddressTitle: {
    color: Colors.fontBlackColor_43,
    fontSize: 15,
    marginBottom: 6,
  },
  mAddressText: {
    color: Colors.fontGrayColor_a,
    fontSize: 14,
  },
  changeBox: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    marginLeft: 20,
  },
  changeText: {
    color: Colors.fontGrayColor_a0,
    fontSize: 15,
    paddingRight: 5,
  },
  changeIcon: {
    width: 12,
    height: 12,
  },

  mAmountTitle: {
    width: contentWidth,
    alignSelf: 'center',
    color: Colors.fontBlueColor,
    fontSize: 18,
    marginTop: 16,
  },
  mAmountInputView: {
    flexDirection: 'row',
    marginTop: 10,
    width: contentWidth,
    alignSelf: 'center',
    height: 40,
    alignItems: 'flex-end',
    padding: 0,
  },
  mAmountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '600',
    height: 40,
    padding: 0,
    margin: 0,
    // textAlignVertical: 'bottom',
    alignItems: 'flex-end',
    color: Colors.fontBlueColor,
  },
  unit: {
    fontSize: 26,
    fontWeight: '600',
    color: Colors.fontBlueColor,
  },
  vLine: {
    width: contentWidth,
    height: 1,
    backgroundColor: Colors.bgGrayColor_e5,
    marginBottom: 15,
    alignSelf: 'center',
  },
  commonText: {
    width: contentWidth,
    color: Colors.fontGrayColor_a,
    fontSize: 14,
    marginTop: 5,
    alignSelf: 'center',
  },
  btn: {
    alignSelf: 'center',
  },

  initiationAddressBox: {
    width: contentWidth,
    alignSelf: 'center',
  },
  initiationAddressContent: {
    width: contentWidth,
    flexDirection: 'row',
    height: 30,
  },
  initiationAddressText: {
    color: Colors.fontGrayColor_a,
    fontSize: 14,
    marginTop: 5,
  },
  promptBox: {
    flex: 1,
  },
  promptTouch: {
    width: 40,
    height: 30,
    paddingLeft: 5,
    paddingTop: 6,
  },
  promptIcon: {
    width: 12,
    height: 12,
  },
  triangleIcon: {
    width: 12,
    height: 10,
    marginTop: -8,
    marginLeft: 5,
  },
  promptDescView: {
    position: 'absolute',
    width: contentWidth,
    alignSelf: 'center',
    backgroundColor: 'rgba(63,193,255,0.8)',
    borderRadius: 5,
    padding: 10,
    marginTop: 30,
    zIndex: 10,
  },
  promptDesc: {
    fontSize: 13,
    color: 'white',
  },

  modalBox: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.blackOpacityColor,
  },
  modalContent: {
    // height: 450,
    flex: 1,
    marginTop: Layout.WINDOW_HEIGHT - 450,
    width: Layout.WINDOW_WIDTH,
  },
  modalKeyboardContainer: {
    width: Layout.WINDOW_WIDTH,
    height: 450,
    // marginTop:Layout.WINDOW_HEIGHT - 450,
    margin: 0,
  },
  modalScrollView: {
    // marginTop: Platform.OS === 'android' ? Layout.ScreenHeight - 450 - StatusBarHeight : Layout.ScreenHeight - 450,
    flexDirection: 'row',
    flex: 1,
    width: Layout.WINDOW_WIDTH,
    marginBottom: 0,
    height: 450,
    backgroundColor: 'white',
  },
  mDetailBox: {
    width: Layout.WINDOW_WIDTH,
    height: 450,
    alignItems: 'center',
  },
  mTitleView: {
    width: Layout.WINDOW_WIDTH,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  mDetailTitle: {
    width: Layout.WINDOW_WIDTH - 100,
    color: Colors.fontBlackColor_43,
    fontSize: 18,
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
    marginLeft: 50,
  },
  mDetailCancelBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  mDetailCancelIcon: {
    width: 40,
    height: 40,
  },
  mDetailAmount: {
    height: 60,
    lineHeight: 60,
    color: Colors.fontBlackColor_43,
    fontSize: 22,
    fontWeight: '600',
  },
  mDetailItemView: {
    flexDirection: 'row',
    width: Layout.WINDOW_WIDTH - 40,
    marginTop: 15,
    marginBottom: 15,
  },
  mDetailItemTitle: {
    color: Colors.fontGrayColor_a,
    fontSize: 15,
    width: 80,
  },
  mDetailItemDesc: {
    flex: 1,
  },
  mDetailItemGray: {
    fontSize: 14,
    color: Colors.fontGrayColor_a,
  },
  mDetailItemBlack: {
    fontSize: 14,
    color: Colors.fontBlackColor_43,
  },

  mVLine: {
    width: Layout.WINDOW_WIDTH,
    height: 1,
    backgroundColor: Colors.bgGrayColor_e5,
  },
  mItenLine: {
    width: Layout.WINDOW_WIDTH - 40,
    height: 1,
    backgroundColor: Colors.bgGrayColor_e5,
  },

  mPwdBox: {
    width: Layout.WINDOW_WIDTH,
    height: 450,
    alignItems: 'center',
    marginRight: 0,
    marginBottom: 0,
  },
  mPwdBackBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mPwdBackIcon: {
    width: 30,
    height: 30,
  },
  mPwdTitle: {
    width: Layout.WINDOW_WIDTH - 100,
    color: Colors.fontBlackColor_43,
    fontSize: 18,
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
    marginRight: 50,
  },
  mPwdContentBox: {
    flex: 1,
    alignItems: 'center',
  },
  mPwdInput: {
    marginTop: 15,
    height: 40,
    borderColor: Colors.bgGrayColor_e5,
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 10,
    width: Layout.WINDOW_WIDTH - 40,
    fontSize: 15,
    color: Colors.fontGrayColor_a,
  },
  modalNextBtn: {
    marginTop: 30,
  },
  modalConfirmBtnView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalConfirmBtn: {
    marginBottom: 30,
  },

  modalPromptBox: {
    flexDirection: 'row',
    width: 80,
  },
  mPropmptDetailItemTitle: {
    color: Colors.fontGrayColor_a,
    fontSize: 15,
    width: 60,
  },
  modalPromptTouch: {
    width: 20,
    height: 30,
  },
  modalTriangleIcon: {
    width: 12,
    height: 10,
    marginTop: -14,
  },
  modalPromptDescView: {
    position: 'absolute',
    width: contentWidth,
    alignSelf: 'center',
    backgroundColor: 'rgba(63,193,255,0.8)',
    borderRadius: 5,
    padding: 10,
    top: 38,
    zIndex: 10,
  },
});

class ItcMappingServiceScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      initiationAddress: '', // 发起地址
      gasCost: '', // Gas费用
      isShowPrompt: false,
      isDisabled: true,
      itcWallet: {},

      isShowMappingDetail: false,
    };

    this.inputAmount = '';
    this.ethAmount = '0.008';
    this.gasAmount = '600';

    this.stepItem1Ref = React.createRef();
    this.stepItem2Ref = React.createRef();

    // this.scroll = React.createRef();
    // this.inputText = React.createRef();
  }

  _initData = () => {
    const { mappingData } = this.props.navigation.state.params;
    this.setState({
      initiationAddress: mappingData.initiationAddress,
      itcWallet: mappingData.itcWallet,
      gasCost: `Gas${I18n.t('mapping.cost')}:0.0056 eth`, // Gas费用
    });
    this.INPUT.focus();
  };

  mappingRecord = () => {
    Keyboard.dismiss();
    this.props.navigation.navigate('MappingRecords');
  };

  confirmBtn = () => {
    this.INPUT.blur();
    this.setState({
      isShowMappingDetail: true,
    });
  };

  warnBtn = () => {
    const isShow = this.state.isShowPrompt;
    this.setState({
      isShowPrompt: !isShow,
    });
  };

  onAmountChangeText = text => {
    this.inputAmount = text;
    if (this.inputAmount !== '') {
      this.setState({
        isDisabled: false,
      });
    }
  };

  modalCancelBtn = () => {
    this.setState({
      isShowMappingDetail: false,
    });
  };

  modalConfirmBtn = () => {
    this.setState({
      isShowMappingDetail: false,
    });
    this.props.navigation.navigate('MappingRecords');
  };

  _onChaneAddressPress = () => {
    const { itcWallet } = this.state;
    const _this = this;
    this.props.navigation.navigate('ChangeBindAddress', {
      chosedItcWallet: itcWallet,
      callback(data) {
        _this.setState({
          itcWallet: data.itcWallet,
        });
      },
    });
  };

  _toMappingGuide = () => {
    this.props.navigation.navigate('MappingGuide');
  };

  renderComponent = () => {
    const { initiationAddress, itcWallet, gasCost } = this.state;
    const topImg = require('../../assets/mapping/mappingService.png');
    return (
      <View
        style={styles.container}
        onResponderGrant={() => {
          Keyboard.dismiss();
        }}
      >
        <WhiteBgHeader
          navigation={this.props.navigation}
          text={I18n.t('mapping.itc_mapping_service')}
          rightPress={this.mappingRecord}
          rightText={I18n.t('mapping.mapping_record')}
        />

        <KeyboardAvoidingView
          style={styles.keyboardAwareScrollView}
          keyboardShouldPersistTaps="handled"
          behavior="padding"
          keyboardVerticalOffset={-StatusBarHeight}
        >
          <ConfirmMappingModal
            visible={this.state.isShowMappingDetail}
            amount={this.inputAmount}
            payAddress={itcWallet.address}
            ethAmount={this.ethAmount}
            gasAmount={this.gasAmount}
            pwdInputChangeText={this.pwdInputChangeText}
            modalCancelBtn={this.modalCancelBtn}
            modalConfirmBtn={this.modalConfirmBtn}
          />
          <ImageBackground style={styles.topImg} source={topImg} resizeMode="center">
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.mappingGuideBox}
              onPress={this._toMappingGuide}
            >
              <Text style={styles.mappingGuideText}>{I18n.t('mapping.mapping_guide')}</Text>
            </TouchableOpacity>
          </ImageBackground>
          <View style={styles.mAddressBox}>
            <View style={styles.mAddressContent}>
              <Text style={styles.mAddressTitle}>
                {I18n.t('mapping.native_itc_receive_address')}
              </Text>
              <Text style={styles.mAddressText}>{itcWallet.address}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.changeBox}
              onPress={this._onChaneAddressPress}
            >
              <Text style={styles.changeText}>{I18n.t('mapping.change')}</Text>
              <Image
                style={styles.changeIcon}
                source={require('../../assets/common/right_gray.png')}
                resizeMode="center"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.mAmountTitle}>{I18n.t('mapping.map_amount')}</Text>
          <View style={styles.mAmountInputView}>
            <TextInput
              style={[styles.mAmountInput]}
              ref={textinput => {
                this.INPUT = textinput;
              }}
              placeholderTextColor={Colors.fontGrayColor_a0}
              placeholder=""
              underlineColorAndroid="transparent"
              selectionColor="#00bfff"
              multiline={false}
              returnKeyType="done"
              keyboardType="numeric"
              onChangeText={this.onAmountChangeText}
            />
            <Text style={styles.unit}>ITC</Text>
          </View>
          <View style={styles.vLine} />
          <View style={styles.initiationAddressBox}>
            <View style={styles.initiationAddressContent}>
              <Text style={styles.initiationAddressText}>
                {I18n.t('mapping.initiation_address')}
              </Text>
              <View style={styles.promptBox}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.promptTouch}
                  onPress={this.warnBtn}
                >
                  <Image
                    style={styles.promptIcon}
                    source={require('../../assets/mapping/sighIcon.png')}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {this.state.isShowPrompt ? (
                  <Image
                    style={styles.triangleIcon}
                    source={require('../../assets/common/up_triangle.png')}
                    resizeMode="contain"
                  />
                ) : null}
              </View>
            </View>
            <Text style={styles.commonText}>{initiationAddress}</Text>
            <Text style={styles.commonText}>{gasCost}</Text>

            {this.state.isShowPrompt ? (
              <View style={styles.promptDescView}>
                <Text style={styles.promptDesc}>{I18n.t('mapping.initiation_address_prompt')}</Text>
              </View>
            ) : null}
          </View>

          <BlueButtonBig
            buttonStyle={styles.btn}
            isDisabled={this.state.isDisabled}
            onPress={this.confirmBtn}
            text={I18n.t('mapping.confirm_mapping')}
          />
        </KeyboardAvoidingView>
      </View>
    );
  };
}

class ConfirmMappingModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmBtnIsDisabled: true,
      isShowPromptModal: false,
    };
    this.inputPwd = '';
  }

  toInputPwd = () => {
    this.SCROLL.scrollTo({ x: Layout.WINDOW_WIDTH, y: 0, animated: true });
  };

  toMappingDetail = () => {
    this.SCROLL.scrollTo({ x: 0, y: 0, animated: true });
  };

  pwdInputChangeText = text => {
    this.inputPwd = text;
    const isDisabled = !!(text === '' || text.length < 8);
    this.setState({
      confirmBtnIsDisabled: isDisabled,
    });
  };

  confirmBtn = () => {
    const { modalConfirmBtn } = this.props;
    modalConfirmBtn(this.inputPwd);
  };

  render() {
    const { amount, payAddress, ethAmount, gasAmount, visible, modalCancelBtn } = this.props;
    const { isShowPromptModal, confirmBtnIsDisabled } = this.state;
    const amountInfo = `${amount} ITC`;
    const ethAmountInfo = `${ethAmount}ether`;
    const gasAmountInfo = `= Gas(${gasAmount})*Gas price(`; // + `11.00 gewl)`;

    return (
      <Modal
        onStartShouldSetResponder={() => false}
        animationType="none"
        transparent
        visible={visible}
        onRequestClose={() => console.log('close')}
        onShow={() => console.log('show')}
      >
        <View style={styles.modalBox}>
          <View style={styles.modalContent}>
            <KeyboardAvoidingView
              style={styles.modalKeyboardContainer}
              keyboardShouldPersistTaps="handled"
              behavior="padding"
            >
              <ScrollView
                ref={scroll => {
                  this.SCROLL = scroll;
                }}
                style={styles.modalScrollView}
                keyboardShouldPersistTaps="handled"
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                bounces={false}
                behavior="padding"
              >
                <View style={styles.mDetailBox}>
                  <View style={styles.mVLine} />
                  <View style={styles.mTitleView}>
                    <Text style={styles.mDetailTitle}>{I18n.t('mapping.mapping_detail')}</Text>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={styles.mDetailCancelBtn}
                      onPress={modalCancelBtn}
                    >
                      <Image
                        style={styles.mDetailCancelIcon}
                        source={require('../../assets/common/cancel.png')}
                        resizeMode="center"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.mVLine} />
                  <Text style={styles.mDetailAmount}>{amountInfo}</Text>
                  <View style={styles.mDetailItemView}>
                    <Text style={styles.mDetailItemTitle}>{I18n.t('mapping.payment_infor')}</Text>
                    <Text style={[styles.mDetailItemDesc, styles.mDetailItemGray]}>
                      {I18n.t('mapping.itc_mapping')}
                    </Text>
                  </View>
                  <View style={styles.mItenLine} />
                  <View style={styles.mDetailItemView}>
                    <Text style={styles.mDetailItemTitle}>
                      {I18n.t('mapping.initiation_address')}
                    </Text>
                    <Text style={[styles.mDetailItemDesc, styles.mDetailItemBlack]}>
                      {payAddress}
                    </Text>
                  </View>
                  <View style={styles.mItenLine} />
                  <View>
                    <View style={styles.mDetailItemView}>
                      <View style={styles.modalPromptBox}>
                        <Text style={styles.mPropmptDetailItemTitle}>
                          {I18n.t('mapping.dedicated_mapping_address')}
                        </Text>
                        <View>
                          <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.modalPromptTouch}
                            onPress={() => {
                              const isShow = isShowPromptModal;
                              this.setState({
                                isShowPromptModal: !isShow,
                              });
                            }}
                          >
                            <Image
                              style={styles.promptIcon}
                              source={require('../../assets/mapping/sighIcon.png')}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                          {isShowPromptModal ? (
                            <Image
                              style={styles.modalTriangleIcon}
                              source={require('../../assets/common/up_triangle.png')}
                              resizeMode="contain"
                            />
                          ) : null}
                        </View>
                      </View>
                      <Text style={[styles.mDetailItemDesc, styles.mDetailItemBlack]}>
                        {payAddress}
                      </Text>
                    </View>
                    <View style={styles.mItenLine} />
                    <View style={styles.mDetailItemView}>
                      <Text style={styles.mDetailItemTitle}>
                        {I18n.t('transaction.miner_cost')}
                      </Text>
                      <View style={styles.mDetailItemDesc}>
                        <Text style={styles.mDetailItemBlack}>{ethAmountInfo}</Text>
                        <Text style={styles.mDetailItemGray}>{gasAmountInfo}</Text>
                      </View>
                    </View>
                    {isShowPromptModal ? (
                      <View style={styles.modalPromptDescView}>
                        <Text style={styles.promptDesc}>
                          {I18n.t('mapping.dedicated_mapping_address_desc')}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <BlueButtonBig
                    buttonStyle={styles.modalNextBtn}
                    onPress={this.toInputPwd}
                    text={I18n.t('mapping.next')}
                  />
                </View>

                <View style={styles.mPwdBox}>
                  <View style={styles.mVLine} />
                  <View style={styles.mTitleView}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={styles.mPwdBackBtn}
                      onPress={this.toMappingDetail}
                    >
                      <Image
                        style={styles.mPwdBackIcon}
                        source={require('../../assets/common/common_back.png')}
                        resizeMode="center"
                      />
                    </TouchableOpacity>
                    <Text style={styles.mPwdTitle}>{I18n.t('transaction.wallet_password')}</Text>
                  </View>
                  {/* <View style={styles.mPwdContentBox}> */}
                  <TextInput
                    style={styles.mPwdInput}
                    returnKeyType="done"
                    placeholderTextColor={Colors.fontGrayColor_a0}
                    placeholder={I18n.t('transaction.enter_password_hint')}
                    underlineColorAndroid="transparent"
                    selectionColor="#00bfff"
                    multiline={false}
                    secureTextEntry
                    onChangeText={this.pwdInputChangeText}
                  />
                  {/* </View> */}
                  <View style={styles.modalConfirmBtnView}>
                    <BlueButtonBig
                      buttonStyle={styles.modalConfirmBtn}
                      onPress={this.confirmBtn}
                      isDisabled={confirmBtnIsDisabled}
                      text={I18n.t('mapping.next')}
                    />
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
  setContactList: contacts => dispatch(Actions.setContactList(contacts)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItcMappingServiceScreen);
