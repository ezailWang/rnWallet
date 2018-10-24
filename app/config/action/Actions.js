import * as types from './ActionType'
import StorageManage from '../../utils/StorageManage'
import { StorageKey } from '../GlobalConfig'

function generateMnemonic(mnemonic) {
    return {
        type: types.GENERATE_MNEMONIC,
        mnemonic: mnemonic,
    }
}

function setWalletTransferParams(walletTransfer) {
    return {
        type: types.WALLET_TRANSFER,
        walletTransfer: walletTransfer
    }
}

function setTransactionDetailParams(transactionDetail) {
    return {
        type: types.TRANSACTION_DETAIL,
        transactionDetail: transactionDetail
    }
}

function setWalletAddress(address) {
    return {
        type: types.SET_WALLET_ADDRESS,
        walletAddress: address,
    }
}

function setWalletName(name) {
    return {
        type: types.SET_WALLET_NAME,
        walletName: name,
    }
}

function addToken(token) {
    return {
        type: types.ADD_TOKEN,
        token: {
            contractAddress: token.contractAddress,
            symbol: token.symbol,
            decimals: parseInt(token.decimals, 10)
        }
    }
}

function removeToken(contractAddress){
    return {
        type:types.REMOVE_TOKEN,
        contractAddress:contractAddress
    }
}

function loadTokenBalance(tokens) {
    return {
        type: types.LOAD_TOKEN_BALANCE,
        tokens: tokens
    }
}

function setTotalAssets(value) {
    return {
        type: types.SET_TOTAL_ASSETS,
        value: value.toFixed(2)
    }
}

function setTransactionRecoders(value) {
    return {
        type: types.SET_TRANSACTION_RECODER,
        recoders: value
    }
}

function setCoinBalance(value) {
    return {
        type: types.SET_COIN_BALANCE,
        balance: value
    }
}

// function setWalletPasswordPrompt(value) {
//     return {
//         type: types.SET_WALLET_PASSWORD_PROMPT,
//         walletPasswordPrompt: value
//     }
// }

function setNetWork(value) {
    StorageManage.save(StorageKey.Network,value)
    return {
        type: types.SET_NETWORK,
        network: value
    }
}

function setMonetaryUnit(value){
    return{
        type: types.SET_MONETARY_UNIT,
        monetaryUnit : value
    }
}

function setNewTransaction(value){
    return{
        type: types.SET_NEW_TRANSACTION,
        newTransaction : value
    }
}

function setFirstQR(){
    return{
        type:types.SET_FIRST_QR,
    }
}

function setPinInfo(value){
    return{
        type:types.SET_PIN_INFO,
        pinInfo:value
    }
}

function setIsNewWallet(value){
    return{
        type:types.IS_NEW_WALLET,
        isNewWallet:value
    }
}

function setContactList(value){
    return{
        type : types.SET_CONTACT_LIST,
        contactList : value
    }
}

export {
    generateMnemonic,
    setWalletTransferParams,
    setTransactionDetailParams,
    setWalletAddress,
    setWalletName,
    addToken,
    loadTokenBalance,
    setTotalAssets,
    setTransactionRecoders,
    setCoinBalance,
    setNetWork,
    removeToken,
    setMonetaryUnit,
    setNewTransaction,
    setFirstQR,
    setPinInfo,
    setIsNewWallet,
    setContactList
}