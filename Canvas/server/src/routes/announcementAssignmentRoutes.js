const express = require('express');
const router = express.Router();
const AnnouncementAssignmentDao = require("../dao/daoForCourseRoutes");
const announcementAssignmentDao = new AnnouncementAssignmentDao();
const AnnouncementAssignmentBasicDao = require("../dao/daoForLoginSignupRoutes");
const aaBasicDao = new AnnouncementAssignmentBasicDao();

router.get('/announcements',function(req,res){
    console.log("Inside get announcements");
    console.log("Request params:");
    console.log(req.query);
    let courseID = req.query.courseID;
    var queryResult = [];
      const getAnnouncements = async () => {
        queryResult = await announcementAssignmentDao.getAnnouncements("announcements",courseID);
        if(queryResult[0]){
          if(queryResult[0].id != null){
            console.log("Data Found!");
            res.status(200).json(queryResult);
          }
        }
        else{
          res.status(400).json({responseMessage: 'Record not found'});
        }
      }
      try{
        getAnnouncements();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });

  router.post('/announcements',function(req,res){
    console.log("Inside post announcements");
    console.log("Request body:");
    console.log(req.body);
    var queryResult = [];
   
      const addAnnouncements = async () => {
        let inputData = {
            "course_id" : req.body.courseID, 
            "desc" : req.body.desc
        }
        queryResult = await aaBasicDao.createNewUser("announcements",inputData);
        if(queryResult[0]){
          if(queryResult[0].id != null){
            console.log("announcement added");
            res.status(200).json({responseMessage: 'Successfully added Announcement!'});
          }
        }
        else{
          res.status(400).json({responseMessage: 'Record not found'});
        }
      }
      try{
        addAnnouncements();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });

module.exports = router;