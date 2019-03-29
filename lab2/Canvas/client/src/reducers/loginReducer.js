import  { AUTH_LOGIN } from '../actions/types';

const initialState = {
    authFlag: false
}

export default function(state = initialState, action){
    switch(action.type){
        case AUTH_LOGIN: 
            return {
                ...state,
                authFlag : action.authFlag,
                displayErrorMsg: action.displayErrorMsg,
                username: action.username
            }
        default: 
            return state;
    }
}