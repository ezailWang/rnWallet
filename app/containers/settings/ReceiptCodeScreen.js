import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Clipboard,Alert} from 'react-native';
import QRCode from 'react-native-qrcode';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BlueButton from '../../components/BlueButton';
import HeaderButton from '../../components/HeaderButton';


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
        alignSelf:'stretch',
        marginBottom:30,

    }
})

export default class ReceiptCodeScreen extends Component {
   
    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <HeaderButton
                onPress = {()=> navigation.goBack()}
                img = {require('../../assets/common/common_back.png')}/>
        ),
        headerRight:(
            <HeaderButton
                onPress = {()=> navigation.state.params.headRightPress()}
                img = {require('../../assets/launch/scanIcon.jpg')}/>
        ),
        headerTitle:'收款码',
        tabBarVisible: false,
    
    })

    componentDidMount(){
        //在初始化render之后只执行一次，在这个方法内，可以访问任何组件，componentDidMount()方法中的子组件在父组件之前执行
        this.props.navigation.setParams({headRightPress:this.scanClick})
    }

    scanClick = () =>{
        //const {navigate} = this.props.navigation;//页面跳转
        //navigation('页面');
        Alert.alert(
            'warn',
            'warnMessage',
        )
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
                    <BlueButton
                        onPress = {()=> this.copyAddress()}
                        text = '复制收款地址'
                    />
                </View>    
                 
                         
            </View>
        );
    }
}
