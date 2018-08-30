import React, { Component } from 'react'
import {
    FlatList,
    View,
    StyleSheet,
    RefreshControl,
} from 'react-native'
import HeadView from './component/HeadView'
import { HomeCell, ItemDivideComponent, EmptyComponent } from './component/HomeCell'
import ImageButton from '../../components/ImageButton'
import layoutConstants from '../../config/LayoutConstants';
import StatusBarComponent from '../../components/StatusBarComponent';
import AddToken from './AddToken'
import ChangeNetwork from './component/ChangeNetwork'
import { HeaderButton } from '../../components/Button'
import { connect } from 'react-redux'
import networkManage from '../../utils/networkManage'
import { addToken, setTransactionRecoders, setCoinBalance } from '../../config/action/Actions'
import StorageManage from '../../utils/StorageManage'
import { StorageKey } from '../../config/GlobalConfig'
import { store } from '../../config/store/ConfigureStore'
import SplashScreen from 'react-native-splash-screen'
import Loading from '../../components/LoadingComponent'
import { setNetWork } from '../../config/action/Actions'

var user = require('../../assets/home/user.png')
var isDispatching = false

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addTokenShow: false,
            changeNetworkShow: false,
            isRefreshing: false,
            loadingShow: false,
        }

    }

    renderItem = (item) => (
        <HomeCell
            item={item}
            onClick={this.onClickCell.bind(this, item)}
        />
    )

    showLoading() {
        this.setState({
            loadingShow: true
        })
    }

    closeLoading() {
        this.setState({
            loadingShow: false
        })
    }

    onClickCell = async (item) => {

        //获取记录
        this.showLoading()
        const { walletAddress } = store.getState().Core
        let arr = await networkManage.getTransations(item.item);
        store.dispatch(setTransactionRecoders(arr));

        //获取余额信息

        let { contractAddress, symbol, decimals } = item.item;

        let balanceAmount = '';
        let price = 0;
        let ethBalance = '0';

        if (symbol != 'ETH') {
            balanceAmount = await networkManage.getERC20Balance(contractAddress, decimals);
            ethBalance = await networkManage.getEthBalance();
            price = 0;
        }
        else {
            balanceAmount = await networkManage.getEthBalance();
            price = await networkManage.getEthPrice();
            ethBalance = balanceAmount;
        }

        let balanceInfo = {
            amount: balanceAmount,
            price: price,
            transferType: symbol,
            contractAddress: contractAddress,
            decimals: decimals,
            ethBalance: ethBalance
        }

        this.closeLoading()
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
        this.showLoading()
        await networkManage.loadTokenList()
        this.closeLoading()
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
        this.showLoading()
        await networkManage.loadTokenList()
        this.closeLoading()
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
        return address.substr(0, 5) + '...' + address.slice(-5)
    }

    async componentDidMount() {
        //Why do execute twice
        if (isDispatching) {
            return
        }
        isDispatching = true
        SplashScreen.hide()
        this.showLoading()
        await networkManage.loadTokenList()
        this.closeLoading()
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

    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent />
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
                        title="Loading..."
                    />}
                    ListHeaderComponent={<HeadView

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
                        walletName={this.props.walletName}
                        address={this.formatAddress(this.props.walletAddress)}
                        totalAssets={this.props.totalAssets + ''}
                        switchWalletIcon={require('../../assets/home/switch.png')}
                        headIcon={user}
                        QRbtnIcon={require('../../assets/home/QR_icon.png')}
                        setBtnIcon={require('../../assets/home/setting.png')}
                        addAssetsIcon={require('../../assets/home/plus_icon.png')}
                    />}
                />
                <ImageButton
                    btnStyle={{ width: 30, height: 30, right: 20, top: 30, position: 'absolute' }}
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
                <Loading visible={this.state.loadingShow} />
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