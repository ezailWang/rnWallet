import React, { Component } from 'react'
import {
    Platform,
    SwipeableFlatList,
    View,
    StyleSheet,
    RefreshControl,
    BackHandler,
    Clipboard,
    Animated,
    Linking,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    findNodeHandle
} from 'react-native'
import HeadView from './component/HeadView'
import { HomeCell, ItemDivideComponent, EmptyComponent } from './component/HomeCell'
import ImageButton from '../../components/ImageButton'
import LayoutConstants from '../../config/LayoutConstants';
import StatusBarComponent from '../../components/StatusBarComponent';
import ChangeNetwork from './component/ChangeNetwork'
import { connect } from 'react-redux'
import NetworkManager from '../../utils/NetworkManager'
import { addToken, setNewTransaction, setCoinBalance, setNetWork, removeToken, setIsNewWallet } from '../../config/action/Actions'
import StorageManage from '../../utils/StorageManage'
import { StorageKey, Colors } from '../../config/GlobalConfig'
import { store } from '../../config/store/ConfigureStore'
import SplashScreen from 'react-native-splash-screen'
import Layout from '../../config/LayoutConstants'
import { showToast } from '../../utils/Toast'
import { I18n } from '../../config/language/i18n'
import MyAlertComponent from '../../components/MyAlertComponent'
import BaseComponent from '../base/BaseComponent'
import JPushModule from 'jpush-react-native'
import DeviceInfo from 'react-native-device-info'

const hiddenIcon_invi = require('../../assets/home/psd_invi_w.png')
const hiddenIcon_vi = require('../../assets/home/psd_vi_w.png')
class HomeScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            addTokenShow: false,
            changeNetworkShow: false,
            isRefreshing: false,
            //isShowLoading: false,
            scroollY: new Animated.Value(0),
            statusbarStyle: 'light-content',
            isTotalAssetsHidden: false,
            monetaryUnitSymbol: '',//货币单位符号
            headBgImageRef: null,
            versionUpdateModalVisible: false,
        }
        this.versionUpdateInfo = null
        this._setStatusBarStyleLight()
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

    renderItem = (item) => {
        item.item['isTotalAssetsHidden'] = this.state.isTotalAssetsHidden
        return (
            <HomeCell
                item={item}
                onClick={this.onClickCell.bind(this, item)}
                monetaryUnitSymbol={this.state.monetaryUnitSymbol}
            />
        )
    }

    renderQuickActions = (item) => (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
                style={{ padding: 10, width: 80, justifyContent: 'center', backgroundColor: Colors.RedColor }}
                onPress={() => {
                    this.deleteItem(item)
                }}
            >
                <Text style={{ textAlign: 'center', color: 'white' }}>{I18n.t('home.delete')}</Text>
            </TouchableOpacity>
        </View>
    )

    deleteItem = (item) => {
        if (item.item.symbol === 'ETH' || item.item.symbol === 'ITC') {
            showToast(I18n.t('home.delete_main_token'))
            return
        }
        this.props.removeToken(item.item.address)
        this.removeTokenFromStorage(item.item.address)
    }

    onClickCell = async (item) => {

        let { address, symbol, decimal, price, balance } = item.item;

        let balanceInfo = {
            amount: balance,
            price: price,
            symbol: symbol,
            address: address,
            decimal: decimal
        }
        store.dispatch(setCoinBalance(balanceInfo));
        this.props.navigation.navigate('TransactionRecoder', {
            callback: function (data) {
            }
        })
    }

    pushAddtoken = () => {
        /*this.props.navigation.navigate('AddAssets', {
            callback: async (token) => {
                this._showLoding()
                await this.saveTokenToStorage(token)
                await NetworkManager.loadTokenList()
                this._hideLoading()
            }
        });*/
        this.props.navigation.navigate('AddToken', {
            callback: async (token) => {
                this._showLoding()
                await NetworkManager.loadTokenList()
                this._hideLoading()
            }
        });
    }

    onClickAdd = async (token) => {
        await this.saveTokenToStorage(token)
        this.setState({
            addTokenShow: false
        })
        this._showLoding()
        await NetworkManager.loadTokenList()
        this._hideLoading()
    }

    showChangeNetwork = () => {
        this.setState({
            changeNetworkShow: true
        })
    }

    showDrawer = () => {
        this.props.navigation.openDrawer()
    }




    changeNetworkDone = async () => {
        this.setState({
            changeNetworkShow: false
        })
        this._showLoding()
        await NetworkManager.loadTokenList()
        this._hideLoading()
    }


    onRefresh = async () => {
        this.setState({
            isRefreshing: true
        })
        await NetworkManager.loadTokenList()
        this.setState({
            isRefreshing: false
        })
    }


    formatAddress(address) {
        return address.substr(0, 10) + '...' + address.slice(-10)
    }


    _changeWalletEmitter = async (data) => {
        this._showLoding()


        let address = this.props.wallet.address

        let localUser = await StorageManage.load(StorageKey.User)
        if (localUser && localUser['isTotalAssetsHidden']) {
            this.setState({
                isTotalAssetsHidden: localUser['isTotalAssetsHidden']
            })
        }

        await this.userInfoUpdate(address)
        await NetworkManager.loadTokenList()


        this._hideLoading()
    }


    async userInfoUpdate(address) {
        let params = {
            language: I18n.locale,
            walletAddress: address
        }
        NetworkManager.userInfoUpdate(params)
            .then((response) => {
                if (response.code === 200) {
                    this.walletRegister(address)
                } else {
                    console.log('userInfoUpdate err msg:', response.msg)
                }
            })
            .catch((err) => {
                this._hideLoading()
                console.log('userInfoUpdate err:', err)
            })
    }


    async walletRegister(address) {

        JPushModule.getRegistrationID(registrationId => {
            let params = {
                'system': Platform.OS,
                'systemVersion': DeviceInfo.getSystemVersion(),
                'deviceModel': DeviceInfo.getModel(),
                'deviceToken': registrationId,
                'deviceId': DeviceInfo.getUniqueID(),
                'walletAddress': address,
            }
            //设置别名
            JPushModule.setAlias(registrationId, (alias) => {

            })
            NetworkManager.deviceRegister(params)
                .then((response) => {
                    if (response.code === 200) {
                        StorageManage.save(StorageKey.UserToken, { 'userToken': response.data.userToken })
                        this.getMessageCount()
                    } else {
                        console.log('deviceRegister err msg:', response.msg)
                    }
                })
                .catch((err) => {
                    this._hideLoading()
                    console.log('deviceRegister err:', err)
                })
        })
    }


    //获取未度消息数
    async getMessageCount() {

        let userToken = await StorageManage.load(StorageKey.UserToken)
        if (!userToken || userToken === null) {
            return;
        }
        let params = {
            'userToken': userToken['userToken'],
        }
        NetworkManager.getUnReadMessageCount(params)
            .then(response => {
                if (response.code === 200) {
                    let messageCount = response.data.account;
                    DeviceEventEmitter.emit('messageCount', { messageCount: messageCount });
                } else {
                    console.log('getMessageCount err msg:', response.msg)
                }
            }).catch(err => {
                this._hideLoading()
                console.log('getMessageCount err:', err)
            })
    }


    async _initData() {
        SplashScreen.hide()
        if (this.props.isNewWallet == false) {
            this._verifyIdentidy();
            this.versionUpdate()
        } else {
            this.props.setIsNewWallet(false)
            this._showLoding()
        }

        let params = {
            language: I18n.locale,
            walletAddress: this.props.wallet.address
        }
        NetworkManager.userInfoUpdate(params)
            .then((response) => {
                if (response.code === 200) {
                } else {
                    console.log('userInfoUpdate err msg:', response.msg)
                }
            })
            .catch((err) => {
                console.log('userInfoUpdate err:', err)
            })

        this.setState({
            monetaryUnitSymbol: this.props.monetaryUnit.symbol
        })


        let localUser = await StorageManage.load(StorageKey.User)
        if (localUser && localUser['isTotalAssetsHidden']) {
            this.setState({
                isTotalAssetsHidden: localUser['isTotalAssetsHidden']
            })
        }
        await NetworkManager.loadTokenList()
        
        this._hideLoading()
    }


    async saveTokenToStorage(token) {
        let localTokens = await StorageManage.load(StorageKey.Tokens)
        if (!localTokens) {
            localTokens = []
        }

        localTokens.push({
            address: token.tokenAddress,
            symbol: token.tokenSymbol,
            decimal: token.tokenDecimal,
        })
        StorageManage.save(StorageKey.Tokens, localTokens)
    }

    async removeTokenFromStorage(address) {
        let localTokens = await StorageManage.load(StorageKey.Tokens)
        if (!localTokens) {
            console.error('localTokens is null')
            return
        }
        localTokens.splice(localTokens.findIndex(item => item.address === address), 1)
        StorageManage.save(StorageKey.Tokens, localTokens)
    }

    async saveIsTotalAssetsHiddenToStorage(isHidden) {
        let localUser = await StorageManage.load(StorageKey.User)
        if (localUser == null) {
            console.error('load user is miss')
        } else {
            localUser["isTotalAssetsHidden"] = isHidden;
        }
        StorageManage.save(StorageKey.User, localUser)
    }

    _monetaryUnitChange = async (data) => {
        await NetworkManager.loadTokenList()
        this.setState({
            monetaryUnitSymbol: data.monetaryUnit.symbol
        })
    }

    versionUpdateLeftPress = () => {
        this.setState({
            versionUpdateModalVisible: false,
           
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

    

    async versionUpdate(){
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
                        contents:contents,
                        updateUrl:response.data.updateUrl
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
        if (!this.props.wallet.address) {
            return null
        }
        const headerHeight = this.state.scroollY.interpolate({
            inputRange: [-LayoutConstants.WINDOW_HEIGHT + LayoutConstants.HOME_HEADER_MAX_HEIGHT, 0, LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT],
            outputRange: [LayoutConstants.WINDOW_HEIGHT, LayoutConstants.HOME_HEADER_MAX_HEIGHT, LayoutConstants.HOME_HEADER_MIN_HEIGHT],
            extrapolate: 'clamp'
        })
        const headerZindex = this.state.scroollY.interpolate({
            inputRange: [0, LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
        const headerTextOpacity = this.state.scroollY.interpolate({
            inputRange: [LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT - 20, LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
        const headerBgImageScale = this.state.scroollY.interpolate({
            inputRange: [-LayoutConstants.WINDOW_HEIGHT + LayoutConstants.HOME_HEADER_MAX_HEIGHT, 0, LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT],
            outputRange: [LayoutConstants.WINDOW_HEIGHT / LayoutConstants.TRANSFER_HEADER_MAX_HEIGHT + 1.6, 1, 1],
            extrapolate: 'clamp'
        })

        const headerBgImageTranslateY = this.state.scroollY.interpolate({
            inputRange: [-LayoutConstants.WINDOW_HEIGHT + LayoutConstants.HOME_HEADER_MAX_HEIGHT, 0, LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT],
            outputRange: [0, 0, -(LayoutConstants.HOME_HEADER_MAX_HEIGHT - LayoutConstants.HOME_HEADER_MIN_HEIGHT)],
            extrapolate: 'clamp'
        })

        return (
            <View style={styles.container}>
                <StatusBarComponent barStyle={this.state.statusbarStyle} />
                <MyAlertComponent
                    visible={this.state.versionUpdateModalVisible}
                    title={I18n.t('toast.update_tip')}
                    contents={this.versionUpdateInfo ? this.versionUpdateInfo.contents : []}
                    leftBtnTxt={I18n.t('modal.cancel')}
                    rightBtnTxt={I18n.t('toast.go_update')}
                    leftPress={this.versionUpdateLeftPress}
                    rightPress={this.versionUpdateRightPress}>

                </MyAlertComponent>
                <Animated.View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: Colors.themeColor,
                    height: headerHeight,
                    zIndex: headerZindex,
                }}>
                    <Animated.Image
                        onLoad={() => this.setState({ headBgImageRef: findNodeHandle(this.refs.headBackgroundImage) })}
                        ref='headBackgroundImage'
                        style={{
                            height: LayoutConstants.HOME_HEADER_MAX_HEIGHT,
                            width: LayoutConstants.WINDOW_WIDTH,
                            transform: [{ translateY: headerBgImageTranslateY }, { scale: headerBgImageScale }],
                        }}
                        source={require('../../assets/home/hp_bg.png')}
                    />
                    <Animated.View
                        style={{
                            position: 'absolute',
                            left: 20,
                            top: Layout.DEVICE_IS_IPHONE_X() ? 55 : 35,
                            opacity: headerTextOpacity,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                //marginTop: 3,
                                fontSize: 16,
                                lineHeight: 16
                            }}
                        >{I18n.t('home.total_assets')}</Text>
                        <Text
                            style={{
                                marginTop: 3,
                                marginLeft: 8,
                                color: 'white',
                                fontWeight: '400',
                                fontSize: 18,
                                lineHeight: 18
                            }}
                        >{this.state.isTotalAssetsHidden ? '****' : this.state.monetaryUnitSymbol + this.props.totalAssets + ''}</Text>
                    </Animated.View>
                </Animated.View>
                <SwipeableFlatList
                    maxSwipeDistance={80}
                    bounceFirstRowOnMount={false}
                    renderQuickActions={this.renderQuickActions}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scroollY } } }]
                    )}
                    ItemSeparatorComponent={ItemDivideComponent}
                    ListEmptyComponent={EmptyComponent}
                    getItemLayout={(data, index) => ({ length: 50, offset: 60 * index, index: index })}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                    data={this.props.tokens}
                    refreshControl={<RefreshControl
                        onRefresh={this.onRefresh}
                        refreshing={this.state.isRefreshing}
                        colors={[Colors.themeColor]}
                        tintColor={Colors.whiteBackgroundColor}
                    />}
                    ListHeaderComponent={
                        <HeadView
                            onAddAssets={() => {
                                this.pushAddtoken()
                            }}
                            onQRCode={() => {
                                this.props.navigation.navigate('ReceiptCode');
                            }}
                            onHideAssets={() => {
                                this.setState((previousState) => {
                                    this.saveIsTotalAssetsHiddenToStorage(!previousState.isTotalAssetsHidden)
                                    return { isTotalAssetsHidden: !previousState.isTotalAssetsHidden }
                                })
                            }}
                            walletName={this.props.wallet.name}
                            address={this.formatAddress(this.props.wallet.address)}
                            totalAssets={
                                this.state.isTotalAssetsHidden ? '****' : this.state.monetaryUnitSymbol + this.props.totalAssets + ''}
                            hideAssetsIcon={this.state.isTotalAssetsHidden ? hiddenIcon_invi : hiddenIcon_vi}
                            QRCodeIcon={require('../../assets/home/hp_qrc.png')}
                            addAssetsIcon={require('../../assets/home/plus_icon.png')}
                        />
                    }
                />
                <ImageButton
                    btnStyle={{ right: 17, width: 33, height: 23 / 16 * 13 + 10, top: Layout.DEVICE_IS_IPHONE_X() ? 55 : 35, position: 'absolute', zIndex: 2, }}
                    imageStyle={{ width: 23, height: 23 / 16 * 13 }}
                    onClick={() => {
                        this.showDrawer()
                    }}
                    backgroundImageSource={require('../../assets/home/hp_menu.png')}
                />

                {/* <ChangeNetwork
                    open={this.state.changeNetworkShow}
                    close={() => {
                        this.setState({
                            changeNetworkShow: false
                        })
                    }}
                    onClick={(network) => {
                        this.props.setNetWork(network)
                        this.changeNetworkDone()
                    }}
                /> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})

const mapStateToProps = state => ({
    tokens: state.Core.tokens,
    totalAssets: state.Core.totalAssets,
    wallet: state.Core.wallet,
    monetaryUnit: state.Core.monetaryUnit,
    isNewWallet: state.Core.isNewWallet
})

const mapDispatchToProps = dispatch => ({
    setNetWork: (network) => dispatch(setNetWork(network)),
    removeToken: (token) => dispatch(removeToken(token)),
    setTotalAssets: (totalAssets) => dispatch(setTotalAssets(totalAssets)),
    setIsNewWallet: (isNewWallet) => dispatch(setIsNewWallet(isNewWallet)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)