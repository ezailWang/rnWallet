import React, { Component } from 'react'
import {
    Platform,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import { store } from '../../config/store/ConfigureStore'

import networkManage from '../../utils/networkManage'
import { defaultTokens } from '../../utils/constants'
import { setWalletAddress } from '../../config/action/TestAction'
const toAddress = '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23'
const fromAddress= '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01'


export default class networkTest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fromETHBalance: 0,
            toETHBalance: 0,
            fromERCBalance: 0,
            toERCBalance: 0
        }
    }

    getBalance = async () => {
        var params = defaultTokens[1]
        var ethBalance = await networkManage.getBalance(params)
        console.log('ethBalance:',ethBalance)
        params = defaultTokens[0]
        var ercBalance = await networkManage.getBalance(params)
        console.log('ercBalance:',ercBalance)
        this.setState({
            fromETHBalance: ethBalance,
            fromERCBalance: ercBalance
        })
        store.dispatch(setWalletAddress(toAddress))
        params = defaultTokens[1]
        ethBalance = await networkManage.getBalance(params)
        console.log('ethBalance:',ethBalance)
        params = defaultTokens[0]
        ercBalance = await networkManage.getBalance(params)
        console.log('ercBalance:',ercBalance)
        this.setState({
            toETHBalance: ethBalance,
            toERCBalance: ercBalance
        })
        store.dispatch(setWalletAddress(fromAddress))
    }

    sendETH = async () => {
        var params = defaultTokens[1]
        const cb = await networkManage.sendTransaction(params,toAddress,'0.1')
        this.getBalance()
    }

    sendERC20 = async () => {
        var params = defaultTokens[0]
        const cb = await networkManage.sendTransaction(params,toAddress,'100')
        this.getBalance()
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.textView}>
                    <Text style={styles.label}> address </Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            autoCorrect={false}
                            editable={false}
                            placeholder="address"
                            placeholderTextColor="#E5E5E5"
                            multiline={true}
                            value={fromAddress}
                        />
                    </View>
                    <Text> eth余额: {this.state.fromETHBalance},wds余额：{this.state.fromERCBalance} </Text>
                </View>
                <View style={styles.textView}>
                    <Text style={styles.label}> address </Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            autoCorrect={false}
                            editable={false}
                            placeholder="address"
                            placeholderTextColor="#E5E5E5"
                            multiline={true}
                            value={toAddress}
                        />
                    </View>
                    <Text> eth余额: {this.state.toETHBalance},wds余额：{this.state.toERCBalance} </Text>
                </View>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button}
                        onPress={this.getBalance}
                    >
                        <Text> getBalance </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button}
                        onPress={this.sendETH}
                    >
                        <Text> sendEth </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button}
                        onPress={this.sendERC20}
                    >
                        <Text> sendERC20 </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 20
    },
    textView: {
        borderBottomColor: '#40E0D0',
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'ios' ? 20 : 30,
        paddingBottom: 15,
    },
    label: {
        color: '#9d9d9d',
        paddingLeft: Platform.OS === 'ios' ? 0 : 4,
        paddingBottom: Platform.OS === 'ios' ? 10 : 0,
    },
    inputRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    input: {
        color: '#40E0D0',
        flex: 1,
        flexGrow: 1,
        fontSize: 18,
    },
    buttonView: {
        paddingHorizontal: 20,
        paddingTop: 20,
        marginTop: 5,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#40E0D0',
        borderRadius: 8,
        paddingVertical: 20,
    },
    text: {
        fontSize: 15,
        color: '#E5E5E5',
        fontWeight: 'bold',
    }
});

// const mapStatToProps = state => ({

// });