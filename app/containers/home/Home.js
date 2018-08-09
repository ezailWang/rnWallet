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
export default class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{ id: '1', name: 'ETH', value: '100' },
            { id: '2', name: 'ITC', value: '888' },
            { id: '3', name: 'ITC', value: '888' },
            { id: '4', name: 'ITC', value: '888' }],
            datak: []
        }

    }
    renderItem = (item) => (
        <HomeCell
            item={item}
            onClick={this.onClickCell.bind(this,item)}
        />
    )

    onClickCell=(item)=>{
        this.props.navigation.navigate('TransactionRecoder',props={transferType:"ETH"});
        console.log('---cell被点击:',item.id)
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
                            this.props.navigation.navigate('Set')
                            console.log('---设置按钮被点击')
                            this.props.navigation.navigate("Set");
                        }}
                        onQRCode={() => {
                            console.log('---二维码按钮被点击')
                            this.props.navigation.navigate('ReceiptCode');
                        }}
                        onAddAssets={() => {
                            console.log('---添加资产按钮被点击')
                        }}
                        walletName='testWallet'
                        address='0Xfnew232...24n1id'
                        totalAssets='0.88'
                    />}
                />
                <ImageButton
                    btnStyle={{ width: 30, height: 30, right: 20, top: 30, position: 'absolute' }}
                    imageStyle={{ width: 30, height: 30 }}
                    onClick={() => {
                        console.log('---目录按钮被点击')
                    }}
                    backgroundImageSource={layoutConstants.DEFAULT_IAMGE}
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