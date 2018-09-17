import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Clipboard,Alert,Platform,PermissionsAndroid,ImageBackground,TouchableOpacity} from 'react-native';
import QRCode from 'react-native-qrcode';
import { connect } from 'react-redux';
import Layout from '../../config/LayoutConstants'
import {HeaderButton,BlueButtonBig} from '../../components/Button';
import {androidPermission}  from '../../utils/permissionsAndroid';
import {TransparentBgHeader} from '../../components/NavigaionHeader'
import {Colors,FontSize} from '../../config/GlobalConfig'
import {showToast} from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'transparent',
    },
    contentContainer:{
        flex:1,
        width:Layout.WINDOW_WIDTH*0.9,
        justifyContent:'center',
        alignSelf:'center',
        
    },
    contentImageBackground:{
        flexDirection:'column',
        backgroundColor:'red',
        alignItems:'center',
        paddingBottom:30,
    },

    titleTxt:{
        fontSize:18,
        fontWeight:'500',
        color:Colors.fontBlackColor,
        marginTop:100,
        marginBottom:20,
    },
    qrCode:{
        height:180,
    },
    adderssTxt:{
        width:180,
        fontSize:14,
        marginTop:20,
        marginTop:20,
        color:Colors.fontBlackColor,
    },
    btnImageBackground:{
        backgroundColor:'yellow',
        alignSelf:'stretch',
        alignItems:'center',
        justifyContent:'center',
    },
    btnOpacity:{
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center',
    },
    btnTxt:{
        fontSize:16,
        fontWeight:'bold',
        color:Colors.fontBlueColor
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
        this._setStatusBarStyleLight()
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
            <ImageBackground style={styles.container} source={require('../../assets/launch/splash_bg.png')}>
                <TransparentBgHeader  navigation={this.props.navigation} 
                                text={I18n.t('settings.collection_code')}
                                /**rightPress = {()=>this.scanClick()}
                                rightIcon= {require('../../assets/common/scanIcon.png')}**//>
                <View style={styles.contentContainer}>               
                <ImageBackground style={styles.contentImageBackground} source={require('../../assets/set/qr_bg.png')}
                                 resizeMode={'contain'}>
                     <Text style={styles.titleTxt}>{this.props.walletName}</Text>
                     <View style={styles.qrCode}>
                        <QRCode
                            value = {this.props.walletAddress}
                            size={180}
                            bgColor='#000'
                            fgColor='#fff'
                            onLoad = {()=>{console.log('onLoad---')}}
                            onLoadEnd = {()=> {console.log('onLoadEnd---')}}
                        />
                     </View>
                     
                     <Text style={styles.adderssTxt}>{this.props.walletAddress}</Text>      
                </ImageBackground> 
                
                <ImageBackground style={styles.btnImageBackground} source={require('../../assets/set/qr_btn.png')}
                                 resizeMode={'contain'}>
                        <TouchableOpacity style={[styles.btnOpacity]}
                                          activeOpacity={0.6}
                                          onPress = {()=> this.copyAddress()}>
                                <Text style={styles.btnTxt}>{I18n.t('settings.copy_payment_address')}</Text>
                        </TouchableOpacity>         
                     
                </ImageBackground>
                </View> 
            </ImageBackground>
        );
    }
}


const mapStateToProps = state => ({
    walletAddress : state.Core.walletAddress,
    walletName : state.Core.walletName,
});

export default connect(mapStateToProps, {})(ReceiptCodeScreen)
