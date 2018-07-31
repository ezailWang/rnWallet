import React,{Component} from 'react'

import {
    Modal,
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    Text,
    TextInput
} from 'react-native'

const GlobalConfig = require('../../config/GlobalConfig');
import PropTypes from 'prop-types';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:GlobalConfig.colors.blackOpacityColor,
        justifyContent:"flex-end"
    },
    scrollView:{
        flexDirection:"row",
        marginTop:ScreenHeight-400,
        marginBottom:0,
        marginRight:0,
        marginLeft:0,
        //backgroundColor:'white'
    },
    leftContainer:{
        marginLeft:0,
        backgroundColor:'white',
        height:400,
        width:ScreenWidth,
        alignItems:"center",
    },
    rightContainer:{
        marginRight:0,
        marginTop:0,
        backgroundColor:'white',
        height:400,
        width:ScreenWidth,
        alignItems:"center"
    },
    firstStepTitleView:{
        height:44,
        width:ScreenWidth,
        marginRight:0,
        borderBottomColor:GlobalConfig.colors.fontGrayColor,
        borderBottomWidth:0.5,
        flexDirection:'row',
        alignItems:"center",
    },
    cancelBtn:{
        width:15,
        height:15,
        marginLeft:25,
        // backgroundColor:'red',
        justifyContent:"center",
        alignItems:"center"
    },
    titleView:{
        color:GlobalConfig.colors.fontBlackColor,
        //marginLeft:0,
        width:ScreenWidth- (15+25)*2,
        fontSize:17,
        textAlign:"center"
    },
    costTextContainer:{
        height:50,
        justifyContent:"center"
    },
    costText:{
        fontSize:20,
        textAlign:"center",
    },
    leftInfoView:{
        height:210,
        // backgroundColor:"red",
        width:ScreenWidth - 50
    },
    infoTextViewFirst:{
        height:30,
        flexDirection:"row",
        alignItems:"center",
        // backgroundColor:"red",
        width:ScreenWidth-60
    },
    infoTitle:{
        fontSize:13,
        color:GlobalConfig.colors.fontDarkGrayColor
    },
    infoDetailTitle:{
        fontSize:13,
        color:GlobalConfig.colors.fontBlackColor,
        marginLeft:20,
        // marginRight:60
    },
    infoContent:{
        height:210.0/3,
        // backgroundColor:"green",
        flexDirection:"row",
    },
    lineView:{
        height:0.5,
        backgroundColor:GlobalConfig.colors.fontGrayColor
    },
    infoContentTitle:{
        marginTop:10,
        // backgroundColor:"red"
    },
    infoContentDetailTitle:{
        fontSize:13,
        color:GlobalConfig.colors.fontBlackColor
    },
    infoContentDetailView:{
        marginTop:10,
        marginLeft:20,
        marginRight:10,
        flex:1,
        // backgroundColor:"blue"
    },
    nextBtn:{
        marginTop:25,
        height:44,
        borderRadius:25,
        width:ScreenWidth - 100,
        backgroundColor:GlobalConfig.colors.themeColor,
        justifyContent:"center",
    },
    buttonTitle:{
        //flex:1,
        fontSize:18,
        color:"white",
        textAlign:"center",
        fontWeight:"bold"
    },
    passwordFrameView:{
        borderWidth:1,
        borderColor:GlobalConfig.colors.fontGrayColor,
        borderRadius:5,
        width:ScreenWidth - 50,
        marginTop:20,
        height:40
    },
    passwordView:{
        flex:1,
        marginLeft:15,
        marginRight:15,
        // backgroundColor:"red",
        height:40,
        fontSize:15
    }
});

let InfoTextView = ({transferType,fromAddress,toAddress,gasPrice})=>(
    <View style={styles.leftInfoView}>
        <View style={styles.infoTextViewFirst}>
            <Text style={styles.infoTitle}>
                支付信息
            </Text>
            <Text style={styles.infoDetailTitle}>
                {transferType}
            </Text>
        </View>
        <InfoContentView
            title={"收款地址"}
            deatilContent={toAddress}>
        </InfoContentView>
        <InfoContentView
            title={"付款地址"}
            deatilContent={fromAddress}>
        </InfoContentView>
        <InfoContentView
            title={"矿工费用"}
            deatilContent={gasPrice}>
        </InfoContentView>
    </View>
);

let InfoContentView = ({title,deatilContent})=>(
    <View style={{flex:1}}>
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

export default class TransferStep extends Component{

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            show:false,
            step:false,
            fromAddress:'0x',
            toAddress:'0x',
            totalAmount:"0",
            payType:"",
            gasPriceInfo:""
        };
        this.showStepView=this.showStepView.bind(this);
        this.changeStepPage=this.changeStepPage.bind(this);
        this.didTapSurePasswordBtn=this.didTapSurePasswordBtn.bind(this);
    }
    // 加载完成
    componentDidMount(){
        //
    }
    // view卸载
    componentWillUnmount(){
        //
    }

    showStepView(params){

        let isShow = this.state.show;

        this.setState({
            show:!isShow,
            fromAddress:params.fromAddress,
            toAddress:params.toAddress,
            totalAmount:params.totalAmount,
            payType:params.payType,
            gasPriceInfo:params.gasPriceInfo
        })
    }

    changeStepPage(){

        let currentPage = !this.state.step;

        this.setState({
           step:currentPage
        });

        if (currentPage === false){
            this.scroll.scrollTo({x:0,y:0,animated:true});
            this.INPUT.blur();
        }
        else {
            this.scroll.scrollTo({x:ScreenWidth,y:0,animated:true});
            this.INPUT.focus();
        }
    }

    didTapSurePasswordBtn(){

        this.showStepView();
    }

    render(){
        return(

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

                    <ScrollView style={styles.scrollView}
                                horizontal={true}   //水平方向
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={false}
                                bounces={false}
                                ref={(scroll)=>{
                                     this.scroll=scroll;
                                }}>
                        {/*步骤一 确认交易信息*/}
                        <View style={styles.leftContainer}>
                            <View style={styles.firstStepTitleView}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={this.showStepView}>

                                        <Image resizeMode={'center'}
                                               source={require('../../assets/transfer/transfer_cancel.png')}
                                               style={{width:styles.cancelBtn.width,height:styles.cancelBtn.height}}>
                                        </Image>

                                </TouchableOpacity>
                                <Text style={styles.titleView}>
                                    支付详情
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
                                gasPrice={this.state.gasPriceInfo}>
                            </InfoTextView>

                            <TouchableOpacity style={styles.nextBtn} onPress={this.changeStepPage}>
                                <Text style={styles.buttonTitle}>下一步</Text>
                            </TouchableOpacity>
                        </View>

                        {/*步骤二 ，输入密码*/}
                        <View style={styles.rightContainer}>
                            <View style={[styles.firstStepTitleView,{borderBottomWidth:0}]}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={this.changeStepPage}>

                                    <Image resizeMode={'center'}
                                           source={require('../../assets/common/common_back.png')}
                                           style={{width:styles.cancelBtn.width,height:styles.cancelBtn.height}}>
                                    </Image>

                                </TouchableOpacity>
                                <Text style={styles.titleView}>
                                    钱包密码
                                </Text>
                            </View>
                            <View style={styles.passwordFrameView}>
                                <TextInput style={styles.passwordView}
                                           placeholder={"请输入密码"}
                                           returnKeyType={"done"}
                                           ref={(textinput)=>{
                                               this.INPUT=textinput;
                                            }}>
                                </TextInput>
                            </View>

                            <TouchableOpacity style={styles.nextBtn} onPress={this.didTapSurePasswordBtn}>
                                <Text style={styles.buttonTitle}>确定</Text>
                            </TouchableOpacity>
                        </View>
                </ScrollView>
                </View>
            </Modal>
        )
    }
}
