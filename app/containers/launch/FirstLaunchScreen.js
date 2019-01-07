import React, { Component } from 'react';
import { View, StyleSheet, Image, Linking, PermissionsAndroid, Platform, ImageBackground } from 'react-native';
import { WhiteButtonBig, WhiteBorderButton } from '../../components/Button'
import { Colors, StorageKey } from '../../config/GlobalConfig'
import SplashScreen from 'react-native-splash-screen'
import PinModalSet from '../../components/PinModalSet'
import StorageManage from '../../utils/StorageManage'
import RemindDialog from '../../components/RemindDialog'
import { connect } from 'react-redux'
import * as Actions from '../../config/action/Actions';
import Layout from '../../config/LayoutConstants'
import { androidPermission } from '../../utils/PermissionsAndroid';
import NetworkManager from '../../utils/NetworkManager'
import { I18n } from '../../config/language/i18n'
import DeviceInfo from 'react-native-device-info'
import MyAlertComponent from '../../components/MyAlertComponent'
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
        height: 180 / 144 * 153,
    },
    btnMargin: {
        height: 20,
    },
    btnBox: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 80,
    }
});

class FirstLaunchScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            isShowSetPin: false,
            isShowRemind: false,
            remindContent: '',
            versionUpdateModalVisible: false,
        }
        this.routeTo = ''
        this.pinPassword = '';
        this.touchIdVeryifyFailCount = 0;//touchId验证失败的次数ß
        this._setStatusBarStyleLight()
    }

    async _initData() {
        SplashScreen.hide()
        this.versionUpdate()
    }

    componentWillMount() {
        this._isMounted = true
        this._addEventListener();
        this._addChangeListener()
    }

    componentWillUnmount() {
        this._isMounted = false
        this._removeEventListener();
        this._removeChangeListener()
    }

    // _handleAppStateChange = (nextAppState) => {}

    //验证android读写权限
    async vertifyAndroidPermissions(isCreateWallet) {
        if (Platform.OS === 'android') {
            var readWritePermission = await androidPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            //var writePermission = await androidPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (readWritePermission) {
                this.nextRoute(isCreateWallet)
            } else {
                this._showAlert(I18n.t('modal.permission_storage'))
            }
        } else {
            this.nextRoute(isCreateWallet)
        }
    }


    nextRoute(isCreateWallet) {
        /*if(isCreateWallet){
            this.routeTo = 'createWallet'
        }else{
            this.routeTo = 'importWallet'
        }
        let _this = this;
        if(this.props.pinInfo == null){
            this.props.navigation.navigate('ServiceAgreement', {
                callback: function (data) {
                    let isShowPin = data.isShowPin;
                    _this.setState({
                        isShowSetPin:isShowPin
                    })
                }
            })
        }else{
            this._toRute()
        }*/

        if (isCreateWallet) {
            this.routeTo = 'createWallet'
        } else {
            this.routeTo = 'importWallet'
        }
        if (this.props.pinInfo == null) {
            this.setState({
                isShowSetPin: true
            })
        } else {
            this._toRute()
        }


    }



    _pinIsShowEmitter = (data) => {
        let pinType = data.pinObject.pinType
        let isVisible = data.pinObject.visible
        this.pinPassword = data.pinObject.pinPassword

        if (pinType == 'PinModal') {
            this._hidePin()
        }

        if (pinType == 'PinModalSet' && !isVisible) {
            this.setState({
                isShowSetPin: false,
            })
            this._touchIdIsSupported()
        }
    }

    _supportTouchId() {
        if (this.props.pinInfo == null) {
            this.setState({
                isShowRemind: true,
                remindContent: I18n.t('modal.open_face_id'),
            })
        } else {
            super._supportTouchId()
        }
    }

    _supportFaceId() {
        if (this.props.pinInfo == null) {
            this.setState({
                isShowRemind: true,
                remindContent: I18n.t('modal.open_touch_id'),
            })
        } else {
            super._supportFaceId()
        }

    }

    _notSupportTouchId(err) {
        if (this.props.pinInfo == null) {
            this.savePinInfo(false)
            this._toRute()
        } else {
            super._notSupportTouchId(err)
        }
    }

    onConfirmUse() {
        this.setState({
            isShowRemind: false
        })
        setTimeout(() => {
            this._touchIdAuthenticate()
        }, 300);


    }
    onCancelUse() {
        this.setState({
            isShowRemind: false,
        })
        this.savePinInfo(false)
        this._toRute()
    }

    _touchIdAuthenticateSuccess() {
        if (this.props.pinInfo == null) {
            this.savePinInfo(true)
            this._toRute()
        } else {
            super._touchIdAuthenticateSuccess()
        }
    }

    _touchIdAuthenticateFail(err) {
        if (this.props.pinInfo == null) {
            if (err == 'TouchIDError: User canceled authentication') {
                this.savePinInfo(false)
                this._toRute()
            } else if (err == 'TouchIDError: Authentication failed') {
                //ios 验证失败后系统会再试一次(共三次)  
                //三次验证失败才会进入_touchIdAuthenticateFail()   err == 'TouchIDError: Authentication failed'
                //超过三次验证失败 系统则会锁住

                //android 验证失败后再调起touchIdAuthenticate 三次验证失败则会弹起pinCode页面
                if (Platform.OS == 'ios') {
                    this.touchIdVeryifyFailCount = 0;
                    this.savePinInfo(false)
                    this._toRute()
                } else {
                    this.touchIdVeryifyFailCount = this.touchIdVeryifyFailCount + 1;
                    if (this.touchIdVeryifyFailCount >= 3) {
                        this.touchIdVeryifyFailCount = 0;
                        this.savePinInfo(false)
                        this._toRute()
                    } else {
                        this._touchIdAuthenticate()
                    }
                }

            } else {
                //其他原因造成的验证touchID失败，则认为不设置touchid
                this.savePinInfo(false)
                this._toRute()
            }
        } else {
            super._touchIdAuthenticateFail(err)
        }
    }

    _toRute() {
        //this.props.navigation.navigate('MappingTerms')
       
       
        if (this.routeTo == 'createWallet') {
            let params = {
                walletType: 'itc',
                from: 0
            }
            this.props.setCreateWalletParams(params);
            this.props.navigation.navigate('CreateWallet')
        } else {
            //this.props.navigation.navigate('ImportWallet')
            let params = {
                from: 0
            }
            this.props.setCreateWalletParams(params);
            this.props.navigation.navigate('ChoseWalletType')
        }
    }

    savePinInfo(isUseTouchId) {
        let object = {
            password: this.pinPassword,
            isUseTouchId: isUseTouchId
        }
        this.props.setPinInfo(object);
        StorageManage.save(StorageKey.PinInfo, object)
    }

    versionUpdateLeftPress = () => {
        this.setState({
            versionUpdateModalVisible: false
        })
        this.versionUpdateInfo = null
    }

    versionUpdateRightPress = () => {

        this.setState({
            versionUpdateModalVisible: false
        })
        let updateUrl = this.versionUpdateInfo.updateUrl
        Linking.canOpenURL(updateUrl)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(updateUrl)
                }
            })
        this.versionUpdateInfo = null
    }

    async versionUpdate() {
        let params = {
            'system': Platform.OS,
            'version': DeviceInfo.getVersion() + '(' + DeviceInfo.getBuildNumber() + ')',
            'language': I18n.locale
        }
        NetworkManager.getVersionUpdateInfo(params)
            .then((response) => {
                if (response.code === 200) {
                    let contents = response.data.content.split('&')
                    let updateInfo = {
                        contents: contents,
                        updateUrl: response.data.updateUrl
                    }
                    this.versionUpdateInfo = updateInfo
                    this.setState({
                        versionUpdateModalVisible: true
                    })

                } else {
                    console.log('getVersionUpdateInfo err msg:', response.msg)
                }
            })
            .catch((err) => {
                console.log('getVersionUpdateInfo err:', err)
            })
    }


    renderComponent() {
        return (
            //<LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
            //    style={styles.contentContainer}>
            <ImageBackground style={styles.contentContainer}
                source={require('../../assets/launch/splash_bg.png')}>
                <MyAlertComponent
                    visible={this.state.versionUpdateModalVisible}
                    title={I18n.t('toast.update_tip')}
                    contents={this.versionUpdateInfo ? this.versionUpdateInfo.contents : []}
                    leftBtnTxt={I18n.t('modal.cancel')}
                    rightBtnTxt={I18n.t('toast.go_update')}
                    leftPress={this.versionUpdateLeftPress}
                    rightPress={this.versionUpdateRightPress}>

                </MyAlertComponent>
                <PinModalSet
                    ref="pinModalSet"
                    visible={this.state.isShowSetPin} />
                <RemindDialog content={this.state.remindContent}
                    modalVisible={this.state.isShowRemind}
                    leftPress={() => this.onCancelUse()}
                    rightPress={() => this.onConfirmUse()} />
                <Image style={styles.logoImg} source={require('../../assets/launch/splash_logo.png')} resizeMode={'center'} />
                <View style={styles.btnBox}>
                    <WhiteButtonBig
                        buttonStyle={{ height: 48 }}
                        onPress={() => this.vertifyAndroidPermissions(true)}
                        text={I18n.t('settings.create_itc_wallet')} />
                    <WhiteBorderButton
                        onPress={() => this.vertifyAndroidPermissions(false)}
                        text={I18n.t('launch.import_wallet')} />
                </View>
            </ImageBackground>
            //</LinearGradient>
        )
    }
}


const mapStateToProps = state => ({
    pinInfo: state.Core.pinInfo,
});
const mapDispatchToProps = dispatch => ({
    setPinInfo: (pinInfo) => dispatch(Actions.setPinInfo(pinInfo)),
    setCreateWalletParams: (params) => dispatch(Actions.setCreateWalletParams(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FirstLaunchScreen)
