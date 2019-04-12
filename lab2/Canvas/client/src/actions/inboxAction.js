import  { GET_EMAIL_LIST_FOR_INBOX , POST_INBOX_NEW_MESSAGE, GET_INBOX_MESSAGES } from './types';
import axios from 'axios';
import swal from 'sweetalert';
import {rooturl} from '../config/settings';

export const getEmailList = () => async (dispatch) => {
    var token = localStorage.getItem("token");
    axios.defaults.withCredentials = true;
    await axios({
        method: 'get',
        url: 'http://'+rooturl+':3001/emailList',
        config: { headers: { 'Content-Type': 'application/json' } },
        headers: {"Authorization" : `Bearer ${token}`}
    })
        .then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            return response.data;
        })
        .then(async (responseData) => {
            //result.data1 = "data";
            console.log('responseData: ', responseData)
            dispatch({
                type: GET_EMAIL_LIST_FOR_INBOX,
                payload: responseData
            });   
        }).catch(function (err) {
            console.log(err)
        });
}


export const postMessage = (data) => async (dispatch) => {
    var token = localStorage.getItem("token");
    axios.defaults.withCredentials = true;
    let email = data.from;
    await axios({
        method: 'post',
        data: data,
        url: 'http://'+rooturl+':3001/inbox/new/message',
        config: { headers: { 'Content-Type': 'application/json' } },
        headers: {"Authorization" : `Bearer ${token}`}
    })
        .then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            return response.data;
        })
        .then(async (responseData) => {
            console.log('responseData: ', responseData);
            swal(responseData.responseMessage);
            dispatch({
                type: POST_INBOX_NEW_MESSAGE,
                payload: responseData
            });   
        }).catch(function (err) {
            console.log(err)
        });
}


export const getInboxMessages = (email) => async (dispatch) => {
    var token = localStorage.getItem("token");
    console.log("In get request");
    axios.defaults.withCredentials = true;
    await axios({
        method: 'get',
        params: {email: email},
        url: 'http://'+rooturl+':3001/inbox/messages',
        config: { headers: { 'Content-Type': 'application/json' } },
        headers: {"Authorization" : `Bearer ${token}`}
    })
        .then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            return response.data;
        })
        .then(async (responseData) => {
            //result.data1 = "data";
            console.log('msgs: ', responseData)
            dispatch({
                type: GET_INBOX_MESSAGES,
                payload: responseData
            });   
        }).catch(function (err) {
            console.log(err)
        });
}

