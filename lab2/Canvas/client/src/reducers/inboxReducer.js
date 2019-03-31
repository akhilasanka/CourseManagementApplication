import { GET_EMAIL_LIST_FOR_INBOX, POST_INBOX_NEW_MESSAGE, GET_INBOX_MESSAGES } from '../actions/types';

const initialState = {
    emailList: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_EMAIL_LIST_FOR_INBOX:
            return {
                ...state,
                emailList: action.payload,
            }
        case POST_INBOX_NEW_MESSAGE:
            return {
                ...state,
                payload: action.payload,
            }
        case GET_INBOX_MESSAGES:
            return {
                ...state,
                msgs: action.payload,
            }
        default:
            return state;
    }
}