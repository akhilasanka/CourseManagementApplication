exports.loginSignupService = function loginSignupService(msg, callback){
    console.log("In Login Signup Service path:", msg.path);
    switch(msg.path){
        case "usersignup":
            userSignup(msg,callback);
            break;
    }
};

function userSignup(msg, callback){

    console.log("In travellerlogin topic service. Msg: ", msg);

}