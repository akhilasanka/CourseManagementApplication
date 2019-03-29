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


/*router.post('/signup',function (req, res) {
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

router.post('/signup', function (req, res) {
  console.log("Inside signup post request");
  console.log("Request Body:");
  console.log(req.body);
  let formatEmail = req.body.email.toLowerCase().trim();
  console.log("formatted email:" + formatEmail);
  let password = req.body.password;
  console.log(password);
  //let enPassword = sha1(password);
  let enPassword = null;
  let isFaculty = req.body.isFaculty;
  var role = isFaculty ? "faculty" : "student";
  Users.findOne({ email: formatEmail }, function (err, rows) {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      //callback(err, "Dtaabase Error");
      res.status(500).json({ responseMessage: 'Database not responding' });
    } else {
      if (rows) {
        console.log("User already exists");
        //callback(null, {status: 401, rows});
        res.status(200).json({ responseMessage: 'User already exists!' });
      } else {
        crypt.newHash(password, function (response) {
          enPassword = response;
          console.log("Encrypted password: " + enPassword);
          var userData = {
            "name": req.body.name,
            "email": formatEmail,
            "password": enPassword,
            "role": role
          }
          //Save the user in database
          Users.create(userData, function (err, user) {
            if (err) {
              console.log("unable to insert into database", err);
              //callback(err, "Database Error");
              res.status(500).json({ responseMessage: 'Database not responding' });
            } else {
              console.log("User Signup Successful");
              //callback(null, {status: 200, user});
              res.status(200).json({ responseMessage: 'Successfully Added!' });
            }
          });
        });
      }
    }
  })
});*/

router.post('/signup', function (req, res) {
  console.log("Inside signup post request");
  console.log("Request Body:");
  console.log(req.body);
  let formatEmail = req.body.email.toLowerCase().trim();
  console.log("formatted email:" + formatEmail);

  kafka.make_request('loginSignup_topics',{"path":"userSignup", "formatEmail": formatEmail, "body": req.body}, function(err,result){
    if (err) {
      console.log(err);
      //res.status(400).json({responseMessage: 'Database Error'});
    }
    else if (result.status === 200)
    {
      console.log("User Added");
      // Create token if the password matched and no error was thrown
      /*var token = jwt.sign({ id: result.user._id, email: result.user.email }, config.secret_key, {
        expiresIn: 7200 // expires in 2 hours
      });
      res.status(200).json({responseMessage: 'User Added', token: 'JWT ' + token, cookie1: 'travellercookie', cookie2: trimemail, cookie3: req.body.firstname, cookie4: req.body.lastname});*/
    } else if (result.status === 401){
      console.log("User already exists");
     // res.status(401).json({responseMessage: 'User already exists'})
    }
  });

});


/*router.post('/login', function (req, res) {
  console.log("Inside login post request");
  console.log("Request Body:");
  console.log(req.body);
  formatEmail = req.body.email.toLowerCase().trim();
  console.log("formatted email:" + formatEmail);
  let password = req.body.password;
  console.log(password);
  let isFaculty = req.body.isFaculty;
  var role = isFaculty ? "faculty" : "student";
  Users.findOne({email:formatEmail, role:role}, function(err,user){
    if (err) {
        console.log(err);
        console.log("unable to read the database");
        //callback(err, "unable to read the database");
        res.status(500).json({ responseMessage: 'Database not responding' });
    } else if (user) {
        console.log("user:", user)
        crypt.compareHash(password, user.password, function (err, isMatch) {
            if (isMatch && !err) {
                console.log("Login Successful");
                //callback(null, {status: 200, user});
                console.log("creating token");
            var token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.secret_key, {
              expiresIn: 7200 // expires in 2 hours
            });
            console.log("token",token);
            res.cookie('cookie1', user.role, { maxAge: 900000, httpOnly: false, path: '/' });
            res.cookie('cookie2', user.id, { maxAge: 900000, httpOnly: false, path: '/' });
            res.cookie('cookie3', user.name, { maxAge: 900000, httpOnly: false, path: '/' });
            console.log("Added cookies");
            req.session.user = user.email;
            res.status(200).json({ validUser: true, token: token });

            } else {
                console.log("Authentication failed. Passwords did not match");
                //callback(null, {status: 401});
                res.status(200).json({ validUser: false });
            }
        })
    } else {
        console.log("Authentication failed. User does not exist.");
        res.status(200).json({ validUser: false });
       // callback(null, {status: 402});
    }
});


});*/

router.post('/login', function (req, res) {
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
});

module.exports = router;