const express = require('express');
const router = express.Router();
const AnnouncementAssignmentDao = require("../dao/daoForAnnouncementsAssignments");
const announcementAssignmentDao = new AnnouncementAssignmentDao();
const AnnouncementAssignmentBasicDao = require("../dao/daoForLoginSignupRoutes");
const aaBasicDao = new AnnouncementAssignmentBasicDao();
var fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/assignmentsubmissions');
  },
  filename: (req, file, callback) => {
    fileExtension = file.originalname.split('.')[1];
    console.log("fileExtension",fileExtension);
    callback(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + fileExtension);
  },
});

var upload = multer({ storage : storage });


router.get('/announcements',function(req,res){
    console.log("Inside get announcements");
    console.log("Request params:");
    console.log(req.query);
    let courseID = req.query.courseID;
    var queryResult = [];
      const getAnnouncements = async () => {
        queryResult = await announcementAssignmentDao.getAnnouncements(courseID);
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

  router.get('/faculty/announcements',function(req,res){
    console.log("Inside get announcements");
    console.log("Request params:");
    console.log(req.query);
    let courseID = req.query.courseID;
    let facultyID = req.query.facultyID;
    var queryResult = [];
      const getAnnouncements = async () => {
        queryResult = await announcementAssignmentDao.getAnnouncementsByFaculty(courseID,facultyID);
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
            "desc" : req.body.announcement,
            "title": req.body.title
        }
        queryResult = await aaBasicDao.createNewUser("announcement",inputData);
        if(queryResult){
          if(queryResult.id != null){
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

  router.post('/assignments/upload',upload.single('selectedFile'),function(req,res){
    console.log("Inside post assignments");
    console.log("Request body:");
    console.log(req.file);
    console.log("filename",req.file.filename);
    let filename = req.file.filename;
    var queryResult = [];
   
      const addAssignments = async () => {
        let inputData = {
            "course_id" : req.body.courseID, 
            "student_id" : req.body.studentID,
            "assignment_id" : req.body.assignmentID,
            "comments" : req.body.comments,
            "file_name" : filename
        }
        queryResult = await aaBasicDao.createNewUser("assignment_submission",inputData);
        if(queryResult.id){
            console.log("assignment added");
            res.status(200).json({responseMessage: 'Successfully added Assignment!'});
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

  router.post('/assignments',function(req,res){
    console.log("Inside post announcements");
    console.log("Request body:");
    console.log(req.body);
    var queryResult = [];
   
      const addAssignments = async () => {
        let inputData = {
            "course_id" : req.body.courseID, 
            "desc" : req.body.desc,
            "title" : req.body.title
        }
        queryResult = await aaBasicDao.createNewUser("assignment",inputData);
        if(queryResult.id){
            console.log("assignment added");
            res.status(200).json({responseMessage: 'Successfully added Assignment!'});
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


  router.get('/assignments',function(req,res){
    console.log("Inside get assignments");
    console.log("Request params:");
    console.log(req.query);
    let courseID = req.query.courseID;
    let facultyID = req.query.facultyID;
    var queryResult = [];
      const getAssignments = async () => {
        queryResult = await announcementAssignmentDao.getAssignments(courseID,facultyID);
        if(queryResult[0]){
          if(queryResult[0].title != null){
            console.log("Data Found!");
            res.status(200).json(queryResult);
          }
        }
        else{
          res.status(400).json({responseMessage: 'Record not found'});
        }
      }
      try{
        getAssignments();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });


  router.get('/assignmentSubmissions',function(req,res){
    console.log("Inside get assignment submissions");
    console.log("Request params:");
    console.log(req.query);
    let courseID = req.query.courseID;
    var queryResult = [];
      const getAssignmentSubmissions = async () => {
        queryResult = await announcementAssignmentDao.getAssignmentSubmissions(courseID);
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
        getAssignmentSubmissions();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });

  router.get('/myassignmentSubmissions',function(req,res){
    console.log("Inside get assignment submissions");
    console.log("Request params:");
    console.log(req.query);
    let courseID = req.query.courseID;
    let studentID = req.query.studentID;
    let assignmentID = req.query.assignmentID;
    var queryResult = [];
      const getAssignmentSubmissions = async () => {
        queryResult = await announcementAssignmentDao.getMyAssignmentSubmissions(courseID,studentID,assignmentID);
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
        getAssignmentSubmissions();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });


  router.get('/assignmentSubmissionfile',function(req,res){
    console.log("Inside get assignment submissions");
    console.log("Request params:");
    console.log(req.query);
    let submissionID = req.query.submissionID;
    var queryResult = [];
      const getAssignmentSubmissionFile = async () => {
        queryResult = await announcementAssignmentDao.getAssignmentSubmissionFile(submissionID);
        if(queryResult[0]){
          console.log("file name:"+queryResult[0].file_name);
          fileName = queryResult[0].file_name;
          function base64_encode(file) {
            var bitmap = fs.readFileSync(file);
            return new Buffer(bitmap).toString('base64');
        }
        let pdfPath = "C:/Users/akhila/Documents/sjsu/sem1/273/lab2/Canvas/server/uploads/assignmentsubmissions/"+fileName;
        var base64str = base64_encode(pdfPath);
        console.log("base64str of pdf sent");
        res.status(200).json({base64str : base64str, marks: queryResult[0].marks});
        }
        else{
          res.status(400).json({responseMessage: 'Record not found'});
        }
      }
      try{
        getAssignmentSubmissionFile();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });


  router.get('/myassignments',function(req,res){
    console.log("Inside get my assignments");
    console.log("Request params:");
    console.log(req.query);
    let courseID = req.query.courseID;
    var queryResult = [];
      const getAssignments = async () => {
        queryResult = await announcementAssignmentDao.getAssignmentsofStudents(courseID);
        if(queryResult[0]){
          if(queryResult[0].title != null){
            console.log("Data Found!");
            res.status(200).json(queryResult);
          }
        }
        else{
          res.status(400).json({responseMessage: 'Record not found'});
        }
      }
      try{
        getAssignments();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });

  router.get('/pdf',function(req,res){
    function base64_encode(file) {
      // read binary data
      var bitmap = fs.readFileSync(file);
      // convert binary data to base64 encoded string
      return new Buffer(bitmap).toString('base64');
  }
  let pdfPath = "C:/Users/akhila/Documents/sjsu/sem1/273/lab2/Canvas/server/uploads/file.pdf";
  var base64str = base64_encode(pdfPath);
  console.log(base64str);
  res.status(200).json({base64str : base64str});
  });


  router.put('/assignments/marks',function(req,res){
    console.log("Inside get assignments");
    console.log("Request params:");
    console.log(req.query);
    let submissionID = req.query.submissionID;
    let marks = req.query.marks;
    var queryResult = [];
      const updateMarks = async () => {
        queryResult = await announcementAssignmentDao.updateMarks(submissionID,marks);
        if(queryResult){
            console.log("Marks Updated!");
            res.status(200).json({responseMessage: "Marks Updated!"});
        }
        else{
          res.status(400).json({responseMessage: 'Record not found'});
        }
      }
      try{
        updateMarks();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });
  

module.exports = router;