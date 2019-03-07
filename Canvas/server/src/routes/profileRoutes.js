const express = require('express');
const router = express.Router();
const ProfileDao = require("../dao/daoForLoginSignupRoutes");
const profileDao = new ProfileDao();

router.get('/profile', function(req,res){
    console.log("Inside profile get request");
    console.log("Request params:");
    console.log(req.query);
    let studentID= req.query.id;
    var queryResult = [];
    const getProfileData = async () => {
      queryResult = await profileDao.checkIfUserExists(req.query.table,studentID);
      if(queryResult[0]){
        if(queryResult[0].email != null){
          console.log("Data Found!");
          let obj = queryResult[0];
          delete queryResult['password'];
          Object.keys(obj).forEach(k => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
          res.status(200).json(obj);
        }
      }
      else{
        res.status(400).json({responseMessage: 'Record not found'});
      }
    }
    try{
      getProfileData();
    }
    catch(err){
      console.log(err);
      res.status(500).json({responseMessage: 'Database not responding'});
    }
});


router.post('/profile',function (req, res) {
    console.log("Inside profile put request");
    console.log("Request Body:");
    console.log(req.body);
    let studentID = req.body.id;
    let table = req.body.table;
    var queryResult = [];
    var inputData = {
        "name": req.body.name,
        "img" : req.body.img,
        "phonenumber" : req.body.phoneNumber,
        "country" : req.body.country,
        "school" : req.body.school,
        "hometown" : req.body.hometown,
        "languages" : req.body.languages,
        "gender" : req.body.gender,
      }
    const getProfileData = async () => {
      queryResult = await profileDao.updateUser(table,studentID,inputData);
      if(queryResult){
          console.log("Data updated!");
          res.status(200).json(queryResult);
      }
      else{
        res.status(400).json({responseMessage: 'Record not found'});
      }
    }
    try{
      getProfileData();
    }
    catch(err){
      console.log(err);
      res.status(500).json({responseMessage: 'Database not responding'});
    }
});

module.exports = router;