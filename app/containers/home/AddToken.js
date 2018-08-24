import React, { Component } from 'react'
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native'
import { Colors } from '../../config/GlobalConfig'
import layoutConstants from '../../config/LayoutConstants'
import ImageButton from '../../components/ImageButton'
import networkManage from '../../utils/networkManage'
import { store } from '../../config/store/ConfigureStore'

export default class AddToken extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tokenAddress: '',
            tokenSymbol: '',
            tokenDecimals: 0,
            isValidAddress: false,
        }
    }

    checkInput() {
        const { tokens } = store.getState().Core
        const tokensAddresses = tokens
            .filter(token => token.symbol !== 'ETH')
            .map(token => token.contractAddress)
        if (this.state.tokenAddress !== '' && !this.state.isValidAddress) {
            return '合约地址无效'
        } else if (this.state.isValidAddress && tokensAddresses.includes(this.state.tokenAddress)) {
            return '该合约资产已经添加'
        }
        else if (this.state.isValidAddress && (this.state.tokenSymbol.length <= 0 || this.state.tokenSymbol > 10)) {
            return '请输入资产标识0~10个字符'
        } else if (this.state.tokenDecimals > 36 || this.state.tokenDecimals < 0) {
            return '精度范围在0~36'
        }
        return ''
    }

    render() {
        let checkStr = this.checkInput()
        return (
            <Modal
                visible={this.props.open}
                transparent={true}
                animationType={"fade"}
                onRequestClose={() => { alert("Modal has been closed.") }}
                style={{ backgroundColor: Colors.blackOpacityColor }}
            >
                <View style={styles.container}>
                    <KeyboardAvoidingView 
                    behavior="padding"
                    style={styles.contentContainer}>
                        <View style={styles.TopContainer}>
                            <Text style={styles.TopText}> 添加资产 </Text>
                            <ImageButton
                                btnStyle={styles.BackBtn}
                                onClick={this.props.close}
                                backgroundImageSource={require('../../assets/home/addTokenBack.png')}
                            />
                        </View>
                        <View style={styles.MiddleContainer}>
                            <TextInput style={styles.TextInput}
                                placeholder='合约地址'
                                onChange={(event) => {
                                    this.setState({
                                        isValidAddress: networkManage.isValidAddress(event.nativeEvent.text) ? true : false,
                                        tokenAddress: event.nativeEvent.text
                                    })
                                }}
                            />
                            <TextInput style={styles.TextInput}
                                placeholder='资产标识'
                                onChange={(event) => {
                                    this.setState({
                                        tokenSymbol: event.nativeEvent.text
                                    })
                                }}
                            />
                            <TextInput style={styles.TextInput}
                                placeholder='小数精度'
                                keyboardType='numeric'
                                onChange={(event) => {
                                    this.setState({
                                        tokenDecimals: event.nativeEvent.text
                                    })
                                }}
                            />
                        </View>
                        <View style={styles.BottomContainer}>
                            <Text
                                style={styles.ValitText}
                            >{checkStr}</Text>
                            <TouchableOpacity
                                style={styles.BottomBtn}
                                disabled={!this.state.isValidAddress}
                                onPress={() => {
                                    this.props.onClickAdd(this.state)
                                }}
                            >
                                <Text style={{ color: Colors.whiteBackgroundColor, fontWeight: 'bold', fontSize: 15 }}>添加</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.blackOpacityColor,
       
    },
    contentContainer: {
        backgroundColor: Colors.whiteBackgroundColor,
        height: layoutConstants.WINDOW_HEIGHT * 0.45,
        width: layoutConstants.WINDOW_WIDTH * 0.84,
        marginTop: layoutConstants.WINDOW_HEIGHT * 0.2,
        alignSelf: 'center',
        alignItems: 'stretch',
    },
    TopContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    MiddleContainer: {
        flex: 3,
    },
    BottomContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    TextInput: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: Colors.borderColor_e,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 0
    },
    ValitText: {
        alignSelf: 'center',
        fontSize: 10,
        color: 'red',
        height: 15,
        marginTop: 10,
    },
    BottomBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 40,
        marginBottom: 25,
        borderRadius: (layoutConstants.WINDOW_HEIGHT * 0.45 * 1 / 3 - 50) / 2,
        backgroundColor: Colors.themeColor,
    },
    BackBtn: {
        marginRight: 10,
        position: 'absolute',
        right: 10,
    },
    TopText: {
        alignSelf: 'center',
        fontSize: 20
    }
})