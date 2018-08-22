import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Clipboard,Alert,Platform,PermissionsAndroid} from 'react-native';
import QRCode from 'react-native-qrcode';
import { connect } from 'react-redux';
import StorageManage from '../../utils/StorageManage'
import * as Actions from '../../config/action/Actions'
import {HeaderButton,BlueButtonBig} from '../../components/Button';
import {androidPermission}  from '../../utils/permissionsAndroid';
import StatusBarComponent from '../../components/StatusBarComponent';
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import {Colors,FontSize} from '../../config/GlobalConfig'
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    contentContainer:{
        flex:1,
        alignItems:'center',
        backgroundColor:Colors.bgGrayColor,
        paddingTop:60,
        paddingLeft:40,
        paddingRight:40,
    },
    icon:{
        width:66,
        height:66,
    },
    titleTxt:{
        fontSize:18,
        fontWeight:'500',
        color:Colors.fontBlackColor,
        marginTop:15,
        marginBottom:30,
    },
    adderssTxt:{
        marginTop:28,
        fontSize:16,
        color:Colors.fontBlackColor,
    },
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        marginBottom:30,
    }
})

class ReceiptCodeScreen extends Component {
    /**static navigationOptions=({navigation}) => ({
        header:(<WhiteBgHeader navigation={navigation} 
                              text='收款码'
                              rightPress = {()=>navigation.state.params.headRightPress()}
                              rightIcon= {require('../../assets/common/scanIcon.png')}/>
                )
    })
   
    componentDidMount(){
        //在初始化render之后只执行一次，在这个方法内，可以访问任何组件，componentDidMount()方法中的子组件在父组件之前执行
        this.props.navigation.setParams({headRightPress:this.scanClick})
    }**/

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
        walletAddress = this.props.walletAddress
        Clipboard.setString(walletAddress);
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
                <WhiteBgHeader  navigation={this.props.navigation} 
                                text='收款码'
                                /**rightPress = {()=>this.scanClick()}
                                rightIcon= {require('../../assets/common/scanIcon.png')}**//>
                <View style={styles.contentContainer}>
                     <Image style={styles.icon} source={require('../../assets/common/photoIcon.png')}/>
                     <Text style={styles.titleTxt}>{this.props.walletName}</Text>
                     <QRCode
                         value = {this.props.walletAddress}
                         size={160}
                         bgColor='#000'
                         fgColor='#fff'
                     />
                     <Text style={styles.adderssTxt}>{this.props.walletAddress}</Text>
                     <View style={styles.buttonBox}>
                         <BlueButtonBig
                             onPress = {()=> this.copyAddress()}
                             text = '复制收款地址'
                          />
                     </View>       
                </View>                
               
            </View>
        );
    }
}


const mapStateToProps = state => ({
    walletAddress : state.Core.walletAddress,
    walletName : state.Core.walletName,
});

export default connect(mapStateToProps, {})(ReceiptCodeScreen)
