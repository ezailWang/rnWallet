
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
    BackHandler
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
import StatusBarComponent from '../../components/StatusBarComponent';
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import Loading from '../../components/LoadingComponent'

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
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
        marginLeft: 20,
        marginTop: 20,
        height: 20,
        width: ScreenWidth / 3,
        color: Colors.fontBlackColor,
    },
    blueText: {
        textAlign: "right",
        color: Colors.fontBlueColor,
        marginTop: 20,
        marginLeft: 0,
        marginRight: 20,
        height: 20,
        width: 2 * ScreenWidth / 3 - 40,
    },
    sectionViewTextInput: {
        marginLeft: 20,
        height: 38,
        marginRight: 20,
        fontSize: 12
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
    transferPrice: {
        textAlign: "right",
        color: Colors.themeColor,
        marginRight: 20
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
        width: ScreenWidth - 80,
        marginTop: 5,
        marginLeft: 40,
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    buttonBox:{
        marginTop:20,
        alignSelf:'stretch',
        alignItems:'center',
    },

});

const sliderStyle = StyleSheet.create({
    track: {
        height: 14,
        borderRadius: 7,
    },
    thumb: {
        width: 22,
        height: 22,
        borderRadius: 22 / 2,
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
        detailTitle: PropTypes.string,
        placeholder: PropTypes.string.isRequired,
        returnKeyType: PropTypes.string.isRequired,
        onChangeText: PropTypes.func.isRequired,
        keyboardType: PropTypes.string,
        updateValue:PropTypes.string,
    };

    shouldComponentUpdate(){
        console.warn('界面被刷新',this.props.updateValue)

        return true;
    }

    render() {
        return (
            <View style={styles.sectionView}>
                <View style={styles.sectionViewTopView}>
                    <Text style={styles.sectionViewTitleText}>{this.props.title}</Text>
                    <Text style={styles.blueText}>{this.props.detailTitle}</Text>
                </View>
                <View style={[styles.sectionViewBottomView, (Platform.OS == 'ios' ? styles.shadowStyle : {})]}>
                    <TextInput style={styles.sectionViewTextInput}
                        placeholder={this.props.placeholder}
                        returnKeyType={this.props.returnKeyType}
                        keyboardType={this.props.keyboardType}
                        onChangeText={this.props.onChangeText}
                        value={this.props.updateValue}>
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
                    <Text style={styles.sliderTitle}>矿工费</Text>
                    <Text style={styles.transferPrice}>{this.props.gasStr}</Text>
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
                    <Text>慢</Text>
                    <Text style={{ alignSelf: 'flex-end' }}>快</Text>
                </View>
            </View>
        )
    }
}


export default class Transaction extends Component {

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
            //toAddress: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
            toAddress:'',
            fromAddress: params.fromAddress,
            detailData: "",
            loadingShow: false,
            updateValue:''
        };
    };

    /**static navigationOptions = ({navigation}) => ({
        header:<WhiteBgHeader navigation={navigation} text={ComponentTitle()}/>
    })**/

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackPressed);
    }
    componentWillUnmount(){
        this.backHandler && this.backHandler.remove();
    }
    onBackPressed=()=>{ 
        this.props.navigation.goBack();
        return true;
    }

    getPriceTitle = (gasPrice, ethPrice) => {

        let gasLimit = this.params.transferType === TransferType.ETH ? TransferGasLimit.ethGasLimit : TransferGasLimit.tokenGasLimit;

        let totalGas = gasPrice * 0.001 * 0.001 * 0.001 * gasLimit;
        totalGas = totalGas.toFixed(8);
        // let totalGasPrice = totalGas * ethPrice;
        // totalGasPrice = totalGasPrice.toFixed(8);
        // return totalGas + "ether≈" + totalGasPrice + "$";

        return totalGas + "ether";
    };

    getDetailPriceTitle = () => {
        let gasLimit = this.params.transferType === TransferType.ETH ? TransferGasLimit.ethGasLimit : TransferGasLimit.tokenGasLimit;
        let totalGas = this.state.currentGas * 0.001 * 0.001 * 0.001 * gasLimit;
        totalGas = totalGas.toFixed(8);

        return `=Gas(${gasLimit})*Gas Price(${this.state.currentGas})gwei`;
    };

    didTapSurePasswordBtn = async (password) => {
        // console.warn("输入密码--",password);

        this.setState({
            loadingShow: true
        })

        var privateKey = await keystoreUtils.getPrivateKey(password)

        if (privateKey === null) {

            setTimeout(() => {

                this.setState({
                    loadingShow: false
                })
            }, 10);  

            setTimeout(() => {
                alert("秘钥获取失败");
            }, 100);
        }
        else {

            let { contractAddress, transferType, decimals } = store.getState().Core.balance;
            let res = await NetworkManager.sendTransaction(
                {
                    "contractAddress": contractAddress,
                    "symbol": transferType,
                    "decimals": decimals
                },
                this.state.toAddress,
                this.state.transferValue,
                this.state.currentGas,
                privateKey
            )


            console.warn('交易发送完毕'+res);

            setTimeout(() => {

                this.setState({
                    loadingShow: false
                })

                if (res) {
                    //回调刷新
                    this.props.navigation.state.params.onGoBack();
                    this.props.navigation.goBack();
                }
                else {
                    setTimeout(() => {
                        alert("交易发送失败，请检查参数");
                    }, 100);
                }
            }, 10); 
        }
    };


    didTapNextBtn = () => {
        if (NetworkManager.isValidAddress(this.state.toAddress) === false) {
            alert("请输入有效的转账地址");
            return;
        }

        if (parseFloat(this.state.transferValue) < 0 || parseFloat(this.state.transferValue)> this.params.balance) {
            alert("请输入有效的转账金额");
            return;
        }

        //计算gas消耗
        let gasLimit = this.params.transferType === TransferType.ETH ? TransferGasLimit.ethGasLimit : TransferGasLimit.tokenGasLimit;
        let totalGas = this.state.currentGas * 0.001 * 0.001 * 0.001 * gasLimit;
        totalGas = totalGas.toFixed(8);

        if(this.params.ethBalance < totalGas){

            alert("余额不足");
            return;
        }

        let params = {
            fromAddress: this.state.fromAddress,
            toAddress: this.state.toAddress,
            totalAmount: this.state.transferValue + " " + this.params.transferType,
            payType: this.params.transferType + "转账",
            gasPrice:this.getPriceTitle(this.state.currentGas),
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

        if (parseFloat(text) > this.params.balance){
            
            console.warn(text);
            text = this.params.balance.toString();
            console.warn(text);

            this.setState({
                updateValue:text
            });
        }

        this.setState({
            transferValue: parseFloat(text)
        });
    };

    toAddressTextInputChangeText = (text) => {

        this.setState({
            toAddress: text
        });
    };

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
                    _this.setState({
                        toAddress: address
                    })
                    console.log("LLtoAddress", address);
                }
            })
        } else {
            Alert.alert(
                'warn',
                '请先打开使用摄像头权限',
            )
        }
    }

    render() {

        let params = store.getState().Core.walletTransfer;
        let title = params.transferType + "转账";

        return (
            <View style={styles.container}>
                <StatusBarComponent />
                <WhiteBgHeader navigation={this.props.navigation}
                    text={title}
                    rightPress={() => this.scanClick()}
                    rightIcon={require('../../assets/common/scanIcon.png')} />
                <ScrollView style={styles.contentContainer}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}>

                    <TransactionStep didTapSurePasswordBtn={this.didTapSurePasswordBtn}
                        ref={(dialog) => { this.dialog = dialog; }} />
                    {/*转账数量栏*/}
                    <InfoView title={"金额"}
                        detailTitle={"余额：" + parseFloat(this.params.balance).toFixed(4) + this.params.transferType}
                        placeholder={"输入" + this.params.transferType + "金额"}
                        returnKeyType={"next"}
                        keyboardType={'numeric'}
                        onChangeText={this.valueTextInputChangeText} 
                        updateValue = {this.state.updateValue}/>
                    {/*转账地址栏*/}
                    <InfoView title={"收款地址"}
                        placeholder={"输入转账地址"}
                        returnKeyType={"next"}
                        onChangeText={this.toAddressTextInputChangeText}/>
                    {/*备注栏*/}
                    <InfoView title={"备注"}
                        placeholder={"输入备注"}
                        returnKeyType={"done"}
                        onChangeText={this.detailTextInputChangeText} />
                    {/*滑竿视图*/}
                    <SliderView gasStr={this.state.gasStr}
                        minGasPrice={this.state.minGasPrice}
                        maxGasPrice={this.state.maxGasPrice}
                        initValue={this.params.suggestGasPrice}
                        onValueChange={this.sliderValueChanged} />
                    {/*下一步按钮*/}
                    <View style={styles.buttonBox}>
                        <BlueButtonBig onPress={this.didTapNextBtn} text={"下一步"} />
                    </View>
                    
                </ScrollView>
                
                <Loading visible={this.state.loadingShow} />
            </View>

        )
    }
};