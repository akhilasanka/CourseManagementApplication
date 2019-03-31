//libraries
const express = require('express');
const router = express.Router();
var passport = require('passport');

//imports
var kafka = require('../kafka/client');


//middleware
var requireAuth = passport.authenticate('jwt', { session: false });

router.get('/emailList', requireAuth, function (req, res) {
    console.log("Inside inbox emailList get request");
  
    kafka.make_request('inbox_topics',{"path":"inbox_emailList"}, function(err,result){
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200)
      {
        console.log("Results found");
        res.status(200).json({ emailList: result.emailList });
      } else if (result.status === 401){
        console.log("No results found");
        res.status(200).json({ responseMessage: 'No results found!' });
      }
    });
  
  });

  router.post('/inbox/new/message', requireAuth, function (req, res) {
    console.log("Inside signup post request");
    console.log("Request Body:");
    console.log(req.body);
  
    kafka.make_request('inbox_topics',{"path":"inbox_save_new_message","body":req.body}, function(err,result){
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200)
      {
        console.log("Message Added");
        res.status(200).json({ responseMessage: 'Successfully Sent!' });
      }
    });
  
  });

  router.get('/inbox/messages', requireAuth, function (req, res) {
    console.log("Inside inbox messages get request");
  
    kafka.make_request('inbox_topics',{"path":"inbox_messages", "email": req.query.email}, function(err,result){
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200)
      {
        console.log("Results found");
        res.status(200).json({ msgs: result.msgs });
      } else if (result.status === 401){
        console.log("No results found");
        res.status(200).json({ responseMessage: 'No results found!' });
      }
    });
  
  });

  module.exports = router;