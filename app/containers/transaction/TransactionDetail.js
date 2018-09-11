import React, { Component } from 'react';
import { View,StyleSheet,Text,TouchableOpacity,Clipboard,BackHandler,Linking} from 'react-native';
import QRCode from 'react-native-qrcode';
import StatusBarComponent from '../../components/StatusBarComponent';
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import {Colors} from '../../config/GlobalConfig';
import {store} from '../../config/store/ConfigureStore'
import {showToast} from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent';
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
        marginTop:6,
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
        height:30,
        marginTop:10,
        borderRadius:15,
        borderWidth:1.2,
        borderColor: Colors.themeColor
    },
    copyBtnTxt:{
        backgroundColor: 'transparent',
        color:Colors.themeColor,
        fontSize:13,
        height:30,
        lineHeight:30,
        textAlign:'center',
    }
})

export default class TransactionDetail extends BaseComponent {

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
   

    didTapTransactionNumber=()=>{ 

        var baiduURL = 'https://rinkeby.etherscan.io/tx/'+ this.state.transactionHash;
        // var baiduURL = 'https://etherscan.io/tx/'+ this.state.transactionHash;

        Linking.canOpenURL(baiduURL).then(supported => { 

            if (!supported) { 
                console.warn('Can\'t handle url: ' + baiduURL); 
            } 
            else { 
                return Linking.openURL(baiduURL); 
            } 

        }).catch(err => console.error('An error occurred',baiduURL)); 
    }

    copyUrl(){
        Clipboard.setString(this.state.transactionHash);
        showToast(I18n.t('toast.copied'));
    }

    render() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} text={I18n.t('transaction.transaction_details')}/>
                <View style={styles.countBox}>
                     <Text style={styles.countTxt}>{this.state.amount}</Text>
                     <Text style={styles.coinTypeTxt}>{this.state.transactionType}</Text>
                </View>
                <View style={styles.infoBox}>
                     <Text style={[styles.fontGray]}>{I18n.t('transaction.sending_party')}</Text>
                     <Text style={[styles.fontBlack,styles.marginTop2]}>{this.state.fromAddress}</Text>
                </View>
                <View style={styles.infoBox}>
                     <Text style={[styles.fontGray]}>{I18n.t('transaction.beneficiary')}</Text>
                     <Text style={[styles.fontBlack,styles.marginTop2]}>{this.state.toAddress}</Text>
                </View>
                <View style={styles.infoBox}>
                     <Text style={[styles.fontGray]}>{I18n.t('transaction.miner_cost')}</Text>
                     <Text style={[styles.fontBlack,styles.marginTop2]}>{this.state.gasPrice+" gwei"}</Text>
                </View>
                <View style={styles.infoBox}>
                     <Text style={[styles.fontGray]}>{I18n.t('transaction.remarks')}</Text>
                     <Text style={[styles.fontBlack,styles.marginTop2]}>{this.state.remark}</Text>
                </View>

                <View style={styles.bottomBox}>
                     <View style={styles.infoLeftBox}>
                           <Text style={[styles.fontGray]}>{I18n.t('transaction.transaction_number')}</Text>
                           <TouchableOpacity style={[styles.marginTop2]} activeOpacity={0.6} onPress = {this.didTapTransactionNumber}>
                           <Text style={[styles.fontBlue]}
                                 numberOfLines={1}
                                 ellipsizeMode={"middle"}>{this.state.transactionHash}</Text>
                           </TouchableOpacity>      
                           <Text style={[styles.fontGray,styles.marginTop10]}>{I18n.t('transaction.block')}</Text>
                           <Text style={[styles.fontBlack,styles.marginTop2]}>{this.state.blockNumber}</Text>
                           <Text style={[styles.fontGray,styles.marginTop10]}>{I18n.t('transaction.transaction_time')}</Text>
                           <Text style={[styles.fontBlack,styles.marginTop2]}>{this.state.transactionTime}</Text>
                     </View>
                     <View style={styles.qrCodeBox}>
                           <QRCode
                               value = {this.state.transactionHash}
                               size={80}
                               bgColor='#000'
                               fgColor='#fff'
                            />
                            <TouchableOpacity style={[styles.copyBtn]} activeOpacity={0.6} onPress = {this.copyUrl}>
                                 <Text style={styles.copyBtnTxt}>{I18n.t('transaction.copy_address')}</Text>
                            </TouchableOpacity>
                     </View>
                </View>
            </View>
        );
    }
}
