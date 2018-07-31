import { combineReducers } from 'redux'
import Test from './TestReducer'
import coreReducer from './coreReducer'

const rootReducer = combineReducers({
    Test: Test,
    Core: coreReducer,
});

export default rootReducer