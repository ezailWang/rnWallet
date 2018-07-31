import * as types from './ActionType'

function walletTest(mnemonic, address, path, seed) {
    return {
        type: types.TEST_WALLET,
        mnemonic: mnemonic,
        address: address,
        path: path,
        seed: seed,
    }
}

function selectApi(api) {
    return {
        type: types.TEST_SELECT_API,
        api: api,
    }
}

function setWalletAddress(address) {
    return {
        type: types.SET_WALLET_ADDRESS,
        walletAddress: address,
    }
}

function generateMnemonic(mnemonic){
    return {
        type: types.GENERATE_MNEMONIC,
        mnemonic: mnemonic,
    }
}

export { walletTest, selectApi, setWalletAddress,generateMnemonic }