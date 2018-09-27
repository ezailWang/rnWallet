import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    BackHandler,
    AppState,
    Platform,
    DeviceEventEmitter,
    ScrollView
} from 'react-native';
import StatusBarComponent from '../../components/StatusBarComponent';
//import Loading from '../../components/LoadingComponent';
import Loading from '../../components/Loading';
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n';
import { BlurView } from 'react-native-blur';
import layoutConstants from '../../config/LayoutConstants';
let lastBackPressed = 0;

//所有继承该组件的组件，重写该组件方法请先运行super.funcName()
export default class BaseComponent extends PureComponent {

    constructor(props) {
        super(props);
        this.renderComponent = this.renderComponent.bind(this);
        this.state = {
            isShowLoading: false,
            showBlur: false,
        }


        this._addEventListener = this._addEventListener.bind(this);
        this._removeEventListener = this._removeEventListener.bind(this);
        this._showLoding = this._showLoding.bind(this);
        this._hideLoading = this._hideLoading.bind(this);
        this._setStatusBarStyleLight = this._setStatusBarStyleLight.bind(this);
        this._initData = this._initData.bind(this);
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
        this.monetaryUnitChangeHandler = DeviceEventEmitter.addListener('monetaryUnitChange', this._monetaryUnitChange);//监听货币单位改变
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._onBackPressed);//Android物理返回键监听
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    //移除事件监听
    _removeEventListener() {
        this.monetaryUnitChangeHandler && this.monetaryUnitChangeHandler.remove();
        this.backHandler && this.backHandler.remove();//移除android物理返回键监听事件
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

    //渲染子组件
    renderComponent() {

    };

    //进入后台模糊（仅支持ios）
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState != null && nextAppState === 'active') {
            this.setState({
                showBlur: false,
            })
        }
        else {
            this.setState({
                showBlur: true,
            })
        }
    }

    render() {
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
                    {this.state.isShowLoading == undefined ? null : <Loading visible={this.state.isShowLoading} />}
            </ScrollView>
        )
    }

    //接收到货币单位改变的监听所需要的操作
    _monetaryUnitChange=(data)=>{

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
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    blurStyle: {
        position: "absolute",
        top: 0, left: 0, bottom: 0, right: 0,
        height: layoutConstants.WINDOW_HEIGHT,
        zIndex:1000,
    }
})