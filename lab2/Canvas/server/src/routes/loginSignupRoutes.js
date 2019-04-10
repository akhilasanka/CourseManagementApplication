//libraries
const express = require('express');
const router = express.Router();

//imports
var config = require('../../config/settings');
var kafka = require('../kafka/client');

// Set up middleware
var jwt = require('jsonwebtoken');
var passport = require('passport');


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

module.exports = router;