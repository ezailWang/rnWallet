
import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Dimensions,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    InteractionManager,
    Platform,
    PermissionsAndroid,
    BackHandler,
    Keyboard
} from 'react-native';

import { Colors, TransferGasLimit, TransferType } from "../../config/GlobalConfig";
import TransactionStep from './TransactionStep'
import NetworkManager from '../../utils/networkManage';
import { store } from '../../config/store/ConfigureStore'

import PropTypes from 'prop-types';
import { BlueButtonBig } from '../../components/Button'
import Slider from '../../components/Slider'
import { androidPermission } from '../../utils/permissionsAndroid';
import StorageManage from '../../utils/StorageManage'
import keystoreUtils from '../../utils/keystoreUtils'
import keythereum from 'keythereum'
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import BaseComponent from '../base/BaseComponent';
import { showToast } from '../../utils/Toast';

import { setNewTransaction } from '../../config/action/Actions';

import I18n from 'react-native-i18n'


let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    contentBox: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    sectionView: {
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        height: 90
    },
    sectionViewTopView: {
        flexDirection: "row",
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
        backgroundColor: "white",
        justifyContent: "center",
    },
    shadowStyle: {
        shadowColor: '#A9A9A9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        //elevation: 3
    },
    sectionViewTitleText: {
        flex: 1,
        marginLeft: 20,
        marginTop: 20,
        height: 20,
        //width: ScreenWidth / 3,
        color: Colors.fontBlackColor_43,
        // backgroundColor:"green"
    },

    infoViewDetailTitleTouchable:{
        alignSelf:'center',
        // textAlign: "right",
        marginTop: 18,
        height:20,
        marginLeft: 0,
        marginRight: 20,
        // backgroundColor:'red',
    },
    blueText: {
        color: Colors.fontBlueColor,
        //width: 2 * ScreenWidth / 3 - 40,
    },
    sectionViewTextInput: {
        marginLeft: 20,
        height: 38,
        marginRight: 20,
        fontSize: 12,
        color:Colors.fontBlackColor_43
    },
    sliderBottomView: {
        marginTop: 12,
        marginLeft: 0,
        marginRight: 0,
        height: 140,
        backgroundColor: "white"
    },
    sliderTitleContainerView: {
        flexDirection: "row",
        height: 40,
        alignItems: "center",
        justifyContent: "space-between",
        width: ScreenWidth,
    },
    sliderTitle: {
        marginLeft: 20,
        color: Colors.fontBlackColor
    },
    buttonTitle: {
        fontSize: 20,
        color: Colors.fontWhiteColor,
        textAlign: "center",
        fontWeight: "bold"
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
        //marginLeft: 40,
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    transferPrice: {
        textAlign: "center",
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
        elevation: 5
    },
});

//section封装视图
const SectionView = ({ titleText, placeHolder, detailTitle, returnKeyType, targetInput }) => (
    <View style={styles.sectionView}>
        <View style={styles.sectionViewTopView}>
            <Text style={styles.sectionViewTitleText}>{titleText}</Text>
            <Text style={styles.blueText}>{detailTitle}</Text>
        </View>

        <View style={[styles.sectionViewBottomView, (Platform.OS == 'ios' ? styles.shadowStyle : {})]}>
            <TextInput style={styles.sectionViewTextInput}
                placeholder={placeHolder}
                returnKeyType={returnKeyType}
                ref={(textInput) => {
                    targetInput = textInput;
                }}>
            </TextInput>
        </View>
    </View>
);


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
        detailTitlePress: PropTypes.func,
    };
    static defaultProps = {
        barStyle: 'dark-content',
    }
    render() {
        return (
            <View style={styles.sectionView}>
                <View style={styles.sectionViewTopView}>
                    <Text style={styles.sectionViewTitleText}>{this.props.title}</Text>
                    <TouchableOpacity style={styles.infoViewDetailTitleTouchable}
                        activeOpacity={0.6}
                        disabled={this.props.detailTitlePress == undefined ? true : false}
                        onPress={this.props.detailTitlePress}>
                        <Text style={styles.blueText}>{this.props.detailTitle}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.sectionViewBottomView, (Platform.OS == 'ios' ? styles.shadowStyle : {})]}>
                    <TextInput style={styles.sectionViewTextInput}
                        placeholder={this.props.placeholder}
                        returnKeyType={this.props.returnKeyType}
                        keyboardType={this.props.keyboardType}
                        onChangeText={this.props.onChangeText}
                    >{this.props.defaultValue}
                    </TextInput>
                </View>
            </View>
        )
    }
}


class SliderView extends Component {

    static propTypes = {
        gasStr: PropTypes.string.isRequired,
        minGasPrice: PropTypes.number.isRequired,
        maxGasPrice: PropTypes.number.isRequired,
        initValue: PropTypes.number.isRequired,
        onValueChange: PropTypes.func.isRequired
    };

    render() {

        return (
            <View style={[styles.sliderBottomView, styles.shadowStyle]}>
                <View style={styles.sliderTitleContainerView}>
                    <Text style={styles.sliderTitle}>{I18n.t('transaction.miner_fee')}</Text>
                </View>
                <View style={styles.sliderContainerView}>

                    <Slider style={sliderStyle.container}
                        trackStyle={sliderStyle.track}
                        thumbStyle={sliderStyle.thumb}
                        minimumTrackTintColor={Colors.themeColor}
                        maximumTrackTintColor={Colors.fontGrayColor}
                        thumbTouchSize={{ width: 30, height: 24 }}
                        onValueChange={this.props.onValueChange}
                        value={this.props.initValue}
                        minimumValue={this.props.minGasPrice}
                        maximumValue={this.props.maxGasPrice}
                        step={1}
                    />
                </View>
                <View style={styles.sliderAlertView}>
                    <Text>{I18n.t('transaction.fast')}</Text>
                    <Text style={styles.transferPrice}>{this.props.gasStr}</Text>
                    <Text style={{ alignSelf: 'flex-end' }}>{I18n.t('transaction.slow')}</Text>
                </View>
            </View>
        )
    }
}


export default class Transaction extends BaseComponent {

    constructor(props) {
        super(props);
        //参数
        let params = store.getState().Core.walletTransfer;

        this.didTapSurePasswordBtn = this.didTapSurePasswordBtn.bind(this);
        this.didTapNextBtn = this.didTapNextBtn.bind(this);
        this.getPriceTitle = this.getPriceTitle.bind(this);
        this.sliderValueChanged = this.sliderValueChanged.bind(this);
        this.getDetailPriceTitle = this.getDetailPriceTitle.bind(this);
        this.params = params;

        this.state = {
            transferType: params.transferType,
            minGasPrice: 1,
            maxGasPrice: 100,
            currentGas: params.suggestGasPrice,
            gasStr: this.getPriceTitle(params.suggestGasPrice, params.ethPrice),
            transferValue: -1,
            toAddress: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
            fromAddress: params.fromAddress,
            detailData: "",
            defaultTransferValue: '',
            isDisabled:true
        };

    };

    /**static navigationOptions = ({navigation}) => ({
        header:<WhiteBgHeader navigation={navigation} text={ComponentTitle()}/>
    })**/

    getPriceTitle = (gasPrice, ethPrice) => {

        let gasLimit = this.params.transferType === TransferType.ETH ? TransferGasLimit.ethGasLimit : TransferGasLimit.tokenGasLimit;

        let totalGas = gasPrice * 0.001 * 0.001 * 0.001 * gasLimit;
        totalGas = totalGas.toFixed(8);
        // let totalGasPrice = totalGas * ethPrice;
        // totalGasPrice = totalGasPrice.toFixed(8);
        // return totalGas + "ether≈" + totalGasPrice + "$";

        return totalGas + " ether";
    };

    getDetailPriceTitle = () => {
        let gasLimit = this.params.transferType === TransferType.ETH ? TransferGasLimit.ethGasLimit : TransferGasLimit.tokenGasLimit;
        let totalGas = this.state.currentGas * 0.001 * 0.001 * 0.001 * gasLimit;
        totalGas = totalGas.toFixed(8);

        return `=Gas(${gasLimit})*Gas Price(${this.state.currentGas})gwei`;
    };

    async startSendTransaction(privateKey){

        // console.warn("开始转账，已验证私钥");

        let { contractAddress, symbol, decimals } = store.getState().Core.balance;

        // console.warn('交易参数：',contractAddress,symbol,decimals,this.state.toAddress,this.state.transferValue,this.state.currentGas)

        let currentBlock = await NetworkManager.getCurrentBlockNumber();
        let res = await NetworkManager.sendTransaction(
            {
                "contractAddress": contractAddress,
                "symbol": symbol,
                "decimals": decimals
            },
            this.state.toAddress,
            this.state.transferValue,
            this.state.currentGas,
            privateKey,
            (hash) => {
                // console.log('hash', hash)

                let { walletAddress } = store.getState().Core

                let newTransaction = {
                    from: walletAddress,
                    to: this.state.toAddress,
                    timeStamp: null,
                    hash: hash,
                    value: this.state.transferValue,
                    isError: "0",
                    gasPrice: this.state.currentGas,
                    blockNumber: currentBlock
                }
                store.dispatch(setNewTransaction(newTransaction));
            },
        )

        // console.warn('交易发送完毕'+res);

        if (res) {
            //回调刷新
            this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();
        }
        else {
            // setTimeout(() => {
                alert(I18n.t('transaction.alert_1'));
            // }, 100);
        }
    }

    async didTapSurePasswordBtn (password){
        // console.warn("输入密码--",password);
        this._showLoding()
       
        setTimeout(async ()=>{

            // console.log("开始执行")

            let  privateKey
            try{
                privateKey = await keystoreUtils.getPrivateKey(password)
                if (privateKey == null) {
                    showToast(I18n.t('modal.password_error'))
                } else {
                    await this.startSendTransaction(privateKey)
                } 
            }catch(err){
                console.log('exportKeyPrivateErr:', err)
            }finally{
                this._hideLoading();
            } 
        },2000)
     };


    didTapNextBtn = () => {
        // console.log('L_next_address', this.state.toAddress)
        if (NetworkManager.isValidAddress(this.state.toAddress) === false) {
            alert(I18n.t('transaction.alert_2'));
            return;
        }

        if (parseFloat(this.state.transferValue) < 0 || parseFloat(this.state.transferValue) > this.params.balance) {
            alert(I18n.t('transaction.alert_3'));
            return;
        }

        //计算gas消耗
        let gasLimit = this.params.transferType === TransferType.ETH ? TransferGasLimit.ethGasLimit : TransferGasLimit.tokenGasLimit;
        let totalGas = this.state.currentGas * 0.001 * 0.001 * 0.001 * gasLimit;
        totalGas = totalGas.toFixed(8);

        if (this.params.ethBalance < totalGas) {

            alert(I18n.t('transaction.alert_4'));
            return;
        }

        let params = {
            fromAddress: this.state.fromAddress,
            toAddress: this.state.toAddress,
            totalAmount: this.state.transferValue + " " + this.params.transferType,
            payType: this.params.transferType + I18n.t('transaction.transfer'),
            gasPrice: this.getPriceTitle(this.state.currentGas),
            gasPriceInfo: this.getDetailPriceTitle()
        };

        this.dialog.showStepView(params);
    };
    //----视图的事件方法
    sliderValueChanged = (value) => {

        let price = this.getPriceTitle(value, this.params.ethPrice);
        this.setState({
            currentGas: value,
            gasStr: price
        });
    };

    valueTextInputChangeText = (text) => {

        this.setState({
            transferValue: parseFloat(text),
        },()=>{
            this.judgeCanSendInfoCorrect()
        });
    };

    toAddressTextInputChangeText = (text) => {
        
        this.setState({
            toAddress: text
        },()=>{
            this.judgeCanSendInfoCorrect()
        });
    };

    judgeCanSendInfoCorrect (){

        let totalValue = this.params.balance;
        let amountIsNotValid = this.state.transferValue > totalValue
        let addressIsNotValid = !NetworkManager.isValidAddress(this.state.toAddress)

        this.setState({
            isDisabled: amountIsNotValid||addressIsNotValid
        });
    }

    routeContactList = () => {
        let _this = this;
        this.props.navigation.navigate('ContactList', {
            from: 'transaction',
            callback: function (data) {
                var address = data.toAddress;
                // console.log('L_address', address);
                _this.setState({
                    toAddress: address
                })
            }
        })
    }

    detailTextInputChangeText = (text) => {

        this.setState({
            detailData: text
        });
    };

    scanClick = async () => {
        var _this = this;
        //const {navigate} = this.props.navigation;//页面跳转
        //navigation('页面');
        var isAgree = true;
        if (Platform.OS === 'android') {
            isAgree = await androidPermission(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        if (isAgree) {
            this.props.navigation.navigate('ScanQRCode', {
                callback: function (data) {
                    var address = data.toAddress;
                    // console.log('L_address', address);
                    _this.setState({
                        toAddress: address
                    })
                }
            })
        } else {
            Alert.alert(
                'warn',
                I18n.t('transaction.alert_2'),
            )
        }
    }
    renderComponent() {

        let params = store.getState().Core.walletTransfer;
        let title = params.transferType + I18n.t('transaction.transfer');
        let alertHeight = NetworkManager.isValidAddress(this.state.toAddress) ? 0 : 15

        return (
            <View   style={styles.container} 
                    onResponderGrant={() => {
                        Keyboard.dismiss()
                    }}>
                <WhiteBgHeader navigation={this.props.navigation}
                    text={title}
                    rightPress={() => this.scanClick()}
                    rightIcon={require('../../assets/common/scanIcon.png')} />
                {/**<ScrollView style={styles.scrollView}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}>**/}
                <View style={styles.contentBox}>
                    <TransactionStep didTapSurePasswordBtn={(password)=>{
                            this.didTapSurePasswordBtn(password)
                        }}
                        ref={(dialog) => { this.dialog = dialog; }} />
                    <InfoView title={I18n.t('transaction.amount')}
                        detailTitle={I18n.t('transaction.balance') + ':' + parseFloat(this.params.balance).toFixed(4) + this.params.transferType}
                        placeholder={I18n.t('transaction.enter') + this.params.transferType + I18n.t('transaction.amount')}
                        returnKeyType={"next"}
                        keyboardType={'numeric'}
                        onChangeText={this.valueTextInputChangeText}/>
                    {/*转账地址栏*/}
                    <InfoView title={I18n.t('transaction.collection_address')}
                        detailTitle={I18n.t('transaction.address_list')}
                        placeholder={I18n.t('transaction.enter_transfer_address')}
                        returnKeyType={"next"}
                        onChangeText={this.toAddressTextInputChangeText}
                        defaultValue={this.state.toAddress}
                        detailTitlePress={this.routeContactList} />
                    {/*备注栏*/}
                    {/*<InfoView title={"备注"}
                        placeholder={"输入备注"}
                        returnKeyType={"done"}
                        onChangeText={this.detailTextInputChangeText} />*/}
                    {/*滑竿视图*/}
                    <Text style={{height:alertHeight,color:Colors.fontRedColor,textAlign:'right',marginTop:8,marginLeft:20,marginRight:20,fontSize:14}}>{I18n.t('modal.enter_valid_transfer_address')}</Text>
                    <SliderView gasStr={this.state.gasStr}
                        minGasPrice={this.state.minGasPrice}
                        maxGasPrice={this.state.maxGasPrice}
                        initValue={this.params.suggestGasPrice}
                        onValueChange={this.sliderValueChanged} />
                    {/*下一步按钮*/}
                    <View style={styles.buttonBox}>
                        <BlueButtonBig
                            buttonStyle = {styles.button}
                            isDisabled = {this.state.isDisabled}
                            onPress = {()=> this.didTapNextBtn()}
                            text = {I18n.t('transaction.next_step')}
                        /> 
                    </View>
                </View>

            </View>

        )
    }
};