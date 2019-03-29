import  { GET_PROFILE, REMOVE_PROFILE_PIC, UPDATE_PROFILE, UPLOAD_PROFILE_PIC } from './types';
import axios from 'axios';
import swal from 'sweetalert';


export const getProfile = (id, role) => 
async (dispatch) => {

    var result = {
        data : {},
        imgName : null,
        img : null
    }

    await axios({
        method: 'get',
        url: 'http://localhost:3001/profile',
        params: { "id": id, "table": role },
        config: { headers: { 'Content-Type': 'application/json' } }
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
            result.data = responseData
            //JSON.stringify(responseData);
            if (responseData.img != null) {
                result.imgName = responseData.img;
              await axios({
                    method: 'get',
                    url: 'http://localhost:3001/profile/img',
                    params: { "id": id, "role": role },
                    config: { headers: { 'Content-Type': 'application/json' } }
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
    axios({
        method: 'put',
        url: 'http://localhost:3001/img',
        data: {id:id, role:role},
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
    await axios({
        method: 'post',
        url: 'http://localhost:3001/profile',
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

    axios({
        method: 'post',
        url: 'http://localhost:3001/img/upload',
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