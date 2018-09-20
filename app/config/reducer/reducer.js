import { combineReducers } from 'redux'
import coreReducer from './coreReducer'

const rootReducer = combineReducers({
    Core: coreReducer,
});

export default rootReducer