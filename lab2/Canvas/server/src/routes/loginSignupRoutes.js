//libraries
const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

//imports
const LoginSignupDao = require("../dao/daoForLoginSignupRoutes");
const loginSignupDao = new LoginSignupDao();
var config = require('../../config/settings');
var crypt = require('./bcrypt.js');
var Users = require('../models/UserSchema');
var kafka = require('../kafka/client');

// Set up middleware
var jwt = require('jsonwebtoken');
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', { session: false });


router.post('/signup', function (req, res) {
  console.log("Inside signup post request");
  console.log("Request Body:");
  console.log(req.body);
  let formatEmail = req.body.email.toLowerCase().trim();
  console.log("formatted email:" + formatEmail);

  kafka.make_request('loginSignup_topics',{"path":"userSignup", "formatEmail": formatEmail, "body": req.body}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("User Added");
      res.status(200).json({ responseMessage: 'Successfully Added!' });
    } else if (result.status === 401){
      console.log("User already exists");
      res.status(200).json({ responseMessage: 'User Already exists!' });
    }
  });

});


router.post('/login', function (req, res) {
  console.log("Inside login post request");
  console.log("Request Body:");
  console.log(req.body);
  formatEmail = req.body.email.toLowerCase().trim();
  console.log("formatted email:" + formatEmail);
  
  kafka.make_request('loginSignup_topics',{"path":"login", "formatEmail": formatEmail, "body": req.body}, function(err,result){
    if (err) {
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("result:", result);
      // Create token if the password matched and no error was thrown
      var token = jwt.sign({ id: result.user._id, email: result.user.email }, config.secret_key, {
        expiresIn: 7200 // expires in 2 hours
      });
      
      res.cookie('cookie1', result.user.role, { maxAge: 900000, httpOnly: false, path: '/' });
      res.cookie('cookie2', result.user._id, { maxAge: 900000, httpOnly: false, path: '/' });
      res.cookie('cookie3', result.user.name, { maxAge: 900000, httpOnly: false, path: '/' });
      res.cookie('cookie4', result.user.email, { maxAge: 900000, httpOnly: false, path: '/' });
      req.session.user = result.user.email;
      res.status(200).json({ validUser: true, token: token });
      console.log("User found in DB and token is", token);

    } else if (result.status === 400){
      res.status(200).json({ validUser: false });
      console.log("Authentication failed. User does not exist.");
    }
  })

});

/*router.post('/login', function (req, res) {
  console.log("Inside login post request");
  console.log("Request Body:");
  console.log(req.body);
  formatEmail = req.body.email.toLowerCase().trim();
  console.log("formatted email:" + formatEmail);
  let password = req.body.password;
  console.log(password);
  let enPassword = sha1(password);
  console.log("Encrypted password: " + enPassword);
  let isFaculty = req.body.isFaculty;
  var user = isFaculty ? "faculty" : "student";
  let queryResult = [];
  const checkuser = async () => {
    queryResult = await loginSignupDao.login(user, formatEmail, enPassword);
    console.log(queryResult);

    if (!queryResult[0]) {
      console.log("Unable to find user");
      res.status(200).json({ validUser: false });
    } else {
      if (queryResult[0].name != null) {
        console.log("User exists! Valid credentials");
        //creating token since it is a valid user
        console.log("creating token");
        var token = jwt.sign({ id: queryResult[0].id, email: queryResult[0].email, role: user }, config.secret_key, {
          expiresIn: 7200 // expires in 2 hours
        });


        res.cookie('cookie1', user, { maxAge: 900000, httpOnly: false, path: '/' });
        res.cookie('cookie2', queryResult[0].id, { maxAge: 900000, httpOnly: false, path: '/' });
        res.cookie('cookie3', queryResult[0].name, { maxAge: 900000, httpOnly: false, path: '/' });
        res.cookie('cookie4', queryResult[0].email, { maxAge: 900000, httpOnly: false, path: '/' });
        console.log("Added cookies");
        req.session.user = queryResult[0].email;
        res.status(200).json({ validUser: true, token: token });
      }
    }
  }
  try {
    checkuser();
  }
  catch (err) {
    console.log("unable to read the database");
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});*/

module.exports = router;