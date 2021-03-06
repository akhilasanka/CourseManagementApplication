import  { GET_PROFILE, REMOVE_PROFILE_PIC, UPDATE_PROFILE, UPLOAD_PROFILE_PIC } from './types';
import axios from 'axios';
import swal from 'sweetalert';
import {rooturl} from '../config/settings';


export const getProfile = (id, role) => 
async (dispatch) => {

    var result = {
        data : {},
        imgName : null,
        img : null
    }
    var token = localStorage.getItem("token");
    await axios({
        method: 'get',
        url: 'http://'+rooturl+':3001/profile',
        params: { "id": id, "table": role },
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
            if(responseData.profile){
                result.data = responseData.profile;
            }
            console.log("img",responseData.profile.img);
            if (responseData.profile.img != '') {
             console.log("Image present");
                result.imgName = responseData.img;
              await axios({
                    method: 'get',
                    url: 'http://'+rooturl+':3001/profile/img',
                    params: { "id": id, "role": role },
                    config: { headers: { 'Content-Type': 'application/json' } },
                    headers: {"Authorization" : `Bearer ${token}`}
                })
                    .then((response) => {
                        if (response.status >= 500) {
                            throw new Error("Bad response from server");
                        }
                        console.log(response);
                        return response.data;
                    })
                    .then((responseData) => {
                        console.log(responseData.base64str);
                        result.img = "data:image/png;base64," + responseData.base64str;
                    }).catch(function (err) {
                        console.log(err)
                    });
            }
        }).catch(function (err) {
            console.log(err)
        });

        dispatch({
            type: GET_PROFILE,
            payload: result
        });   
}


export const removeProfilePic = (id, role) => 
async (dispatch) => {
    console.log("inside remove profile pic action");
    var token = localStorage.getItem("token");
    axios({
        method: 'put',
        url: 'http://'+rooturl+':3001/remove/img',
        data: {id:id, role:role},
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
        headers: {"Authorization" : `Bearer ${token}`}
    })
        .then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            console.log(response);
            return response.data;
        })
        .then((responseData) => {
            swal(responseData.responseMessage);
            dispatch({
                type: REMOVE_PROFILE_PIC,
                payload: responseData
            });
            window.location.reload();
        }).catch(function (err) {
            console.log(err)
        });
}

export const updateProfile = (data) => 
async (dispatch) => {
    var token = localStorage.getItem("token");
    await axios({
        method: 'post',
        url: 'http://'+rooturl+':3001/profile',
        data: data,
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
        headers: {"Authorization" : `Bearer ${token}`}
    })
        .then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            console.log(response);
            return response.data;
        })
        .then((responseData) => {
            dispatch({
                type: UPDATE_PROFILE,
                payload: responseData
            });
            swal("Sucessfully edited");
           // window.location.reload();
        }).catch(function (err) {
            console.log(err)
        });
}

export const uploadProfilePic = (data) => 
async (dispatch) => {
    var token = localStorage.getItem("token");
    axios({
        method: 'post',
        url: 'http://'+rooturl+':3001/img/upload',
        data: data,
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
        headers: {"Authorization" : `Bearer ${token}`}
    })
        .then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            console.log(response);
            return response.data;
        })
        .then((responseData) => {
            dispatch({
                type: UPLOAD_PROFILE_PIC,
                payload: responseData
            });
            swal(responseData.responseMessage);
            window.location.reload();
        }).catch(function (err) {
            console.log(err)
        });
}