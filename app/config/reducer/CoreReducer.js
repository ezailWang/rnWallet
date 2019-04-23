import uuid from 'react-native-uuid';
import lodash from 'lodash';
import {
  SET_NETWORK,
  GENERATE_MNEMONIC,
  WALLET_TRANSFER,
  TRANSACTION_DETAIL,
  ADD_TOKEN,
  LOAD_TOKEN_BALANCE,
  SET_TOTAL_ASSETS,
  SET_TRANSACTION_RECODER,
  SET_COIN_BALANCE,
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
  CREATE_WALLET_PARAM,
  EXCHANGE_DEPOSITED,
} from '../action/ActionType';
import StorageManage from '../../utils/StorageManage';
import { StorageKey, Network } from '../GlobalConfig';

const defaultState = {
  network: Network.main,
  walletPasswordPrompt: '',
  mnemonic: '',
  // tokens: defaultTokens,
  tokens: [],
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
  wallet: null, // 当前正在使用的钱包
  createWalletParams: null,
  depositStatus: false,
};

function coreReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_NETWORK:
      return {
        ...state,
        network: action.network,
      };
    case GENERATE_MNEMONIC:
      return {
        ...state,
        mnemonic: action.mnemonic,
      };
    case WALLET_TRANSFER:
      return {
        ...state,
        walletTransfer: action.walletTransfer,
      };
    case TRANSACTION_DETAIL:
      return {
        ...state,
        transactionDetail: action.transactionDetail,
      };
    case ADD_TOKEN: {
      const addedToken = Object.assign(action.token, { id: uuid.v4() });
      const newTokens = state.tokens
        .filter(token => addedToken.address !== token.address)
        .concat(addedToken);
      if (state.wallet) {
        const key = StorageKey.Tokens + state.wallet.address;
        const localTokens = newTokens.filter(
          token => token.symbol.toLowerCase() !== 'itc' && token.symbol.toLowerCase() !== 'eth'
        );
        StorageManage.save(key, localTokens);
      }
      return {
        ...state,
        tokens: newTokens,
        /* tokens: state.tokens.concat([
                  Object.assign(
                      action.token,
                      { id: uuid.v4() }
                  ),
              ]), */
        // tokens: state.tokens.splice(2,0,action.token),
      };
    }
    case LOAD_TOKEN_BALANCE:
      return {
        ...state,
        tokens: action.tokens,
      };
    case SET_TOTAL_ASSETS:
      return {
        ...state,
        totalAssets: action.value,
      };
    case SET_TRANSACTION_RECODER:
      return {
        ...state,
        recoders: action.recoders,
      };
    case SET_COIN_BALANCE:
      return {
        ...state,
        balance: action.balance,
      };
    case SET_LANGUAGE:
      return {
        ...state,
        myLanguage: action.myLanguage,
      };
    case SET_MONETARY_UNIT:
      return {
        ...state,
        monetaryUnit: action.monetaryUnit,
      };
    case SET_NEW_TRANSACTION:
      return {
        ...state,
        newTransaction: action.newTransaction,
      };
    case REMOVE_TOKEN: {
      const copyToken = lodash.cloneDeep(state.tokens);
      const index = state.tokens.findIndex(item => item.address === action.address);
      if (index >= 2 && index < state.tokens.length) {
        copyToken.splice(index, 1);
      }

      if (state.wallet) {
        const key = StorageKey.Tokens + state.wallet.address;
        StorageManage.save(key, copyToken);
      }
      return {
        ...state,
        tokens: copyToken,
      };
    }
    case SET_FIRST_QR:
      return {
        ...state,
        firstQR: false,
      };
    case SET_PIN_INFO:
      return {
        ...state,
        pinInfo: action.pinInfo,
      };
    case IS_NEW_WALLET:
      return {
        ...state,
        isNewWallet: action.isNewWallet,
      };
    case SET_CONTACT_LIST:
      return {
        ...state,
        contactList: action.contactList,
      };
    case SET_ALL_TOKENS:
      return {
        ...state,
        allTokens: action.allTokens,
      };
    case SET_TRANSFER_RECORD_LIST:
      return {
        ...state,
        transferRecordList: action.transferRecordList,
      };
    case SET_ITC_WALLET_LIST:
      return {
        ...state,
        itcWalletList: action.itcWalletList,
      };
    case SET_ETH_WALLET_LIST:
      return {
        ...state,
        ethWalletList: action.ethWalletList,
      };
    case SET_CURRENT_WALLET:
      return {
        ...state,
        wallet: action.wallet,
      };
    case CREATE_WALLET_PARAM:
      return {
        ...state,
        createWalletParams: action.createWalletParams,
      };
    case EXCHANGE_DEPOSITED:
      return {
        ...state,
        depositStatus: action.depositStatus,
      };
    default:
      return state;
  }
}

export default coreReducer;
