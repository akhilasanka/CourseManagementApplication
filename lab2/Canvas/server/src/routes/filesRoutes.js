const express = require('express');
const router = express.Router();
const CourseFilesDao = require("../dao/daoForCourseFiles");
const courseFilesDao = new CourseFilesDao();
const CourseFilesBasicDao = require("../dao/daoForLoginSignupRoutes");
const ccBasicDao = new CourseFilesBasicDao();
var fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/coursefiles');
  },
  filename: (req, file, callback) => {
    fileExtension = file.originalname.split('.')[1];
    console.log("fileExtension",fileExtension);
    callback(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + fileExtension);
  },
});

var upload = multer({ storage : storage });

router.post('/files/upload',upload.single('selectedFile'),function(req,res){
    console.log("Inside post assignments");
    console.log("Request body:");
    console.log(req.file);
    console.log("filename",req.file.filename);
    let filename = req.file.filename;
    var queryResult = [];
   
      const addAssignments = async () => {
        let inputData = {
            "course_id" : req.body.courseID, 
            "file_name" : filename
        }
        queryResult = await ccBasicDao.createNewUser("course_file",inputData);
        if(queryResult.id){
            console.log("file added");
            res.status(200).json({responseMessage: 'File successfully uploaded!'});
        }
        else{
          res.status(400).json({responseMessage: 'Record not found'});
        }
      }
      try{
        addAssignments();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });

  router.get('/files',function(req,res){
    console.log("Inside get files");
    console.log("Request params:");
    console.log(req.query);
    let courseID = req.query.courseID;
    var queryResult = [];
      const getCourseFiles = async () => {
        queryResult = await courseFilesDao.getCourseFiles(courseID);
        if(queryResult[0]){
            console.log("Data Found!");
            res.status(200).json(queryResult);
        }
        else{
          res.status(400).json({responseMessage: 'Record not found'});
        }
      }
      try{
        getCourseFiles();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });


  router.get('/file/base64str',function(req,res){
    console.log("Inside get file base64");
    console.log("Request params:");
    console.log(req.query);
    let fileName = req.query.fileName;
    let isAssignment = req.query.isAssignment;
    console.log(fileName);
    function base64_encode(file) {
            var bitmap = fs.readFileSync(file);
            return new Buffer(bitmap).toString('base64');
        }
    try{
      let filePath = null;
      if(isAssignment){
        filePath = "C:/Users/akhila/Documents/sjsu/sem1/273/lab2/Canvas/server/uploads/assignmentsubmissions/"+fileName;
      }
      else{
        filePath = "C:/Users/akhila/Documents/sjsu/sem1/273/lab2/Canvas/server/uploads/courseFiles/"+fileName;
      }
       
        var base64str = base64_encode(filePath);
        console.log(base64str);
        res.status(200).json({base64str : base64str});
    }catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });

module.exports = router;