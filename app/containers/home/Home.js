import React, { Component } from 'react'
import {
    FlatList,
    SwipeableFlatList,
    View,
    StyleSheet,
    RefreshControl,
    BackHandler,
    Clipboard,
    Animated,
    Image,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    findNodeHandle
} from 'react-native'
import HeadView from './component/HeadView'
import { HomeCell, ItemDivideComponent, EmptyComponent } from './component/HomeCell'
import ImageButton from '../../components/ImageButton'
import layoutConstants from '../../config/LayoutConstants';
import StatusBarComponent from '../../components/StatusBarComponent';
import ChangeNetwork from './component/ChangeNetwork'
import { connect } from 'react-redux'
import networkManage from '../../utils/networkManage'
import { addToken, setNewTransaction, setCoinBalance, setNetWork, removeToken } from '../../config/action/Actions'
import StorageManage from '../../utils/StorageManage'
import { StorageKey, Colors } from '../../config/GlobalConfig'
import { store } from '../../config/store/ConfigureStore'
import SplashScreen from 'react-native-splash-screen'
import Layout from '../../config/LayoutConstants'
import { showToast } from '../../utils/Toast'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent'


hiddenIcon_invi = require('../../assets/home/psd_invi_w.png')
hiddenIcon_vi = require('../../assets/home/psd_vi_w.png')
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
            headBgImageRef: null
        }
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
        this.props.removeToken(item.item.contractAddress)
        this.removeTokenFromStorage(item.item.contractAddress)
    }

    onClickCell = async (item) => {

        let { contractAddress, symbol, decimals, price, balance } = item.item;

        let balanceInfo = {
            amount: balance,
            price: price,
            symbol: symbol,
            contractAddress: contractAddress,
            decimals: decimals
        }

        store.dispatch(setCoinBalance(balanceInfo));
        this.props.navigation.navigate('TransactionRecoder');
    }

    pushAddtoken = () => {
        this.props.navigation.navigate('AddAssets', {
            callback: async (token) => {
                this._showLoding()
                await this.saveTokenToStorage(token)
                await networkManage.loadTokenList()
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
        await networkManage.loadTokenList()
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
        await networkManage.loadTokenList()
        this._hideLoading()
    }

    onRefresh = async () => {
        this.setState({
            isRefreshing: true
        })
        await networkManage.loadTokenList()
        this.setState({
            isRefreshing: false
        })
    }

    formatAddress(address) {
        return address.substr(0, 10) + '...' + address.slice(-10)
    }

    async _initData() {
        SplashScreen.hide()
        this._showLoding()

        this.setState({
            monetaryUnitSymbol: this.props.monetaryUnit.symbol
        })

        let localUser = await StorageManage.load(StorageKey.User)
        if (localUser && localUser['isTotalAssetsHidden']) {
            this.setState({
                isTotalAssetsHidden: localUser['isTotalAssetsHidden']
            })
        }
        await networkManage.loadTokenList()
        this._hideLoading()
        
    }

    async saveTokenToStorage(token) {
        let localTokens = await StorageManage.load(StorageKey.Tokens)
        if (!localTokens) {
            localTokens = []
        }

        localTokens.push({
            contractAddress: token.tokenAddress,
            symbol: token.tokenSymbol,
            decimals: token.tokenDecimals,
        })
        StorageManage.save(StorageKey.Tokens, localTokens)
    }

    async removeTokenFromStorage(contractAddress) {
        let localTokens = await StorageManage.load(StorageKey.Tokens)
        if (!localTokens) {
            console.error('localTokens is null')
            return
        }
        localTokens.splice(localTokens.findIndex(item => item.contractAddress === contractAddress), 1)
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
        await networkManage.loadTokenList()
        this.setState({
            monetaryUnitSymbol: data.monetaryUnit.symbol
        })
    }

    renderComponent() {
        const headerHeight = this.state.scroollY.interpolate({
            inputRange: [-layoutConstants.WINDOW_HEIGHT + layoutConstants.HOME_HEADER_MAX_HEIGHT, 0, layoutConstants.HOME_HEADER_MAX_HEIGHT - layoutConstants.HOME_HEADER_MIN_HEIGHT],
            outputRange: [layoutConstants.WINDOW_HEIGHT, layoutConstants.HOME_HEADER_MAX_HEIGHT, layoutConstants.HOME_HEADER_MIN_HEIGHT],
            extrapolate: 'clamp'
        })
        const headerZindex = this.state.scroollY.interpolate({
            inputRange: [0, layoutConstants.HOME_HEADER_MAX_HEIGHT - layoutConstants.HOME_HEADER_MIN_HEIGHT],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
        const headerTextOpacity = this.state.scroollY.interpolate({
            inputRange: [layoutConstants.HOME_HEADER_MAX_HEIGHT - layoutConstants.HOME_HEADER_MIN_HEIGHT - 20, layoutConstants.HOME_HEADER_MAX_HEIGHT - layoutConstants.HOME_HEADER_MIN_HEIGHT],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
        const headerBgImageScale = this.state.scroollY.interpolate({
            inputRange: [-layoutConstants.WINDOW_HEIGHT + layoutConstants.HOME_HEADER_MAX_HEIGHT, 0, layoutConstants.HOME_HEADER_MAX_HEIGHT - layoutConstants.HOME_HEADER_MIN_HEIGHT],
            outputRange: [layoutConstants.WINDOW_HEIGHT/layoutConstants.TRANSFER_HEADER_MAX_HEIGHT + 1.5, 1, 1],
            extrapolate: 'clamp'
        })

        const headerBgImageTranslateY = this.state.scroollY.interpolate({
            inputRange: [-layoutConstants.WINDOW_HEIGHT + layoutConstants.HOME_HEADER_MAX_HEIGHT, 0, layoutConstants.HOME_HEADER_MAX_HEIGHT - layoutConstants.HOME_HEADER_MIN_HEIGHT],
            outputRange: [0, 0, -(layoutConstants.HOME_HEADER_MAX_HEIGHT - layoutConstants.HOME_HEADER_MIN_HEIGHT)],
            extrapolate: 'clamp'
        })


        return (
            <View style={styles.container}>
                <StatusBarComponent barStyle={this.state.statusbarStyle} />
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
                            height: layoutConstants.HOME_HEADER_MAX_HEIGHT,
                            width: layoutConstants.WINDOW_WIDTH,
                            transform: [{ translateY: headerBgImageTranslateY }, { scale: headerBgImageScale }]
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
                            justifyContent: 'center'
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                marginTop: 3,
                                fontSize: 16,
                            }}
                        >{I18n.t('home.total_assets')}</Text>
                        <Text
                            style={{
                                marginLeft: 8,
                                color: 'white',
                                fontWeight: '400',
                                fontSize: 18,
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
                            walletName={this.props.walletName}
                            address={this.formatAddress(this.props.walletAddress)}
                            totalAssets={
                                this.state.isTotalAssetsHidden ? '****' : this.state.monetaryUnitSymbol + this.props.totalAssets + ''}
                            hideAssetsIcon={this.state.isTotalAssetsHidden ? hiddenIcon_invi : hiddenIcon_vi}
                            QRCodeIcon={require('../../assets/home/hp_qrc.png')}
                            addAssetsIcon={require('../../assets/home/plus_icon.png')}
                        />
                    }
                />
                <ImageButton
                    btnStyle={{ right: 21, top: Layout.DEVICE_IS_IPHONE_X() ? 57 : 37, position: 'absolute', zIndex: 2 }}
                    imageStyle={{ width: 23, height: 23/16*13 }}
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
    walletAddress: state.Core.walletAddress,
    totalAssets: state.Core.totalAssets,
    walletName: state.Core.walletName,
    monetaryUnit: state.Core.monetaryUnit
})

const mapDispatchToProps = dispatch => ({
    setNetWork: (network) => dispatch(setNetWork(network)),
    removeToken: (token) => dispatch(removeToken(token)),
    setTotalAssets: (totalAssets) => dispatch(setTotalAssets(totalAssets)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)