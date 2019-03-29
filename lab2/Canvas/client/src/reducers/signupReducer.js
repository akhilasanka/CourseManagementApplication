import  { SIGNUP } from '../actions/types';

const initialState = {
    redirect : false
}

export default function(state = initialState, action){
    switch(action.type){
        case SIGNUP: 
            return {
                ...state,
                redirect : action.redirect
            }
        default: 
            return state;
    }
}