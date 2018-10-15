import {
    SET_NETWORK,
    SET_WALLET_ADDRESS,
    GENERATE_MNEMONIC,
    WALLET_TRANSFER,
    TRANSACTION_DETAIL,
    ADD_TOKEN,
    LOAD_TOKEN_BALANCE,
    SET_TOTAL_ASSETS,
    SET_WALLET_NAME,
    SET_TRANSACTION_RECODER,
    SET_COIN_BALANCE,
    SET_WALLET_PASSWORD_PROMPT,
    REMOVE_TOKEN,
    SET_MONETARY_UNIT,
    SET_NEW_TRANSACTION,
    SET_FIRST_QR,
    SET_PIN_INFO,
    IS_NEW_WALLET
} from '../action/ActionType'
import { defaultTokens } from '../../utils/constants'
import uuid from 'react-native-uuid';
import { Network } from '../../config/GlobalConfig'
import lodash from 'lodash'

const defaultState = {
    // testAddress: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
    // testPrikey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
    //walletAddress: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01',
    // prikey: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
    network: Network.main,
    walletAddress: null,
    walletName: 'wallet',
    walletPasswordPrompt: '',
    mnemonic: '',
    tokens: defaultTokens,
    totalAssets: '0.00',
    recoders: [],
    monetaryUnit:null,
    firstQR:true,
    pinInfo:null,
    isNewWallet:false
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
                walletAddress: action.walletAddress,
            }
            break;
        case GENERATE_MNEMONIC:
            return {
                ...state,
                mnemonic: action.mnemonic,
            }
            break;
        case WALLET_TRANSFER:
            return {
                ...state,
                walletTransfer: action.walletTransfer
            }
            break;
        case TRANSACTION_DETAIL:
            return {
                ...state,
                transactionDetail: action.transactionDetail
            }
            break;
        case ADD_TOKEN:
            return {
                ...state,
                tokens: state.tokens.concat([
                    Object.assign(
                        action.token,
                        { id: uuid.v4() }
                    ),
                ]),
            }
            break;
        case SET_WALLET_NAME:
            return {
                ...state,
                walletName: action.walletName
            }
            break;
        case LOAD_TOKEN_BALANCE:
            return {
                ...state,
                tokens: action.tokens
            }
            break;
        case SET_TOTAL_ASSETS:
            return {
                ...state,
                totalAssets: action.value
            }
            break;
        case SET_TRANSACTION_RECODER:
            return {
                ...state,
                recoders: action.recoders
            }
            break;
        case SET_COIN_BALANCE:
            return {
                ...state,
                balance: action.balance
            }
            break;
        case SET_MONETARY_UNIT:
            return {
                ...state,
                monetaryUnit : action.monetaryUnit
            }    
            break;
        case SET_NEW_TRANSACTION:
            return {
                ...state,
                newTransaction : action.newTransaction
            }    
            break;
        case REMOVE_TOKEN:
            const copyToken = lodash.cloneDeep(state.tokens)
            copyToken.splice(state.tokens.findIndex(item => item.contractAddress === action.contractAddress),1)   
            return {
                ...state,
                tokens: copyToken
            }
            break;
        case SET_FIRST_QR:
            return {
                ...state,
                firstQR:false
            }   
            break;
        case SET_PIN_INFO:
             return {
                 ...state,
                 pinInfo:action.pinInfo
             } 
             break;
        case IS_NEW_WALLET:
             return {
                 ...state,
                 isNewWallet:action.isNewWallet
            } 
            break;
        default: return state;
    }
}

export default coreReducer