import  { AUTH_LOGIN } from './types';
import axios from 'axios';

export const authLogin = (data) => dispatch => {
    axios.defaults.withCredentials = true;
        axios({
            method: 'post',
            url: 'http://localhost:3001/login',
            // data: {"jsonData" : JSON.stringify(data)},        
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
                if (responseData.validUser == true) {
                    localStorage.setItem("token", responseData.token);
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