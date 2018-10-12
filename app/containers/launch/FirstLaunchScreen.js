import React, { Component } from 'react';
import { View, StyleSheet, Image, Dimensions, DeviceEventEmitter, PermissionsAndroid, Platform, Alert,ImageBackground } from 'react-native';
import { WhiteButtonBig, WhiteBorderButton } from '../../components/Button'
import { Colors ,StorageKey} from '../../config/GlobalConfig'
import SplashScreen from 'react-native-splash-screen'
import PinModalSet from '../../components/PinModalSet'
import PinModalConfirm from '../../components/PinModalConfirm'
import StorageManage from '../../utils/StorageManage'
import RemindDialog from '../../components/RemindDialog'
import Layout from '../../config/LayoutConstants'
import { androidPermission } from '../../utils/permissionsAndroid';
import networkManage from '../../utils/networkManage'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../../containers/base/BaseComponent'

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor,
        paddingTop: 120,
    },
    logoImg: {
        width: 180,
        height: 180/144*153,
    },
    btnMargin: {
        height: 20,
    },
    btnBox:{
        flex:1,
        justifyContent:'flex-end',
        marginBottom:80,

    }
});

export default class FirstLaunchScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            isShowSetPin:false,
            isShowConfirmPin:false,
            isShowRemind:false,
            remindContent:'',
        }
        this.routeTo = ''
        this.pinPassword = '';
        this._setStatusBarStyleLight()
    }

    _initData(){
        SplashScreen.hide()
    }
    
    //验证android读写权限
    async vertifyAndroidPermissions(isCreateWallet) {
        if (Platform.OS === 'android') {
            var readWritePermission = await androidPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            //var writePermission = await androidPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (readWritePermission) {
                this.nextRoute(isCreateWallet)
            } else {
                Alert.alert(
                    'warn',
                    I18n.t('modal.permission_storage'),
                )
            }
        } else {
            this.nextRoute(isCreateWallet)
        }
    }

    nextRoute(isCreateWallet) {
        if(isCreateWallet){
            this.routeTo = 'createWallet'
        }else{
            this.routeTo = 'importWallet'
        }
        let _this = this;
        this.props.navigation.navigate('ServiceAgreement', {
            callback: function (data) {
                let isShowPin = data.isShowPin;
                _this.setState({
                    isShowSetPin:isShowPin
                })
            }
        })
    }

    _pinIsShowEmitter = (data) => {
        let pinType = data.pinObject.pinType
        let isVisible =  data.pinObject.visible
        this.pinPassword = data.pinObject.pinPassword
        
        if(pinType == 'PinModalSet' && !isVisible ){
            this.setState({
                isShowSetPin: false,
                isShowConfirmPin: true
            })
        }

        if(pinType == 'PinModalConfirm' && !isVisible){
            let isMatchPassword =   data.pinObject.isMatchPassword
            if(isMatchPassword){
                this.setState({
                    isShowSetPin: false,
                    isShowConfirmPin: false
                })
                this._touchIdIsSupported()

            }else{
                //不匹配重新设置密码
                this.pinPassword = ''
                this.setState({
                    isShowSetPin: true,
                    isShowConfirmPin: false
                })
            }
        }
    }

    _supportTouchId(){
        this.setState({
            isShowRemind:true,
            remindContent:I18n.t('modal.open_face_id'),
        })
    }

    _supportFaceId(){
        this.setState({
            isShowRemind:true,
            remindContent:I18n.t('modal.open_touch_id'),
        })
    }

    _notSupportTouchId(error){
        this.savePinInfo(false)
    }

    onConfirmUse(){
        this.setState({
            isShowRemind:false
        })
        this.savePinInfo(true)
        this._touchIdAuthenticate()
    }
    onCancelUse(){
        this.setState({
            isShowRemind:false,
        })
        this.savePinInfo(false)
        this._toRute()
    }

    _touchIdAuthenticateSuccess(){
        this._toRute()
    }

    _touchIdAuthenticateFail(error){

    }

    _toRute(){
        if (this.routeTo == 'createWallet') {
            this.props.navigation.navigate('CreateWallet')
        } else {
            this.props.navigation.navigate('ImportWallet')
        }
    }

    savePinInfo(isUseTouchId){
        let object = {
            password: this.pinPassword,
            isUseTouchId: isUseTouchId
        }
        StorageManage.save(StorageKey.PinInfo, object)
    }

    renderComponent() {
        return (
            //<LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
            //    style={styles.contentContainer}>
            <ImageBackground style={styles.contentContainer}
                             source={require('../../assets/launch/splash_bg.png')}>
                <PinModalSet 
                        ref="pinModalSet"
                        visible={this.state.isShowSetPin}/>    
                <PinModalConfirm 
                        ref="pinModalConfirm"
                        visible={this.state.isShowConfirmPin}
                        password={this.pinPassword}/> 
                <RemindDialog   content={this.state.remindContent}    
                                modalVisible={this.state.isShowRemind}
                                leftPress={() => this.onCancelUse()}
                                rightPress = {()=> this.onConfirmUse()}/>                  
                <Image style={styles.logoImg} source={require('../../assets/launch/splash_logo.png')} resizeMode={'center'} />
                <View style={styles.btnBox}>
                        <WhiteButtonBig
                             buttonStyle={{height:48}}
                             onPress={() => this.vertifyAndroidPermissions(true)}
                             text={I18n.t('launch.creact_wallet')} />
                        <WhiteBorderButton
                             onPress={() => this.vertifyAndroidPermissions(false)}
                             text={I18n.t('launch.import_wallet')} />
                </View>
            </ImageBackground>   
            //</LinearGradient>
        )
    }
}
