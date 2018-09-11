import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    TouchableOpacity,
    Keyboard
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import AddTokenInput from './component/AddTokenInput'
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import { Colors } from '../../config/GlobalConfig'
import networkManage from '../../utils/networkManage'
import layoutConstants from '../../config/LayoutConstants'
import { I18n } from '../../config//language/i18n'
import { store } from '../../config/store/ConfigureStore'


class AddAssets extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            tokenAddress: '',
            tokenSymbol: '',
            tokenDecimals: 0,
            isValidAddress: false,
            isValidSymbol: false,
            isValidDecimals: false,
            AddressCheckStr: I18n.t('home.address_check'),
            SymbolCheckStr: I18n.t('home.symbol_check'),
            DecimalsCheckStr: I18n.t('home.decimals_check'),
        }

    }

    checkAddress(addrees) {
        const { tokens } = store.getState().Core
        var isValidAddress = true
        const tokensAddresses = tokens
            .filter(token => token.symbol !== 'ETH')
            .map(token => token.contractAddress)
        if (tokensAddresses.includes(addrees)) {
            isValidAddress = false
        }
        this.setState({
            isValidAddress: isValidAddress,
            AddressCheckStr: I18n.t('home.address_repeat'),
            tokenAddress:addrees
        })
    }

    render() {
        return (
            <View
                onStartShouldSetResponder={() => true}
                onResponderRelease={() => {
                    Keyboard.dismiss()
                }}
                style={{ flex: 1, backgroundColor: 'white' }}>
                <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('home.add_token')} />
                <View style={{ height: 1, backgroundColor: Colors.bgGrayColor }} />
                <KeyboardAvoidingView
                    behavior='padding'
                    style={{ height: 360, width: layoutConstants.WINDOW_WIDTH, marginTop: 20 }} enabled>
                    <AddTokenInput
                        title={I18n.t('home.contract_address')}
                        onChange={(event) => {
                            const isValidAddressLet = networkManage.isValidAddress(event.nativeEvent.text)
                            if (isValidAddressLet) {
                                this.checkAddress(event.nativeEvent.text)
                            } else {
                                this.setState({
                                    isValidAddress: isValidAddressLet,
                                    tokenAddress: event.nativeEvent.text,
                                    AddressCheckStr: I18n.t('home.address_check')
                                })
                            }
                        }}
                        checkTextColor={this.state.tokenAddress !== '' && !this.state.isValidAddress ? Colors.RedColor : Colors.fontGrayColor}
                        checkText={this.state.AddressCheckStr}
                    />
                    <AddTokenInput
                        title={I18n.t('home.token_symbol')}
                        onChange={(event) => {
                            this.setState({
                                isValidSymbol: event.nativeEvent.text.length > 0 && event.nativeEvent.text.length < 10 ? true : false,
                                tokenSymbol: event.nativeEvent.text
                            })
                        }}
                        checkTextColor={this.state.tokenSymbol !== '' && !this.state.isValidSymbol ? Colors.RedColor : Colors.fontGrayColor}
                        checkText={this.state.SymbolCheckStr}
                    />
                    <AddTokenInput
                        title={I18n.t('home.token_decimals')}
                        onChange={(event) => {
                            this.setState({
                                isValidDecimals: event.nativeEvent.text > 0 && event.nativeEvent.text < 36 ? true : false,
                                tokenDecimals: event.nativeEvent.text
                            })
                        }}
                        keyboardType='numeric'
                        checkTextColor={this.state.tokenDecimals !== 0 && !this.state.isValidDecimals ? Colors.RedColor : Colors.fontGrayColor}
                        checkText={this.state.DecimalsCheckStr}
                    />
                    <TouchableOpacity
                        style={[styles.bottomBtn, { backgroundColor: this.state.isValidAddress && this.state.isValidDecimals && this.state.isValidSymbol ? Colors.btn_bg_blue : Colors.bgGrayColor }]}
                        disabled={!(this.state.isValidAddress && this.state.isValidDecimals && this.state.isValidSymbol)}
                        onPress={() => {
                            Keyboard.dismiss()
                            this.props.navigation.state.params.callback({
                                tokenAddress: this.state.tokenAddress,
                                tokenSymbol: this.state.tokenSymbol,
                                tokenDecimals: this.state.tokenDecimals,
                            })
                            this.props.navigation.goBack()
                        }}
                    >
                        <Text
                            style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}
                        >{I18n.t('home.add')}</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View >
        )
    }
}

export default AddAssets

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bottomBtn: {
        marginHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        height: 45,
    }
})