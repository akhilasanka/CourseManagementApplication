import { GET_HOME_PAGE_COURSES } from '../actions/types';

const initialState = {
    courses: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_HOME_PAGE_COURSES:
            console.log(action.payload);
            return {
                ...state,
                courseList: action.payload,
            }
        default:
            return state;
    }
}