const express = require('express');
const router = express.Router();
//const mysql = require('mysql');
const sha1 = require('sha1');
//const pool = require('../dao/dbConnectionPool');
const LoginSignupDao = require("../dao/daoForLoginSignupRoutes");
const loginSignupDao = new LoginSignupDao();


router.post('/signup',function (req, res) {
    console.log("Inside signup post request");
    console.log("Request Body:");
    console.log(req.body);
    let formatEmail = req.body.email.toLowerCase().trim();
    console.log("formatted email:"+formatEmail);
    let password = req.body.password;
    console.log(password);
    let enPassword = sha1(password);
    console.log("Encrypted password: "+enPassword);
    let isFaculty = req.body.isFaculty;
    var user = isFaculty ? "faculty" : "student";
    console.log(user);
    var queryResult = [];
    const createUserIfNotPresent = async () => {
      queryResult = await loginSignupDao.checkIfEmailExists(user,formatEmail);
      console.log(queryResult);
      if(queryResult[0]){
        if(queryResult[0].email != null){
          console.log("User already exists!");
          res.status(200).json({responseMessage: 'User already exists!'});
        }
      }
      else{
        var inputData = {
          "name": req.body.name,
          "email": formatEmail,
          "password": enPassword,
        }
        queryResult = await loginSignupDao.createNewUser(user,inputData);
        console.log("User Added");
        res.status(200).json({responseMessage: 'Successfully Added!'});
      }
    }

    try{
      createUserIfNotPresent();
    }
    catch(err){
      console.log(err);
      res.status(500).json({responseMessage: 'Database not responding'});
    }
   
});

router.post('/login',function (req, res) {
  console.log("Inside login post request");
  console.log("Request Body:");
    console.log(req.body);
    formatEmail = req.body.email.toLowerCase().trim();
    console.log("formatted email:"+formatEmail);
    let password = req.body.password;
    console.log(password);
    let enPassword = sha1(password);
    console.log("Encrypted password: "+enPassword);
    let isFaculty = req.body.isFaculty;
    var user = isFaculty ? "faculty" : "student";
    let queryResult = [];
    const checkuser = async () => {
    queryResult = await loginSignupDao.login(user,formatEmail,enPassword);
    console.log(queryResult);
    
  if (!queryResult[0]){
    console.log("Unable to find user");
    res.status(200).json({validUser: false});
  } else {
  if (queryResult[0].name != null) {
    console.log("User exists! Valid credentials");
    res.cookie('cookie1',user,{maxAge: 900000, httpOnly: false, path : '/'});
    res.cookie('cookie2',queryResult[0].id,{maxAge: 900000, httpOnly: false, path : '/'});
    res.cookie('cookie3',queryResult[0].name,{maxAge: 900000, httpOnly: false, path : '/'});
    console.log("Added cookies");
    req.session.user = queryResult[0].email;
    res.status(200).json({validUser: true});
  } 
  }
    }
    try{
      checkuser();
    }
    catch(err){
      console.log("unable to read the database");
       res.status(500).json({responseMessage: 'Database not responding'});
    }
});

module.exports = router;