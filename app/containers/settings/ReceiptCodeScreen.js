import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Clipboard,Alert,Platform,PermissionsAndroid} from 'react-native';
import QRCode from 'react-native-qrcode';
import {HeaderButton,BlueButtonBig} from '../../components/Button';
import {androidPermission}  from '../../utils/permissionsAndroid';


const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:60,
        paddingLeft:20,
        paddingRight:20,
        //alignItems:'stretch',
    },
    icon:{
        width:66,
        height:66,
    },
    titleTxt:{
        fontSize:18,
        fontWeight:'500',
        color:'#000',
        marginTop:15,
        marginBottom:40,
    },
    adderssTxt:{
        marginTop:20,
        fontSize:16,
        color:'rgb(57,57,57)',
    },
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        marginBottom:30,
    }
})

export default class ReceiptCodeScreen extends Component {
   
    static navigationOptions = ({ navigation }) => ({
        headerRight:(
            <HeaderButton
                onPress = {()=>navigation.state.params.headRightPress()}
                img = {require('../../assets/common/common_scan_qrcode.png')}/>
        ),
    })

    componentDidMount(){
        //在初始化render之后只执行一次，在这个方法内，可以访问任何组件，componentDidMount()方法中的子组件在父组件之前执行
        this.props.navigation.setParams({headRightPress:this.scanClick})
    }

    scanClick = async() =>{
        //const {navigate} = this.props.navigation;//页面跳转
        //navigation('页面');
        var isAgree = true;
        if(Platform.OS === 'android'){
             isAgree = await androidPermission(PermissionsAndroid.PERMISSIONS.CAMERA); 
        }
        
        if(isAgree){
           this.props.navigation.navigate('ScanQRCode')  
        }else{
            Alert.alert(
                'warn',
                '请先打开使用摄像头权限',
            )
        }
    }
    
    copyAddress(){
        Clipboard.setString('0x123456789');
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.icon} source={require('../../assets/launch/headIcon.jpg')}/>
                <Text style={styles.titleTxt}>Wallet Name</Text>
                <QRCode
                    value = {0x123456789}
                    size={160}
                    bgColor='#000'
                    fgColor='#fff'
                />
                <Text style={styles.adderssTxt}>0x1234567890x1234567890x1234567890x1234567890x1234567890x1234567890x123456789</Text>
                <View style={styles.buttonBox}>
                    <BlueButtonBig
                        onPress = {()=> this.copyAddress()}
                        text = '复制收款地址'
                    />
                </View>       
            </View>
        );
    }
}
