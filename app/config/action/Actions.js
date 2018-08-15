import * as types from './ActionType'

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
    setCoinBalance
}