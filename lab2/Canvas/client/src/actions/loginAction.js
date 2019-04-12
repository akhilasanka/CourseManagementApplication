import  { AUTH_LOGIN } from './types';
import axios from 'axios';
import { rooturl } from '../config/settings';

export const authLogin = (data) => dispatch => {
    axios.defaults.withCredentials = true;
        axios({
            method: 'post',
            url: 'http://'+rooturl+':3001/login',
            // data: {"jsonData" : JSON.stringify(data)},        
            data: data,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                if (responseData.validUser == true) {
                    localStorage.setItem("token", responseData.token);
                    localStorage.setItem("cookie1", responseData.cookies.cookie1);
                    localStorage.setItem("cookie2", responseData.cookies.cookie2);
                    localStorage.setItem("cookie3", responseData.cookies.cookie3);
                    localStorage.setItem("cookie4", responseData.cookies.cookie4);
                    dispatch({
                        type: AUTH_LOGIN,
                        authFlag: true,
                        username: data.email,
                        displayErrorMsg: false
                    });
                    console.log("valid user");
                }
                if (responseData.validUser == false){
                    dispatch({
                        type: AUTH_LOGIN,
                        authFlag: false,
                        displayErrorMsg: true
                    });
                }
            }).catch(function (err) {
                console.log(err)
            });
}


/*export function authLogin(){
    return function(dispatch){

    }
}*/