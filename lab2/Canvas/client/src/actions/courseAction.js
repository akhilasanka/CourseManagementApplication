import { GET_HOME_PAGE_COURSES } from './types';
import axios from 'axios';

export const getCourses = (url, id) => async (dispatch) => {
    var token = localStorage.getItem("token");
    axios.defaults.withCredentials = true;
    await axios({
        method: 'get',
        url: url,
        params: { "id": id },
        config: { headers: { 'Content-Type': 'application/json' } },
        headers: { "Authorization": `Bearer ${token}` }
    })
        .then((response) => {
            //update the state with the response data
            if (response.data.courses) {
                dispatch({
                    type: GET_HOME_PAGE_COURSES,
                    payload: response.data.courses
                });

            }
        }).catch(function (err) {
            console.log(err)
        });
}