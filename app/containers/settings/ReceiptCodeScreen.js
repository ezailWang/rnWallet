import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Clipboard,Alert,Platform,PermissionsAndroid,BackHandler} from 'react-native';
import QRCode from 'react-native-qrcode';
import { connect } from 'react-redux';
import Layout from '../../config/LayoutConstants'
import {HeaderButton,BlueButtonBig} from '../../components/Button';
import {androidPermission}  from '../../utils/permissionsAndroid';
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import {Colors,FontSize} from '../../config/GlobalConfig'
import {showToast} from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    contentContainer:{
        flex:1,
        width:Layout.WINDOW_WIDTH*0.9,
        alignItems:'center',
        paddingTop:60,
        backgroundColor:Colors.bgGrayColor, 
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
    qrCode:{
        height:160,
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

class ReceiptCodeScreen extends BaseComponent {
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

    constructor(props){
        super(props);
        this.state = {
        }
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
                I18n.t('modal.permission_camera'),
            )
        }
    }
    
    copyAddress(){
        walletAddress = this.props.walletAddress
        Clipboard.setString(walletAddress);
        showToast(I18n.t('toast.copied'));
    }

    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} 
                                text={I18n.t('settings.collection_code')}
                                /**rightPress = {()=>this.scanClick()}
                                rightIcon= {require('../../assets/common/scanIcon.png')}**//>
                <View style={styles.contentContainer}>
                     <Image style={styles.icon} source={require('../../assets/common/photoIcon.png')}/>
                     <Text style={styles.titleTxt}>{this.props.walletName}</Text>
                     <View style={styles.qrCode}>
                        <QRCode
                            value = {this.props.walletAddress}
                            size={160}
                            bgColor='#000'
                            fgColor='#fff'
                            onLoad = {()=>{console.log('onLoad---')}}
                            onLoadEnd = {()=> {console.log('onLoadEnd---')}}
                        />
                     </View>
                     
                     <Text style={styles.adderssTxt}>{this.props.walletAddress}</Text>
                     <View style={styles.buttonBox}>
                        <BlueButtonBig
                            onPress = {()=> this.copyAddress()}
                            text = {I18n.t('settings.copy_payment_address')}
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
