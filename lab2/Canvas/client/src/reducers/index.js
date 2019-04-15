import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import profileReducer from './profileReducer';
import inboxReducer from './inboxReducer';
import courseReducer from './courseReducer';

export default combineReducers({
    login : loginReducer,
    signup : signupReducer,
    profile : profileReducer,
    inbox : inboxReducer,
    courses: courseReducer
});