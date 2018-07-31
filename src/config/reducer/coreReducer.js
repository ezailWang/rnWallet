import {
    SET_NETWORK, SET_WALLET_ADDRESS,GENERATE_MNEMONIC
} from '../action/ActionType'

const defaultState = {
    network: 'ropsten',
    testAddress:'0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
    testPrikey:'0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
    walletAddress:'0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01',
    prikey:'0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',

    mnemonic:'',
    walletName:'',
    password:'',
    passwordHint:'',
}

function coreReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_NETWORK:
            return {
                ...state,
                network: action.network,
            }
            break;
        case SET_WALLET_ADDRESS:
            return {
                ...state,
                walletAddress:action.walletAddress,
            }  
            break;   
        case GENERATE_MNEMONIC:
            return{
                ...state,
                mnemonic:action.mnemonic,
            }
            break;      
        default: return state;
    }
}

export default coreReducer