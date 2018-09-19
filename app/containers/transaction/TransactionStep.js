import React, { Component } from 'react'

import {
    Modal,
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    Text,
    TextInput,
    KeyboardAvoidingView,
    StatusBar,
    Platform,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from '../../config/GlobalConfig'
import PropTypes from 'prop-types';
import { store } from '../../config/store/ConfigureStore'
import { I18n } from '../../config/language/i18n'
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.blackOpacityColor,
        justifyContent: "flex-end"
    },
    KeyboardContainer: {
        marginTop: Platform.OS === 'android' ? ScreenHeight - 400 - StatusBarHeight : ScreenHeight - 400,
        height: 400,
        marginBottom: 0,
        marginRight: 0,
        marginLeft: 0,
    },
    scrollView: {
        flexDirection: "row",
        flex: 1,
        height: 400,
    },
    leftContainer: {
        marginLeft: 0,
        backgroundColor: 'white',
        height: 400,
        width: ScreenWidth,
        alignItems: "center",
    },
    rightContainer: {
        marginRight: 0,
        marginTop: 0,
        backgroundColor: 'white',
        height: 400,
        width: ScreenWidth,
        alignItems: "center",
    },
    firstStepTitleView: {
        height: 44,
        width: ScreenWidth,
        marginRight: 0,
        borderBottomColor: Colors.fontGrayColor,
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        alignItems: "center",
    },
    cancelBtn: {
        width: 30,
        height: 30,
        marginLeft: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    titleView: {
        color: Colors.fontBlackColor,
        //marginLeft:0,
        width: ScreenWidth - (30 + 25) * 2,
        fontSize: 17,
        textAlign: "center"
    },
    costTextContainer: {
        height: 50,
        justifyContent: "center"
    },
    costText: {
        fontSize: 20,
        textAlign: "center",
    },
    leftInfoView: {
        height: 210,
        // backgroundColor:"red",
        width: ScreenWidth - 50
    },
    infoTextViewFirst: {
        height: 30,
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor:"red",
        width: ScreenWidth - 60
    },
    infoTitle: {
        fontSize: 13,
        color: Colors.fontDarkGrayColor
    },
    infoDetailTitle: {
        fontSize: 13,
        color: Colors.fontBlackColor,
        marginLeft: 20,
        // marginRight:60
    },
    infoContent: {
        height: 210.0 / 3,
        // backgroundColor:"green",
        flexDirection: "row",
    },
    lineView: {
        height: 0.5,
        backgroundColor: Colors.fontGrayColor
    },
    infoContentTitle: {
        marginTop: 10,
        // backgroundColor:"red"
    },
    infoContentDetailTitle: {
        fontSize: 13,
        color: Colors.fontBlackColor
    },
    infoContentDetailView: {
        marginTop: 10,
        marginLeft: 20,
        marginRight: 10,
        flex: 1,
        // backgroundColor:"blue"
    },
    nextBtn: {
        marginTop: 25,
        height: 44,
        borderRadius: 25,
        width: ScreenWidth - 100,
        backgroundColor: Colors.themeColor,
        justifyContent: "center",
    },
    buttonTitle: {
        //flex:1,
        fontSize: 18,
        color: "white",
        textAlign: "center",
        fontWeight: "bold"
    },
    passwordFrameView: {
        borderWidth: 1,
        borderColor: Colors.fontGrayColor,
        borderRadius: 5,
        width: ScreenWidth - 50,
        marginTop: 20,
        height: 40
    },
    passwordView: {
        flex: 1,
        marginLeft: 15,
        marginRight: 15,
        // backgroundColor:"red",
        height: 40,
        fontSize: 15,
        paddingVertical: 0
    },

});

let InfoTextView = ({ transferType, fromAddress, toAddress, gasPrice, detailGas }) => (
    <View style={styles.leftInfoView}>
        <View style={styles.infoTextViewFirst}>
            <Text style={styles.infoTitle}>
                {I18n.t('transaction.payment_information')}
            </Text>
            <Text style={styles.infoDetailTitle}>
                {transferType}
            </Text>
        </View>
        <InfoContentView
            title={I18n.t('transaction.collection_address')}
            deatilContent={toAddress}>
        </InfoContentView>
        <InfoContentView
            title={I18n.t('transaction.collection_address')}
            deatilContent={fromAddress}>
        </InfoContentView>
        {/* <InfoContentView
            title={"矿工费用"}
            deatilContent={gasPrice}>
        </InfoContentView> */}
        <View style={{ flex: 1 }}>
            <View style={styles.lineView}>
            </View>
            <View style={styles.infoContent}>
                <View style={styles.infoContentTitle}>
                    <Text style={[styles.infoTitle]}>
                        {I18n.t('transaction.miner_cost')}
                    </Text>
                </View>
                <View style={styles.infoContentDetailView}>
                    <Text style={styles.infoContentDetailTitle}>
                        {gasPrice}
                    </Text>
                    <Text style={[styles.infoContentDetailTitle, { color: Colors.fontDarkGrayColor }]}>
                        {detailGas}
                    </Text>
                </View>
            </View>
        </View>
    </View>
);

let InfoContentView = ({ title, deatilContent }) => (
    <View style={{ flex: 1 }}>
        <View style={styles.lineView}>
        </View>
        <View style={styles.infoContent}>
            <View style={styles.infoContentTitle}>
                <Text style={[styles.infoTitle]}>
                    {title}
                </Text>
            </View>
            <View style={styles.infoContentDetailView}>
                <Text style={styles.infoContentDetailTitle}>
                    {deatilContent}
                </Text>
            </View>
        </View>
    </View>
);

export default class TransactionStep extends Component {

    static propsType = {
        didTapSurePasswordBtn: PropTypes.func.isRequired
    };

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            step: false,
            fromAddress: '0x',
            toAddress: '0x',
            totalAmount: "0",
            payType: "",
            gasPrice: '',
            gasPriceInfo: "",
            password: ""
        };
        this.showStepView = this.showStepView.bind(this);
        this.changeStepPage = this.changeStepPage.bind(this);
        this.passWordTextInputChanged = this.passWordTextInputChanged.bind(this)
    }
    // 加载完成
    // componentDidMount() {

    // }
    // view卸载
    // componentWillUnmount() {

    // }

    showStepView(params) {

        let isShow = this.state.show;

        if (params) {

            this.setState({
                show: !isShow,
                fromAddress: params.fromAddress,
                toAddress: params.toAddress,
                totalAmount: params.totalAmount,
                payType: params.payType,
                gasPrice: params.gasPrice,
                gasPriceInfo: params.gasPriceInfo
            })
        }
        else {
            this.setState({
                show: !isShow
            })
        }
    }

    changeStepPage() {
        let currentPage = !this.state.step;

        this.setState({
            step: currentPage
        });

        if (currentPage === false) {
            this.scroll.scrollTo({ x: 0, y: 0, animated: true });
            this.INPUT.blur();
        }
        else {
            this.scroll.scrollTo({ x: ScreenWidth, y: 0, animated: true });
            this.INPUT.focus();
        }
    }

    passWordTextInputChanged(text) {

        this.setState({
            password: text
        })
    }

    render() {
        //const { walletPasswordPrompt } = store.getState().Core
        return (
            <Modal animationType='fade'
                transparent={true}
                visible={this.state.show}
                onShow={() => {
                    console.log('控件显示');
                }}
                onRequestClose={() => {
                    console.log('安卓物理返回');
                }}>
                <View style={styles.container}>
                    <KeyboardAwareScrollView
                        style={styles.KeyboardContainer}
                        keyboardShouldPersistTaps={'handled'}>
                        <ScrollView
                            style={styles.scrollView}
                            keyboardShouldPersistTaps={'handled'}
                            horizontal={true}   //水平方向
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            bounces={false}
                            ref={(scroll) => {
                                this.scroll = scroll;
                            }}
                            behavior="padding">

                            {/*步骤一 确认交易信息*/}
                            <View style={styles.leftContainer}>
                                <View style={styles.firstStepTitleView}>
                                    <TouchableOpacity style={styles.cancelBtn} onPress={this.showStepView}>
                                        <Image resizeMode={'center'}
                                            source={require('../../assets/transfer/transfer_cancel.png')}
                                            style={{ width: 15, height: 15 }}>
                                        </Image>
                                    </TouchableOpacity>
                                    <Text style={styles.titleView}>
                                        {I18n.t('transaction.payment_details')}
                                    </Text>
                                </View>
                                <View style={styles.costTextContainer}>
                                    <Text style={styles.costText}>
                                        {this.state.totalAmount}
                                    </Text>
                                </View>
                                <InfoTextView
                                    transferType={this.state.payType}
                                    fromAddress={this.state.fromAddress}
                                    toAddress={this.state.toAddress}
                                    gasPrice={this.state.gasPrice}
                                    detailGas={this.state.gasPriceInfo}>
                                </InfoTextView>

                                <TouchableOpacity style={styles.nextBtn} onPress={this.changeStepPage}>
                                    <Text style={styles.buttonTitle}>{I18n.t('transaction.next_step')}</Text>
                                </TouchableOpacity>
                            </View>

                            {/*步骤二 ，输入密码*/}
                            <View style={styles.rightContainer}>
                                <View style={[styles.firstStepTitleView, { borderBottomWidth: 0 }]}>
                                    <TouchableOpacity style={styles.cancelBtn} onPress={this.changeStepPage}>
                                        <Image resizeMode={'center'}
                                            source={require('../../assets/common/common_back.png')}
                                            style={{ height: 20, width: 20, }}>
                                        </Image>
                                    </TouchableOpacity>
                                    <Text style={styles.titleView}>
                                        {I18n.t('transaction.wallet_password')}
                                    </Text>
                                </View>
                                <View style={styles.passwordFrameView}>
                                    <TextInput style={styles.passwordView}
                                        placeholder={I18n.t('transaction.enter_password_hint')}
                                        returnKeyType={"done"}
                                        secureTextEntry={true}
                                        onChangeText={this.passWordTextInputChanged}
                                        ref={(textinput) => {
                                            this.INPUT = textinput;
                                        }}>
                                    </TextInput>
                                </View>
                                {/* <Text
                                style={{
                                    fontSize: 13,
                                    paddingLeft: 25,
                                    paddingTop: 5,
                                    alignSelf: 'stretch',
                                    color:Colors.fontGrayColor_a0
                                }}
                            >密码提示: {walletPasswordPrompt}</Text> */}
                                <TouchableOpacity style={styles.nextBtn} onPress={() => {
                                    let password = this.state.password;
                                    // console.warn(password);
                                    this.showStepView();
                                    this.props.didTapSurePasswordBtn(password);
                                }}>
                                    <Text style={styles.buttonTitle}>{I18n.t('transaction.determine')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAwareScrollView>
                </View>
            </Modal>
        )
    }
}