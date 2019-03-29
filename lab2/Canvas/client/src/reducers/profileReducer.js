import  { GET_PROFILE , REMOVE_PROFILE_PIC, UPDATE_PROFILE, UPLOAD_PROFILE_PIC } from '../actions/types';

const initialState = {
    profileDetails : null
}

export default function(state=initialState, action){
    switch(action.type){
        case GET_PROFILE: 
            return {
                ...state,
                profileDetails : action.payload
            }
        case REMOVE_PROFILE_PIC:
            return {
                ...state,
                responseMsg : action.payload
            }
        case UPDATE_PROFILE:
            return {
                ...state,
                responseMsg : action.payload
            }
        case UPLOAD_PROFILE_PIC:
            return {
                ...state,
                responseMsg : action.payload
            }
        default: 
            return state;
    }
}