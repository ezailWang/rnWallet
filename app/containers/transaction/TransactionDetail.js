import React, { Component } from 'react';
import { View,StyleSheet,Text,TouchableOpacity,Clipboard,BackHandler} from 'react-native';
import QRCode from 'react-native-qrcode';
import StatusBarComponent from '../../components/StatusBarComponent';
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import {Colors} from '../../config/GlobalConfig';
import {store} from '../../config/store/ConfigureStore'

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:Colors.backgroundColor,
    },
    countBox:{
        flexDirection:'row',
        marginTop:30,
        marginBottom:20,
        alignItems:'flex-end',
    },
    countTxt:{
        fontSize:22,
        color:'#000',
        fontWeight:'500',
    },
    coinTypeTxt:{
        fontSize:15,
        marginLeft:6,
        marginBottom:2,
        color:Colors.fontBlackColor,
        alignSelf:'flex-end',
    },
    infoBox:{
        alignSelf:'stretch',
        justifyContent:'flex-start',
        alignItems:'stretch',
        backgroundColor:'#fff',
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:20,
        paddingRight:20,
        marginBottom:1,
    },
    fontBlue:{
        fontSize:13,
        color:Colors.fontBlueColor
    },
    fontBlack:{
        fontSize:13,
        color:Colors.fontBlackColor,
    },
    fontGray:{
        fontSize:13,
        color:Colors.fontDarkGrayColor,
    },
    marginTop2:{
        marginTop:2
    },
    marginTop10:{
        marginTop:10,
    },
    bottomBox:{
        flex:1,
        flexDirection:'row',
        marginTop:20,
        marginLeft:20,
        marginRight:20,
    },
    infoLeftBox:{
        flex:1,
        justifyContent:'flex-start',
    },
    qrCodeBox:{
        marginLeft:20,
    },
    copyBtn:{
        height:36,
        marginTop:10,
        borderRadius:18,
        borderWidth:1.5,
        borderColor: Colors.themeColor
    },
    copyBtnTxt:{
        backgroundColor: 'transparent',
        color:Colors.themeColor,
        fontSize:13,
        height:36,
        lineHeight:36,
        textAlign:'center',
    }
})

export default class TransactionDetail extends Component {

    constructor(props){
        super(props);

        this.copyUrl = this.copyUrl.bind(this);

        let params = store.getState().Core.transactionDetail;

        this.state={
            amount:params.amount,
            transactionType:params.transactionType,
            fromAddress:params.fromAddress,
            toAddress:params.toAddress,
            gasPrice:params.gasPrice,
            remark:params.remark,
            transactionHash:params.transactionHash,
            blockNumber:params.blockNumber,
            transactionTime:params.transactionTime
        };
    }
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

    copyUrl(){
        Clipboard.setString(this.state.transactionHash);
        alert("\n"+this.state.transactionHash)
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
                <WhiteBgHeader  navigation={this.props.navigation} text='交易详情'/>
                <View style={styles.countBox}>
                     <Text style={styles.countTxt}>{this.state.amount}</Text>
                     <Text style={styles.coinTypeTxt}>{this.state.transactionType}</Text>
                </View>
                <View style={styles.infoBox}>
                     <Text style={[styles.fontGray]}>发款方</Text>
                     <Text style={[styles.fontBlack,styles.marginTop2]}>{this.state.fromAddress}</Text>
                </View>
                <View style={styles.infoBox}>
                     <Text style={[styles.fontGray]}>收款方</Text>
                     <Text style={[styles.fontBlack,styles.marginTop2]}>{this.state.toAddress}</Text>
                </View>
                <View style={styles.infoBox}>
                     <Text style={[styles.fontGray]}>矿工费用</Text>
                     <Text style={[styles.fontBlack,styles.marginTop2]}>{this.state.gasPrice+" gwei"}</Text>
                </View>
                <View style={styles.infoBox}>
                     <Text style={[styles.fontGray]}>备注</Text>
                     <Text style={[styles.fontBlack,styles.marginTop2]}>{this.state.remark}</Text>
                </View>

                <View style={styles.bottomBox}>
                     <View style={styles.infoLeftBox}>
                           <Text style={[styles.fontGray]}>交易号</Text>
                           <Text style={[styles.fontBlue,styles.marginTop2]}
                                 numberOfLines={1}
                                 ellipsizeMode={"middle"}>{this.state.transactionHash}</Text>
                           <Text style={[styles.fontGray,styles.marginTop10]}>区块</Text>
                           <Text style={[styles.fontBlack,styles.marginTop2]}>{this.state.blockNumber}</Text>
                           <Text style={[styles.fontGray,styles.marginTop10]}>交易时间</Text>
                           <Text style={[styles.fontBlack,styles.marginTop2]}>{this.state.transactionTime}</Text>
                     </View>
                     <View style={styles.qrCodeBox}>
                           <QRCode
                               value = {'0x123456789'}
                               size={80}
                               bgColor='#000'
                               fgColor='#fff'
                            />
                            <TouchableOpacity style={[styles.copyBtn]} activeOpacity={0.6} onPress = {this.copyUrl}>
                                 <Text style={styles.copyBtnTxt}>复制URL</Text>
                            </TouchableOpacity>
                     </View>
                </View>
            </View>
        );
    }
}
