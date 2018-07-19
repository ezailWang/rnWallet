import {
    SET_NETWORK
} from '../action/ActionType'

const defaultState = {
    network: 'mainnet',
    walletAddress:'0xfdb16996831753d5331ff813c29a93c76834a0ad'
}

function coreReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_NETWORK:
            return {
                ...state,
                network: state.network,
            }
            break;
        default: return state;
    }
}

export default coreReducer