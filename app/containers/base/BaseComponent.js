import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    BackHandler,
    AppState,
    Platform,
    DeviceEventEmitter,
    ScrollView,
    Alert,
} from 'react-native';
import StatusBarComponent from '../../components/StatusBarComponent';
//import Loading from '../../components/LoadingComponent';
import Loading from '../../components/Loading';
import { showToast } from '../../utils/Toast';
import PinModal from '../../components/PinModal'
import { store } from '../../config/store/ConfigureStore'
import { I18n } from '../../config/language/i18n';
import { BlurView } from 'react-native-blur';
import layoutConstants from '../../config/LayoutConstants';
import Toast from 'react-native-root-toast';
import RootSiblings from 'react-native-root-siblings';
import TouchID from 'react-native-touch-id'; //https://github.com/naoufal/react-native-touch-id
let lastBackPressed = 0;


const touchIdOptionalConfig = {
    title:I18n.t('modal.authentication_required'),//android 确认对话框的标题
    color: "#e00606", // Android 确认对话框的颜色
    sensorDescription: "", // Android 指纹图像旁边显示的文字
    cancelText: "Cancel", // Android 取消按钮文字
    fallbackLabel: "Show Passcode", // iOS (if empty, then label is hidden)   默认情况下指定“显示密码”标签。 如果设置为空，则字符串标签不可见。
    unifiedErrors: true // use unified error messages (default false) 返回统一错误消息（默认= false）
}

//所有继承该组件的组件，重写该组件方法请先运行super.funcName()
export default class BaseComponent extends PureComponent {

    constructor(props) {
        super(props);
        this.renderComponent = this.renderComponent.bind(this);
        this.state = {
            isShowLoading: false,
            isShowPin:false,
            showBlur: false,
        }

        

        this.touchIDVeryifyFailCount = 0;//touchId验证失败的次数
        this.touchIDVertifing = false;//touchId是否正在验证中
        this.backgroundTimer = 0;//在后台的时间
        
        this._addEventListener = this._addEventListener.bind(this);
        this._removeEventListener = this._removeEventListener.bind(this);
        this._showLoding = this._showLoding.bind(this);
        this._hideLoading = this._hideLoading.bind(this);
        this._setStatusBarStyleLight = this._setStatusBarStyleLight.bind(this);
        this._initData = this._initData.bind(this);
      //  this._handleAppStateChange = this._handleAppStateChange.bind(this);
        this._barStyle = 'dark-content';

        
    }
    //设置StatusBar的barStyle为light-content,默认为dark-content
    _setStatusBarStyleLight() {
        this._barStyle = 'light-content';
    }

    _setStatusBarStyleDark() {
        this._barStyle = 'dark-content';
    }

    componentWillMount() {
        this._addEventListener();
    }

    componentDidMount() {
        this._initData();
    }

    componentWillUnmount() {
        this._removeEventListener();
    }

    //初始化数据
    _initData() {
    }

    //添加事件监听
    _addEventListener() {
        this.netRequestErrHandler = DeviceEventEmitter.addListener('netRequestErr', this._netRequestErr);//网络异常情况监听
        this.monetaryUnitChangeHandler = DeviceEventEmitter.addListener('monetaryUnitChange', this._monetaryUnitChange);//监听货币单位改变
        this.pinIsShowHandler = DeviceEventEmitter.addListener('pinIsShow', this._pinIsShowEmitter);//监听pin是否显示
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._onBackPressed);//Android物理返回键监听
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    //移除事件监听
    _removeEventListener() {
        this.monetaryUnitChangeHandler && this.monetaryUnitChangeHandler.remove();
        this.backHandler && this.backHandler.remove();//移除android物理返回键监听事件
        this.pinIsShowHandler && this.pinIsShowHandler.remove();
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    //显示Loading
    _showLoding() {
        this.setState({
            isShowLoading: true,
        })
    }

    //隐藏Loading
    _hideLoading() {
        this.setState({
            isShowLoading: false,
        })
    }

    //显示Loading
    _showPin() {
        this.setState({
            isShowPin: true,
        })
    }

    //隐藏Loading
    _hidePin() {
        this.setState({
            isShowPin: false,
        })
    }

    //渲染子组件
    renderComponent() {

    };

    //进入后台模糊（仅支持ios）
    _handleAppStateChange = (nextAppState) => {
        
        if (nextAppState != null && nextAppState === 'active') {
            let isNeedVerify  = this.backgroundTimer !=0 && (Date.now()-this.backgroundTimer) >= 60000 && !this.touchIDVertifing 
            console.log('B_active',isNeedVerify)
            console.log('B_touchIDVertifing',this.touchIDVertifing)
            this.backgroundTimer = 0;
            /*if(isNeedVerify){
                this._verifyIdentidy()
            }*/
            this.setState({
                showBlur: false,
            })
        }else if(nextAppState != null && nextAppState === 'background'){
            console.log('B_background',this.touchIDVertifing)
            this.backgroundTimer = this.touchIDVertifing ? 0 : Date.now();
            this.setState({
                showBlur: true,
            })
        }else if(nextAppState != null && nextAppState === 'inactive'){
            //过渡状态  ios 在进入后台的时候会进入 active->inactive->background  从后台回到前台时不会进入 background->active
            //iOS 在弹起touchID/faceID验证的时候 处于的状态是inactive 
            console.log('B_inactive',this.touchIDVertifing)
            this.backgroundTimer = 0;
            this.setState({
                showBlur: true,
            })
        }else {
            console.log('B_nextAppState_unknown',nextAppState)
            this.backgroundTimer = 0
        }
    }

    render() {
        const { pinInfo } = store.getState().Core
        return (
            <ScrollView contentContainerStyle={styles.container}
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}>
                <StatusBarComponent barStyle={this._barStyle} />
                
                {this.renderComponent()}
                {Platform.OS === 'ios' && this.state.showBlur && <BlurView
                    style={styles.blurStyle}
                    blurType='light'
                    blurAmount={10}
                />}
                {this.state.isShowPin == undefined ? null :
                     <PinModal visible = {this.state.isShowPin}
                               password = {pinInfo == null ? '' : pinInfo.password}
                />}
                {this.state.isShowLoading == undefined ? null : <Loading visible={this.state.isShowLoading} />}
            </ScrollView>
        )
    }

    //接收到货币单位改变的监听所需要的操作
    _monetaryUnitChange = (data) => {
        
    }

    //接收到Pin显示隐藏的监听所需要的操作
    _pinIsShowEmitter = (data) => {
        let pinType = data.pinObject.pinType
        let isVisible =  data.pinObject.visible
        if(pinType == 'PinModal'){
            this.setState({
                isShowPin:isVisible,
            })
        }
    }
    
    //尝试使用Face ID / Touch ID进行身份验证。 返回Promise对象。
    _touchIdAuthenticate = () => {
        console.log('B_touchIdAuthenticate','开始验证touchID')
        this.touchIDVertifing = true
        TouchID.authenticate(I18n.t('modal.vertify_self'),touchIdOptionalConfig)
               .then(
                   success=>{
                       //身份验证成功
                       this.touchIDVertifing = false
                       this._touchIdAuthenticateSuccess()
                }).catch((err) =>{
                       //身份验证失败
                       this.touchIDVertifing = false
                       let error = err
                       this._touchIdAuthenticateFail(error)
                })
    }

    //是否支持Face ID / Touch ID
    _touchIdIsSupported = () => {
        //如果不支持TouchID，则返回拒绝的Promise。 在iOS上解析为具有FaceID或TouchID的biometryType字符串。
        TouchID.isSupported(touchIdOptionalConfig)
               .then(type => {
                   if(type == 'FaceID'){
                       //FaceID is supported
                       this._supportTouchId()
                   }else{
                       //TouchID is supported
                       this._supportFaceId()
                   }
                   
               }).catch(err => {
                       //console.log('L_error',err)
                       let error = err
                       this._notSupportTouchId(error)
               })
    }

    _supportTouchId(){
        this._touchIdAuthenticate()
    }

    _supportFaceId(){
        this._touchIdAuthenticate()
    }

    _notSupportTouchId(err){
        this.setState({
            isShowPin:true
        })
    }

    _touchIdAuthenticateSuccess(){
    }

    _touchIdAuthenticateFail(err){
        console.log('B_err',err)
       
        if(err == 'TouchIDError: User canceled authentication'){
            console.log('B_AuthenticateFail','用户点击cancel取消验证');
            this.setState({
                isShowPin:true
            }) 
        }else if(err == 'TouchIDError: Authentication failed'){
            //ios 验证失败后系统会再试一次(共三次)  
            //三次验证失败才会进入_touchIdAuthenticateFail()   err == 'TouchIDError: Authentication failed'
            //超过三次验证失败 系统则会锁住

            //android 验证失败后再调起touchIdAuthenticate 三次验证失败则会弹起pinCode页面
            console.log('B_AuthenticateFail','TouchID验证失败：' + this.touchIDVeryifyFailCount);
            if(Platform.OS == 'ios'){
                this.touchIDVeryifyFailCount = 0;
                this.setState({
                    isShowPin:true
                })
            }else{
                this.touchIDVeryifyFailCount = this.touchIDVeryifyFailCount + 1;
                if(this.touchIDVeryifyFailCount >=3){
                    this.touchIDVeryifyFailCount = 0;
                    this.setState({
                        isShowPin:true
                    })
                }else{
                    this._touchIdAuthenticate()
                }
            }
            
        }else{ 
            if(Platform.OS == 'ios'  && err == 'TouchIDError: System canceled authentication'){
                //ios每次验证faceID/toucgID时都会走到这里～
                console.log('B_ios_vertifyfail','')
            }else{
                //其他原因造成的验证touchID失败，则弹起pinCode验证
                this.setState({
                     isShowPin:true
                })
            }
            
        }
    }
        

    //网络请假错误回调
    _netRequestErr = (err) => {
        this._hideLoading()
        if (this.toast instanceof RootSiblings) {
            return
        }
        if (err.message === 'Network request failed'
            || err.message === 'Invalid JSON RPC response: \"The Internet connection appears to be offline.\"'
            || err.message === 'Error: Network Error') {
            this.toast = showToast(I18n.t('toast.net_request_err'), Toast.positions.TOP);
        } else if (err.message === 'Couldn\'t decode uint256 from ABI: 0x') {
            this.toast = showToast(I18n.t('toast.net_request_token_unable_resolve'), Toast.positions.TOP + 10)
        } else if (err.message === 'timeout of 10000ms exceeded') {
            this.toast = showToast(I18n.t('net_request_timeout'))
        } else if(err === 'No transactions found' || err.message === 'No transactions found'){
            return
        }else {
            let errMessage = err.message === undefined ? err : err.message
            this.toast = showToast(errMessage, Toast.positions.TOP + 10);
        }
    }
    //点击android物理返回键的操作
    _onBackPressed = () => {
        let routeName = this.props.navigation.state.routeName;
        if (routeName == 'FirstLaunch' || routeName == 'Home' || routeName == 'HomeScreen') {
            //在首页按了物理键返回,Home、FirstLaunch
            if ((lastBackPressed + 2000) >= Date.now()) {
                BackHandler.exitApp;
                return false;
            } else {
                showToast(I18n.t('toast.exit_app'));
                lastBackPressed = Date.now();
                return true;
            }
        } else {
            this.props.navigation.goBack();
            return true;
        }
    }


    _verifyIdentidy(){
        const { pinInfo } = store.getState().Core

        /*
          pinInfo.password 
          isUseTouchId:true/false
        */
        if(pinInfo != null){
            if(pinInfo.isUseTouchId){
                this._touchIdIsSupported()
            }else{
                this._showPin()
            }     
        }
    }  
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    blurStyle: {
        position: "absolute",
        top: 0, left: 0, bottom: 0, right: 0,
        height: layoutConstants.WINDOW_HEIGHT,
        zIndex: 1000,
    }
})