import React, { Component } from 'react'
import {
    FlatList,
    View,
    StyleSheet,
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
import { addToken } from '../../config/action/Actions'
import StorageManage from '../../utils/StorageManage'
import { StorageKey } from '../../config/GlobalConfig'

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addTokenShow: false,
        }

    }

    renderItem = (item) => (
        <HomeCell
            item={item}
            onClick={this.onClickCell.bind(this, item)}
        />
    )

    onClickCell = (item) => {
        this.props.navigation.navigate('TransactionRecoder', props = { transferType: "ETH" });
        console.log('---cell被点击:', item)
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

    formatAddress(address) {
        return address.substr(0, 5) + '...' + address.slice(-5)
    }

    async componentDidMount() {
        await networkManage.loadTokenList()
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
                <ImageButton
                    btnStyle={{ width: 30, height: 30, right: 20, top: 30, position: 'absolute' }}
                    // imageStyle={{ }}
                    onClick={() => {
                        console.log('---目录按钮被点击')
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