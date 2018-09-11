import React, { Component } from 'react'
import {
    FlatList,
    View,
    StyleSheet,
    RefreshControl,
    Clipboard
} from 'react-native'
import HeadView from './component/HeadView'
import { HomeCell, ItemDivideComponent, EmptyComponent } from './component/HomeCell'
import ImageButton from '../../components/ImageButton'
import layoutConstants from '../../config/LayoutConstants';
import StatusBarComponent from '../../components/StatusBarComponent';
import AddToken from './AddToken'
import ChangeNetwork from './component/ChangeNetwork'
import { connect } from 'react-redux'
import networkManage from '../../utils/networkManage'
import { addToken, setTransactionRecoders, setCoinBalance, setNetWork } from '../../config/action/Actions'
import StorageManage from '../../utils/StorageManage'
import { StorageKey, Colors } from '../../config/GlobalConfig'
import { store } from '../../config/store/ConfigureStore'
import SplashScreen from 'react-native-splash-screen'
import Loading from '../../components/LoadingComponent'
import Layout from '../../config/LayoutConstants'
import { showToast } from '../../utils/Toast'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent';
class HomeScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            addTokenShow: false,
            changeNetworkShow: false,
            isRefreshing: false,
            //isShowLoading: false,
        }
        this._setStatusBarStyleLight();
    }

    renderItem = (item) => (
        <HomeCell
            item={item}
            onClick={this.onClickCell.bind(this, item)}
        />
    )

    onClickCell = async (item) => {

        //获取记录
        // this._showLoding()
        // const { walletAddress } = store.getState().Core
        // let arr = await networkManage.getTransations(item.item);
        // store.dispatch(setTransactionRecoders(arr));

        //获取余额信息

        let { contractAddress, symbol, decimals, price } = item.item;

        // let balanceAmount = '';
        // let ethBalance = '0';

        // if (symbol != 'ETH') {
        //     balanceAmount = await networkManage.getERC20Balance(contractAddress, decimals);
        //     ethBalance = await networkManage.getEthBalance();
        // }
        // else {
        //     balanceAmount = await networkManage.getEthBalance();
        //     ethBalance = balanceAmount;
        // }

        let balanceInfo = {
            // amount: balanceAmount,
            // price: price,
            transferType: symbol,
            contractAddress: contractAddress,
            decimals: decimals,
            // ethBalance: ethBalance
        }
        // let {contractAddress,transferType,decimals} = store.getState().Core.balance;

        // this._hideLoading()
        store.dispatch(setCoinBalance(balanceInfo));
        this.props.navigation.navigate('TransactionRecoder');
    }

    showAddtoken = () => {
        this.setState({
            addTokenShow: true
        })
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
        await networkManage.loadTokenList()
        this._hideLoading()
    }

   

    async saveTokenToStorage(token) {
        var localTokens = await StorageManage.load(StorageKey.Tokens)
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

    renderComponent() {
        return (
            <View style={styles.container}>
                <HeadView

                    // onSwitchWallet={() => {
                    //     console.log('---切换钱包按钮被点击')
                    // }}
                    onSet={() => {
                        this.props.navigation.navigate('Set');
                    }}
                    onQRCode={() => {
                        this.props.navigation.navigate('ReceiptCode');
                    }}
                    onAddAssets={() => {
                        this.showAddtoken()
                    }}
                    onAddressCopy={() => {
                        //复制钱包地址
                        Clipboard.setString(this.props.walletAddress)
                        showToast(I18n.t('toast.copy_wallet'))
                    }}
                    walletName={this.props.walletName}
                    address={this.formatAddress(this.props.walletAddress)}
                    totalAssets={this.props.totalAssets + ''}
                    switchWalletIcon={require('../../assets/home/switch.png')}
                    headIcon={require('../../assets/home/user.png')}
                    QRbtnIcon={require('../../assets/home/QR_icon.png')}
                    setBtnIcon={require('../../assets/home/setting.png')}
                    addAssetsIcon={require('../../assets/home/plus_icon.png')}
                    addressCopyIcon={require('../../assets/home/Fzicon.png')}
                />
                <FlatList
                    ItemSeparatorComponent={ItemDivideComponent}
                    ListEmptyComponent={EmptyComponent}
                    getItemLayout={(data, index) => ({ length: 50, offset: 60 * index, index: index })}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                    data={this.props.tokens}
                    refreshControl={<RefreshControl
                        onRefresh={this.onRefresh}
                        refreshing={this.state.isRefreshing}
                    />}
                />
                <ImageButton
                    btnStyle={{ width: 30, height: 30, right: 20, top: Layout.DEVICE_IS_IPHONE_X() ? 60 : 40, position: 'absolute' }}
                    onClick={() => {
                        this.showChangeNetwork()
                    }}
                    backgroundImageSource={require('../../assets/home/caidan.png')}
                />
                <AddToken
                    open={this.state.addTokenShow}
                    close={() => {
                        this.setState({
                            addTokenShow: false
                        })
                    }}
                    onClickAdd={this.onClickAdd.bind(this)}
                />
                <ChangeNetwork
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
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

const mapStateToProps = state => ({
    tokens: state.Core.tokens,
    walletAddress: state.Core.walletAddress,
    totalAssets: state.Core.totalAssets,
    walletName: state.Core.walletName,
})

const mapDispatchToProps = dispatch => ({
    setNetWork: (network) => dispatch(setNetWork(network))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)