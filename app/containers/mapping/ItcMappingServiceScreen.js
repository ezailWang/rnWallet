import React, { Component, PureComponent } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import StorageManage from '../../utils/StorageManage'
import { BlueButtonBig } from '../../components/Button'
import { Colors, StorageKey } from '../../config/GlobalConfig'
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import Layout from '../../config/LayoutConstants'
import BaseComponent from '../base/BaseComponent';
const StatusBarHeight = StatusBar.currentHeight;
const contentWidth = Layout.WINDOW_WIDTH * 0.9
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },

    topImg: {
        width: contentWidth,
        height: contentWidth * 0.16,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    mAddressBox: {
        width: contentWidth,
        alignSelf: 'center',
    },
    mAddressContent: {
        alignSelf: 'center',
        width: contentWidth,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.bgGrayColor_ed,
        padding: 15,

    },
    mAddressTitleView: {
        flexDirection: 'row',
    },
    mAddressTitle: {
        color: Colors.fontGrayColor_a,
        fontSize: 14,
        height: 22,
        lineHeight: 22,
    },
    mAddressWarnView: {
        //marginLeft: 10,
    },
    mAddressWarnTouch: {
        width: 40,
        height: 22,
    },
    warnIcon: {
        width: 22,
        height: 22,
    },
    triangleIcon: {
        width: 21,
        height: 10,
        marginTop: -5,
    },
    mAddressText: {
        color: Colors.fontGrayColor_a,
        fontSize: 14,
        width: contentWidth - 30,
        textAlign: 'left',
    },
    mAmountTitle: {
        width: contentWidth,
        alignSelf: 'center',
        color: Colors.fontBlueColor,
        fontSize: 18,
        marginTop: 25,
    },
    mAmountInputView: {
        flexDirection: 'row',
        marginTop: 10,
        width: contentWidth,
        alignSelf: 'center',
        //height: 50,
        alignItems: 'flex-end',

    },
    mAmountInput: {
        flex: 1,
        fontSize: 26,
        fontWeight: '600',
        // height: 50,
        //textAlignVertical: 'bottom',
        color: Colors.fontBlueColor,
    },
    unit: {
        fontSize: 26,
        color: Colors.fontBlueColor,
        fontWeight: '600',
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
        marginTop: 2,
        alignSelf: 'center',
    },
    btn: {
        alignSelf: 'center',
    },

    warnDescView: {
        position: 'absolute',
        width: contentWidth - 30,
        alignSelf: 'center',
        backgroundColor: 'rgba(63,193,255,0.8)',
        borderRadius: 5,
        padding: 6,
        marginTop: 40,
        marginBottom: 10,
    },
    warnDesc: {
        fontSize: 13,
        color: 'white'
    },



    modalBox: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: Colors.blackOpacityColor,
    },
    modalContent:{
        height: 400,
        backgroundColor:'white',
        width: Layout.WINDOW_WIDTH,
    },
    modalKeyboardContainer: {
        marginTop: Platform.OS === 'android' ? Layout.ScreenHeight - 400 - StatusBarHeight : Layout.ScreenHeight - 400,
        height: 400,
        marginBottom: 0,
        marginRight: 0,
        marginLeft: 0,
    },
    modalScrollView: {
        flexDirection: 'row',
        flex: 1,
        width: Layout.WINDOW_WIDTH,
        height: 400,
        marginBottom: 0,
    },
    mDetailBox: {
        width: Layout.WINDOW_WIDTH,
        height: 400,
        alignItems: 'center'
    },
    mTitleView: {
        width: Layout.WINDOW_WIDTH,
        flexDirection: 'row',
        height: 50,
        alignItems: 'center'
    },
    mDetailTitle: {
        width: Layout.WINDOW_WIDTH-100,
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
        fontWeight: '600'
    },
    mDetailItemView: {
        flexDirection: 'row',
        width: Layout.WINDOW_WIDTH - 40,
        marginTop: 15,
        marginBottom: 15,
    },
    mDetailItemTitle: {
        color: Colors.fontGrayColor_a,
        fontSize: 16,
        width: 80,
    },
    mDetailItemDesc: {
        flex: 1,
    },
    mDetailItemGray: {
        fontSize: 15,
        color: Colors.fontGrayColor_a,
    },
    mDetailItemBlack: {
        fontSize: 15,
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
        height: 400,
        alignItems: 'center',
        marginRight: 0,
        marginTop: 0,
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
        width: Layout.WINDOW_WIDTH-100,
        color: Colors.fontBlackColor_43,
        fontSize: 18,
        height: 50,
        lineHeight: 50,
        textAlign: 'center',
        marginRight: 50,
    },
    mPwdContentBox: {
        flex: 1,
        alignItems: 'center'
    },
    mPwdInput: {
        marginTop: 20,
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
    modalConfirmBtn: {
        marginBottom: 30,
    }


})

class ItcMappingServiceScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            mappingAddress: '',//专属映射地址
            initiationAddress: '',//发起地址
            gasCost: '',//Gas费用
            isShowWarn: false,
            isDisabled: true,

            isShowMappingDetail: false,
        }

        this.inputAmount = ''
        this.ethAmount = '0.008'
        this.gasAmount = '600'
    }

    _initData() {

        this.setState({
            mappingAddress: '0xf6C9e322b688A434833dE530E4c23CFA4e579a7a',
            initiationAddress: '0xf6C9e322b688A434833dE530E4c23CFA4e579a7a',
            gasCost: 'Gas' + I18n.t('mapping.cost') + ':0.0056 eth',//Gas费用
        })
        this.inputText.focus()
    }


    mappingRecord = () => {
        this.props.navigation.navigate('MappingRecords')
    }

    confirmBtn = () => {
        this.setState({
            isShowMappingDetail: true,
        })
    }

    warnBtn = () => {
        this.setState({
            isShowWarn: !this.state.isShowWarn,
        })
    }


    onAmountChangeText = (text) => {
        this.inputAmount = text;
        if (this.inputAmount != '') {
            this.setState({
                isDisabled: false,
            })
        }
    }

   

    modalCancelBtn = () => {
        this.setState({
            isShowMappingDetail: false,
        })
    }

    modalConfirmBtn = () => {
        this.setState({
            isShowMappingDetail: false,
        })
        this.props.navigation.navigate('MappingRecords')
    }


    renderComponent() {
        let topImg = require('../../assets/mapping/mappingService.png')
        return (
            <View style={styles.container}>
                <WhiteBgHeader navigation={this.props.navigation}
                    text={I18n.t('mapping.itc_mapping_service')}
                    rightPress={this.mappingRecord}
                    rightText={I18n.t('mapping.mapping_record')} />
                <ConfirmMappingModal
                    visible={this.state.isShowMappingDetail}
                    amount={this.inputAmount}
                    payAddress={this.state.mappingAddress}
                    ethAmount={this.ethAmount}
                    gasAmount={this.gasAmount}
                    pwdInputChangeText={this.pwdInputChangeText}
                    modalCancelBtn={this.modalCancelBtn}
                    modalConfirmBtn={this.modalConfirmBtn}
                ></ConfirmMappingModal>
                <Image style={styles.topImg} source={topImg} resizeMode={'center'}></Image>
                <View style={styles.mAddressBox}>
                    <View style={styles.mAddressContent}>
                        <View style={styles.mAddressTitleView}>
                            <Text style={styles.mAddressTitle}>{I18n.t('mapping.dedicated_mapping_address')}</Text>
                            <View style={styles.mAddressWarnView}>
                                <TouchableOpacity activeOpacity={0.6}
                                    style={styles.mAddressWarnTouch}
                                    onPress={this.warnBtn}>
                                    <Image style={styles.warnIcon} source={require('../../assets/mapping/sighIcon.png')} resizeMode={'center'} ></Image>

                                </TouchableOpacity>
                                {
                                    this.state.isShowWarn ?
                                        <Image style={styles.triangleIcon} source={require('../../assets/mapping/upTriangle.png')} resizeMode={'center'} ></Image> : null
                                }

                            </View>

                        </View>
                        <Text style={styles.mAddressText}>{this.state.mappingAddress}</Text>


                    </View>
                    {this.state.isShowWarn ?
                        <View style={styles.warnDescView}>
                            <Text style={styles.warnDesc}>{I18n.t('mapping.dedicated_mapping_address_desc')}</Text>
                        </View> : null}

                </View>
                <Text style={styles.mAmountTitle}>{I18n.t('mapping.map_amount')}</Text>
                <View style={styles.mAmountInputView}>

                    <TextInput style={[styles.mAmountInput]}
                        ref={(input) => {
                            this.inputText = input;
                        }}
                        placeholderTextColor={Colors.fontGrayColor_a0}
                        placeholder={''}
                        underlineColorAndroid='transparent'
                        selectionColor='#00bfff'
                        multiline={false}
                        returnKeyType={"done"}
                        keyboardType='numeric'
                        onChangeText={this.onAmountChangeText}>
                    </TextInput>
                    <Text style={styles.unit}>ITC</Text>
                </View>
                <View style={styles.vLine} ></View>
                <Text style={styles.commonText}>{I18n.t('mapping.initiation_address')}</Text>
                <Text style={styles.commonText}>{this.state.initiationAddress}</Text>
                <Text style={styles.commonText}>{this.state.gasCost}</Text>
                <BlueButtonBig
                    buttonStyle={styles.btn}
                    isDisabled={this.state.isDisabled}
                    onPress={this.confirmBtn}
                    text={I18n.t('mapping.confirm_mapping')}
                />
            </View>
        );
    }
}



class ConfirmMappingModal extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            confirmBtnIsDisabled: true
        }
        this.inputPwd = ''
    }

    toInputPwd = () => {
        this.scroll.scrollTo({ x: Layout.WINDOW_WIDTH, y: 0, animated: true });
    }
    toMappingDetail = () => {
        this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    }
    pwdInputChangeText = (text) => {
        this.inputPwd = text
        let isDisabled = (text == '' || text.length < 8) ? true : false
        this.setState({
            confirmBtnIsDisabled: isDisabled,
        })
    }

    confirmBtn = () => {
        this.props.modalConfirmBtn(this.inputPwd)
    }

    render() {
        let amountInfo = this.props.amount + ' ITC';
        let payAddress = this.props.payAddress;
        let ethAmountInfo = this.props.ethAmount + 'ether';
        let gasAmountInfo = '= Gas(' + this.props.gasAmount + ')*Gas price(' + '11.00 gewl)';
        return (
            <Modal
                onStartShouldSetResponder={() => false}
                animationType={'none'}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    //Alert.alert("Modal has been closed.");
                }}
                onShow={() => {
                    //Alert.alert("Modal has been show.");
                }}
            >
                <View style={styles.modalBox}>

                    <View style={styles.modalContent}>
                        <KeyboardAwareScrollView
                            style={styles.modalKeyboardContainer}
                            keyboardShouldPersistTaps={'handled'}>
                            <ScrollView
                                ref={(scroll) => {
                                    this.scroll = scroll;
                                }}
                                style={styles.modalScrollView}
                                keyboardShouldPersistTaps={'handled'}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={false}
                                bounces={false}
                                behavior="padding"
                            >
                                <View style={styles.mDetailBox}>
                                    <View style={styles.mVLine}></View>
                                    <View style={styles.mTitleView}>
                                        <Text style={styles.mDetailTitle}>{I18n.t('mapping.mapping_detail')}</Text>
                                        <TouchableOpacity activeOpacity={0.6}
                                            style={styles.mDetailCancelBtn}
                                            onPress={this.props.modalCancelBtn}>
                                            <Image style={styles.mDetailCancelIcon} source={require('../../assets/transfer/transfer_cancel.png')} resizeMode={'center'} ></Image>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.mVLine}></View>
                                    <Text style={styles.mDetailAmount}>{amountInfo}</Text>
                                    <View style={styles.mDetailItemView}>
                                        <Text style={styles.mDetailItemTitle}>{I18n.t('mapping.payment_infor')}</Text>
                                        <Text style={[styles.mDetailItemDesc, styles.mDetailItemGray]}>{I18n.t('mapping.itc_mapping')}</Text>
                                    </View>
                                    <View style={styles.mItenLine}></View>
                                    <View style={styles.mDetailItemView}>
                                        <Text style={styles.mDetailItemTitle}>{I18n.t('transaction.payment_address')}</Text>
                                        <Text style={[styles.mDetailItemDesc, styles.mDetailItemBlack]}>{payAddress}</Text>
                                    </View>
                                    <View style={styles.mItenLine}></View>
                                    <View style={styles.mDetailItemView}>
                                        <Text style={styles.mDetailItemTitle}>{I18n.t('transaction.miner_cost')}</Text>
                                        <View style={styles.mDetailItemDesc}>
                                            <Text style={styles.mDetailItemBlack}>{ethAmountInfo}</Text>
                                            <Text style={styles.mDetailItemGray}>{gasAmountInfo}</Text>
                                        </View>
                                    </View>
                                    <BlueButtonBig
                                        buttonStyle={styles.modalNextBtn}
                                        onPress={this.toInputPwd}
                                        text={I18n.t('mapping.next')}
                                    />
                                </View>

                                <View style={styles.mPwdBox}>
                                    <View style={styles.mVLine}></View>
                                    <View style={styles.mTitleView}>
                                        <TouchableOpacity activeOpacity={0.6}
                                            style={styles.mPwdBackBtn}
                                            onPress={this.toMappingDetail}>
                                            <Image style={styles.mPwdBackIcon} source={require('../../assets/common/common_back.png')} resizeMode={'center'} ></Image>
                                        </TouchableOpacity>
                                        <Text style={styles.mPwdTitle}>{I18n.t('transaction.wallet_password')}</Text>
                                    </View>
                                    <View style={styles.mPwdContentBox}>
                                        <TextInput style={styles.mPwdInput}
                                            ref={(input) => {
                                                this.inputPwdText = input;
                                            }}
                                            returnKeyType='done'
                                            placeholderTextColor={Colors.fontGrayColor_a0}
                                            placeholder={I18n.t('transaction.enter_password_hint')}
                                            underlineColorAndroid='transparent'
                                            selectionColor='#00bfff'
                                            multiline={false}
                                            secureTextEntry={true}
                                            onChangeText={this.pwdInputChangeText}
                                            >
                                        </TextInput>
                                    </View>
                                    <BlueButtonBig
                                        buttonStyle={styles.modalConfirmBtn}
                                        onPress={this.confirmBtn}
                                        isDisabled={this.state.confirmBtnIsDisabled}
                                        text={I18n.t('mapping.next')}
                                    />
                                </View>
                            </ScrollView>
                        </KeyboardAwareScrollView>
                    </View>

                </View>
            </Modal>
        )
    }
}





const mapStateToProps = state => ({
    contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
    setContactList: (contacts) => dispatch(Actions.setContactList(contacts)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ItcMappingServiceScreen)


