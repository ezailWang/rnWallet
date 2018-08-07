import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,TouchableOpacity,Clipboard} from 'react-native';
import HeaderButton from '../../components/HeaderButton';
import QRCode from 'react-native-qrcode';

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'rgb(248,248,248)',
    },
    countBox:{
        flexDirection:'row',
        marginTop:30,
        marginBottom:20,
        alignItems:'flex-end',
    },
    countTxt:{
        fontSize:26,
        color:'#000',
        fontWeight:'800',
    },
    coinTypeTxt:{
        fontSize:18,
        marginLeft:6,
        color:'rgb(101,101,101)',
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
        fontSize:15,
        color:'rgb(88,159,230)',
    },
    fontBlack:{
        fontSize:15,
        color:'rgb(73,73,73)',
    },
    fontGray:{
        fontSize:15,
        color:'rgb(156,156,156)',
    },
    marginTop2:{
        marginTop:2,
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
        borderRadius:20,
        borderWidth:2,
        borderColor: 'rgb(85,146,246)',
    },
    copyBtnTxt:{
        backgroundColor: 'transparent',
        color:'rgb(85,146,246)',
        fontSize:15,
        height:36,
        lineHeight:36,
        textAlign:'center',
    }
})

export default class TransationDetailScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <HeaderButton
                onPress = {()=> navigation.goBack()}
                img = {require('../../assets/common/common_back.png')}/>
        ),
        headerRight:(
            <HeaderButton
            />
        ),
        headerTitle:'交易记录',
    })

    copyUrl(){
        Clipboard.setString('0x123456789');
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.countBox}>
                     <Text style={styles.countTxt}>1000</Text>
                     <Text style={styles.coinTypeTxt}>ITC</Text>
                </View>
                
                <View style={styles.infoBox}>
                     <Text style={[styles.fontGray]}>发款方</Text>
                     <Text style={[styles.fontBlack,styles.marginTop2]}>0xbvdhsbvdswgeywbfdhsvjhdsbvfd</Text>
                </View>  
                <View style={styles.infoBox}>
                     <Text style={[styles.fontGray]}>收款方</Text>
                     <Text style={[styles.fontBlack,styles.marginTop2]}>0xbvdhsbvdswgeywbfdhsvjhdsbvfd</Text>
                </View>  
                <View style={styles.infoBox}>
                     <Text sstyle={[styles.fontGray]}>矿工费用</Text>
                     <Text style={[styles.fontBlack,styles.marginTop2]}>0xbvdhsbvdswgeywbfdhsvjhdsbvfd0xbvdhsbvdswgeywbfdhsvjhdsbvfd0xbvdhsbvdswgeywbfdhsvjhdsbvfd</Text>
                </View> 
                <View style={styles.infoBox}>
                     <Text style={[styles.fontGray]}>备注</Text>
                     <Text style={[styles.fontBlack,styles.marginTop2]}></Text>
                </View> 
                
                <View style={styles.bottomBox}>
                     <View style={styles.infoLeftBox}>
                           <Text style={[styles.fontGray]}>交易号</Text>
                           <Text style={[styles.fontBlue,styles.marginTop2]}>0xC2C447...B42DF9</Text> 
                           <Text style={[styles.fontGray,styles.marginTop10]}>区块</Text>
                           <Text style={[styles.fontBlack,styles.marginTop2]}>5907901</Text>
                           <Text style={[styles.fontGray,styles.marginTop10]}>交易时间</Text>
                           <Text style={[styles.fontBlack,styles.marginTop2]}>07/05/2018 12:08:16 +0800</Text>
                     </View>
                     <View style={styles.qrCodeBox}>
                           <QRCode
                               value = {'0x123456789'}
                               size={100}
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
