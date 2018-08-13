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
import {HeaderButton} from '../../components/Button'

export default class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{ id: '1', name: 'ETH', value: '100' },
            { id: '2', name: 'ITC', value: '888' },
            { id: '3', name: 'ITC', value: '888' },
            { id: '4', name: 'ITC', value: '888' }],
            datak: [],
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
        console.log('---cell被点击:', item.id)
    }

    showAddtoken = () => {
        this.setState({
            addTokenShow: true
        })
    }

    onClickAdd = (data) => {
        console.log('data:', data)
        //添加token请求，刷新资产列表，风火轮
        this.setState({
            addTokenShow: false
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
                <FlatList
                    ItemSeparatorComponent={ItemDivideComponent}
                    ListEmptyComponent={EmptyComponent}
                    getItemLayout={(data, index) => ({ length: 50, offset: 60 * index, index: index })}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                    data={this.state.data}
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
                        walletName='testWallet'
                        address='0Xfnew232...24n1id'
                        totalAssets='0.88'
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