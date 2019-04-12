import  { SIGNUP } from './types';
import axios from 'axios';
import swal from 'sweetalert';
import {rooturl} from '../config/settings';

export const signup = (data) => dispatch => {
    axios({
        method: 'post',
        url: 'http://'+rooturl+':3001/signup',       
        data: data,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
        .then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            return response.data;
        })
        .then((responseData) => {
            swal(responseData.responseMessage + " Try logging in.");
            dispatch({
                type: SIGNUP,
                redirect: true
            });
        }).catch(function (err) {
            console.log(err)
        });
}