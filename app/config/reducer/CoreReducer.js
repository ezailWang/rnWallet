import {
    SET_NETWORK,
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
    SET_LANGUAGE,
    SET_MONETARY_UNIT,
    SET_NEW_TRANSACTION,
    SET_FIRST_QR,
    SET_PIN_INFO,
    IS_NEW_WALLET,
    SET_CONTACT_LIST,
    SET_ALL_TOKENS,
    SET_TRANSFER_RECORD_LIST,
    SET_ITC_WALLET_LIST,
    SET_ETH_WALLET_LIST,
    SET_CURRENT_WALLET,
    CREATE_WALLET_PARAM
} from '../action/ActionType'
import { defaultTokens } from '../../utils/Constants'
import uuid from 'react-native-uuid';
import { Network } from '../GlobalConfig'
import lodash from 'lodash'

const defaultState = {
    network: Network.rinkeby,
    walletPasswordPrompt: '',
    mnemonic: '',
    tokens: defaultTokens,
    totalAssets: '0.00',
    recoders: [],
    myLanguage: null,
    monetaryUnit: null,
    firstQR: true,
    pinInfo: null,
    isNewWallet: false,
    contactList: [],
    allTokens: [],
    transferRecordList: [],
    itcWalletList: [],
    ethWalletList: [],
    wallet: null,//当前正在使用的钱包
    createWalletParams:null,
}

function coreReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_NETWORK:
            return {
                ...state,
                network: action.network,
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
                //tokens: state.tokens.splice(2,0,action.token),
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

        case SET_LANGUAGE:
            return {
                ...state,
                myLanguage: action.myLanguage
            }
            break;
        case SET_MONETARY_UNIT:
            return {
                ...state,
                monetaryUnit: action.monetaryUnit
            }
            break;
        case SET_NEW_TRANSACTION:
            return {
                ...state,
                newTransaction: action.newTransaction
            }
            break;
        case REMOVE_TOKEN:
            const copyToken = lodash.cloneDeep(state.tokens)
            copyToken.splice(state.tokens.findIndex(item => item.address === action.address), 1)
            return {
                ...state,
                tokens: copyToken
            }
            break;
        case SET_FIRST_QR:
            return {
                ...state,
                firstQR: false
            }
            break;
        case SET_PIN_INFO:
            return {
                ...state,
                pinInfo: action.pinInfo
            }
            break;
        case IS_NEW_WALLET:
            return {
                ...state,
                isNewWallet: action.isNewWallet
            }
            break;
        case SET_CONTACT_LIST:
            return {
                ...state,
                contactList: action.contactList
            }
            break;
        case SET_ALL_TOKENS:
            return {
                ...state,
                allTokens: action.allTokens
            }
            break;
        case SET_TRANSFER_RECORD_LIST:
            return {
                ...state,
                transferRecordList: action.transferRecordList
            }
            break;
        case SET_ITC_WALLET_LIST:
            return {
                ...state,
                itcWalletList: action.itcWalletList
            }
            break;
        case SET_ETH_WALLET_LIST:
            return {
                ...state,
                ethWalletList: action.ethWalletList
            }
            break;
        case SET_CURRENT_WALLET:
            return {
                ...state,
                wallet: action.wallet
            }
            break;
        case CREATE_WALLET_PARAM:
            return {
                ...state,
                createWalletParams: action.createWalletParams
            }
            break;
        default: return state;
    }
}

export default coreReducer