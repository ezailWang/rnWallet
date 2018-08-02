
import React,{Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    Dimensions,
    Text,
    TextInput,
    View,
    Slider,
    TouchableOpacity
} from 'react-native';

import PropTypes from 'prop-types';
import TransferStep from './TransferStep'
import NetworkManager from '../../utils/networkManage';
import {store} from '../../config/store/ConfigureStore'
import {WALLET_TRANSFER} from "../../config/action/ActionType";
const GlobalConfig = require('../../config/GlobalConfig');

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:GlobalConfig.colors.backgroundColor
    },
    sectionView: {
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        height: 90
    },
    sectionViewTopView: {
        flexDirection:"row",
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
        justifyContent:"center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 10
    },
    sectionViewTitleText: {
        marginLeft: 20,
        marginTop: 20,
        height: 20,
        width: ScreenWidth / 3,
        color:GlobalConfig.colors.fontBlackColor,
    },
    blueText:{
        textAlign:"right",
        color:GlobalConfig.colors.fontBlueColor,
        marginTop: 20,
        marginLeft: 0,
        marginRight:20,
        height: 20,
        width: 2 * ScreenWidth / 3 - 40,
    },
    sectionViewTextInput: {
        marginLeft: 20,
        height: 34,
        marginRight: 20,
        fontSize:15
    },
    sliderBottomView:{
        marginTop: 10,
        marginLeft:0,
        marginRight:0,
        height:140,
        backgroundColor:"white"
    },
    sliderTitleContainerView:{
        flexDirection:"row",
        height:40,
        alignItems:"center",
        justifyContent:"space-between",
        width:ScreenWidth,
    },
    sliderTitle:{
        marginLeft:20,
        color:GlobalConfig.colors.fontBlackColor
    },
    transferPrice:{
        textAlign:"right",
        color:GlobalConfig.colors.themeColor,
        marginRight:20
    },
    slider:{

    },
    button:{
        backgroundColor:GlobalConfig.colors.themeColor,
        height:44,
        width:ScreenWidth-60,
        marginTop:80,
        marginLeft:30,
        borderRadius:22,
        justifyContent:"center",
    },
    buttonTitle:{
        fontSize:20,
        color:"white",
        textAlign:"center",
        fontWeight:"bold"
    },
    sliderContainerView:{
        width:ScreenWidth - 80,
        marginTop:10,
        marginLeft:40
    },
    sliderAlertView:{
        width:ScreenWidth - 80,
        marginTop:5,
        marginLeft:40,
        flexDirection:"row",
        justifyContent:'space-between'
    }

});

//section封装视图
const SectionView = ({titleText,placeHolder,detailTitle,returnKeyType,targetInput})=>(
    <View  style={styles.sectionView}>
        <View style={styles.sectionViewTopView}>
            <Text style={styles.sectionViewTitleText}>{titleText}</Text>
            <Text style={styles.blueText}>{detailTitle}</Text>
        </View>
        <View style={styles.sectionViewBottomView}>
            <TextInput style={styles.sectionViewTextInput}
                       placeholder={placeHolder}
                       returnKeyType={returnKeyType}
                       ref={(textInput)=>{
                           targetInput= textInput;
                       }}>
            </TextInput>
        </View>
    </View>
);


export default class Transfer extends Component{

    constructor(props) {
        super(props);

        //参数
        let params = store.getState().Core.walletTransfer;

        this.callbackSelected = this.callbackSelected.bind(this);
        this.didTapNextBtn = this.didTapNextBtn.bind(this);
        this.getPriceTitle = this.getPriceTitle.bind(this);
        this.sliderValueChanged = this.sliderValueChanged.bind(this);

        this.state = {
            transferType:params.transferType,
            minGasPrice:1,
            maxGasPrice:100,
            currentGas:params.suggestGasPrice,
            gasStr:this.getPriceTitle(params.suggestGasPrice,params.ethPrice),
            transferValue:0,
            toAddress:"0x",
            fromAddress:params.fromAddress,
            detailData:"",
        };
    };

    //----- 生命周期方法 ----
    componentDidMount(){
        // 通过在componentDidMount里面设置setParams将title的值动态修改
        this.props.navigation.setParams({

            headerTitle: "转账",
            // headerTitle: `${this.state.transferType}转账`,
        });

        console.warn(this.state.transferType)
    }


    params = store.getState().Core.walletTransfer;

    getPriceTitle = (gasPrice,ethPrice)=>{

        let gasLimit = this.params.transferType === GlobalConfig.transferType.ETH ? GlobalConfig.transferGasLimit.ethGasLimit:GlobalConfig.transferGasLimit.tokenGasLimit;

        let totalGas = gasPrice * 0.001 * 0.001 * 0.001 * gasLimit;
        totalGas = totalGas.toFixed(8);
        let totalGasPrice = totalGas * ethPrice;
        totalGasPrice = totalGasPrice.toFixed(8);

        return totalGas+"ether≈"+totalGasPrice+"￥";
    };

    didTapNextBtn = ()=>{
        //console.warn(this.state.fromAddress,this.state.transferValue,this.state.detailData);

        if (NetworkManager.isValidAddress(this.state.toAddress) === false){

            alert("请输入有效的转账地址");
            return;
        }

        if (this.state.transferValue === 0){

            alert("请输入有效的转账金额");
            return;
        }

        let params={
            fromAddress:this.state.fromAddress,
            toAddress:this.state.toAddress,
            totalAmount:this.state.transferValue+" "+this.params.transferType,
            payType:this.params.transferType+"转账",
            gasPriceInfo:"0.007 ether\n=Gas(60.000)*Gas Price(11.000)gwei"
        };
        this.dialog.showStepView(params);
    };

    callbackSelected=(index)=>{

    };

    //----视图的事件方法
    sliderValueChanged =(value)=>{

        //console.warn(value,this.props.gasPrice);

        let price = this.getPriceTitle(value,this.params.ethPrice);
        this.setState({
            currentGas: value,
            gasStr:price
        });
    };

    valueTextInputChangeText=(text)=>{

        this.setState({
            transferValue: parseFloat(text).toFixed(8)
        });
    };

    toAddressTextInputChangeText=(text)=>{

        this.setState({
            toAddress: text
        });
    };

    detailTextInputChangeText=(text)=>{

        this.setState({
            detailData: text
        });
    };


    render(){

        return (
            <ScrollView style={styles.container}
                        bounces={false}>
                <TransferStep ref={(dialog)=>{
                    this.dialog = dialog;
                }}/>
                {/*转账数量栏*/}
                <View  style={styles.sectionView}>
                    <View style={styles.sectionViewTopView}>
                        <Text style={styles.sectionViewTitleText}>金额</Text>
                        <Text style={styles.blueText}>{"余额："+this.params.balance+"eth"}</Text>
                    </View>
                    <View style={styles.sectionViewBottomView}>
                        <TextInput style={styles.sectionViewTextInput}
                                   placeholder={"输入"+this.params.transferType+"金额"}
                                   returnKeyType={"next"}
                                   KeyboardType={"numeric"}
                                   onChangeText={this.valueTextInputChangeText}>
                        </TextInput>
                    </View>
                </View>
                {/*转账地址栏*/}
                <View  style={styles.sectionView}>
                    <View style={styles.sectionViewTopView}>
                        <Text style={styles.sectionViewTitleText}>地址</Text>

                    </View>
                    <View style={styles.sectionViewBottomView}>
                        <TextInput style={styles.sectionViewTextInput}
                                   placeholder={"输入转账地址"}
                                   returnKeyType={"next"}
                                   onChangeText={this.toAddressTextInputChangeText}>
                        </TextInput>
                    </View>
                </View>
                {/*备注栏*/}
                <View  style={styles.sectionView}>
                    <View style={styles.sectionViewTopView}>
                        <Text style={styles.sectionViewTitleText}>备注</Text>

                    </View>
                    <View style={styles.sectionViewBottomView}>
                        <TextInput style={styles.sectionViewTextInput}
                                   placeholder={"输入备注"}
                                   returnKeyType={"done"}
                                   onChangeText={this.detailTextInputChangeText}>
                        </TextInput>
                    </View>
                </View>
                {/*滑竿视图*/}
                <View style={styles.sliderBottomView}>
                    <View style={styles.sliderTitleContainerView}>
                        <Text style={styles.sliderTitle}>矿工费</Text>
                        <Text style={styles.transferPrice}>{this.state.gasStr}</Text>
                    </View>
                    <View style={styles.sliderContainerView}>
                        <Slider
                            minimumValue={this.state.minGasPrice}
                            maximumValue={this.state.maxGasPrice}
                            value={this.params.suggestGasPrice}
                            step={1}
                            onValueChange={(value)=>{
                                this.sliderValueChanged(value);
                            }}
                            minimumTrackTintColor={GlobalConfig.colors.themeColor}
                            maximumTrackTintColor={GlobalConfig.colors.fontGrayColor}
                            // minimumTrackImage={require('../../assets/transfer/transfer_slider_left.png')}
                            // maximumTrackImage={require('../../assets/transfer/transfer_slider_right.png')}
                            >
                        </Slider>
                    </View>
                    <View style={styles.sliderAlertView}>
                        <Text>慢</Text>
                        <Text style={{alignSelf:'flex-end'}}>快</Text>
                    </View>
                </View>
                {/*下一步按钮*/}
                <TouchableOpacity style={styles.button}
                                  onPress={this.didTapNextBtn}>
                    <Text style={styles.buttonTitle}>下一步</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
};