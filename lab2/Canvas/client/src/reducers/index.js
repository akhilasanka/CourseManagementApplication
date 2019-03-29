import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import profileReducer from './profileReducer';

export default combineReducers({
    login : loginReducer,
    signup : signupReducer,
    profile : profileReducer,
});