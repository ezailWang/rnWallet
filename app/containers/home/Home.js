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
import { HeaderButton } from '../../components/Button'
import { connect } from 'react-redux'
import networkManage from '../../utils/networkManage'
import { addToken, setTransactionRecoders, setCoinBalance } from '../../config/action/Actions'
import StorageManage from '../../utils/StorageManage'
import { StorageKey } from '../../config/GlobalConfig'
import {store} from '../../config/store/ConfigureStore'
import SplashScreen from 'react-native-splash-screen'
import Loading from '../../components/LoadingComponent'

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addTokenShow: false,
            isRefreshing: false,
            loadingShow:false,
        }

    }

    renderItem = (item) => (
        <HomeCell
            item={item}
            onClick={this.onClickCell.bind(this, item)}
        />
    )

    showLoading(){
        this.setState({
            loadingShow:true
        })
    }

    closeLoading(){
        this.setState({
            loadingShow:false
        })
    }

    onClickCell = async (item) => {

        //获取记录
        this.showLoading()
        const { walletAddress } = store.getState().Core
        let arr = await  networkManage.getTransations(item.item);
        store.dispatch(setTransactionRecoders(arr));

        //获取余额信息
        let balanceAmount = await networkManage.getEthBalance();
        let price = await networkManage.getEthPrice();
        
        let balanceInfo = {
            amount:balanceAmount,
            price:price,
            transferType:item.item.symbol
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
        await networkManage.loadTokenList()
    }

    onRefresh = async () => {
        this.setState({
            isRefreshing: true
        })
        await networkManage.loadTokenList()
        this.setState({
            isRefreshing:false
        })
    }

    formatAddress(address) {
        return address.substr(0, 5) + '...' + address.slice(-5)
    }

    async componentDidMount() {
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

                        onSwitchWallet={() => {
                            console.log('---切换钱包按钮被点击')
                        }}
                        onSet={() => {
                            console.log('---设置按钮被点击')
                            this.props.navigation.navigate('Set');
                        }}
                        onQRCode={() => {
                            console.log('---二维码按钮被点击')
                            this.props.navigation.navigate('ReceiptCode');
                        }}
                        onAddAssets={() => {
                            console.log('---添加资产按钮被点击')
                            this.showAddtoken()
                        }}
                        walletName={this.props.walletName}
                        address={this.formatAddress(this.props.walletAddress)}
                        totalAssets={this.props.totalAssets + ''}
                        switchWalletIcon={require('../../assets/home/switch.png')}
                        headIcon={require('../../assets/home/user.png')}
                        QRbtnIcon={require('../../assets/home/QR_icon.png')}
                        setBtnIcon={require('../../assets/home/setting.png')}
                        addAssetsIcon={require('../../assets/home/plus_icon.png')}
                    />}
                />
                {/* <ImageButton
                    btnStyle={{ width: 30, height: 30, right: 20, top: 30, position: 'absolute' }}
                    // imageStyle={{ }}
                    onClick={() => {
                        console.log('---目录按钮被点击')
                    }}
                    backgroundImageSource={require('../../assets/home/caidan.png')}
                /> */}
                <AddToken
                    open={this.state.addTokenShow}
                    close={() => {
                        this.setState({
                            addTokenShow: false
                        })
                    }}
                    onClickAdd={this.onClickAdd.bind(this)}
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
    addToken: (token) => dispatch(addToken(token))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)