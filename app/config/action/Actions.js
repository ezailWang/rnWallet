import * as types from './ActionType'

function generateMnemonic(mnemonic){
    return {
        type: types.GENERATE_MNEMONIC,
        mnemonic: mnemonic,
    }
}

function setWalletTransferParams(walletTransfer) {
    return {
        type:types.WALLET_TRANSFER,
        walletTransfer:walletTransfer
    }
}

function setWalletAddress(address) {
    return {
        type: types.SET_WALLET_ADDRESS,
        walletAddress: address,
    }
}

export {
    generateMnemonic,
    setWalletTransferParams,
    setWalletAddress
}