const express = require('express');
const router = express.Router();
const QuizDao = require("../dao/daoForQuizRoutes");
const quizDao = new QuizDao();
const QuizBasicDao = require("../dao/daoForLoginSignupRoutes");
const qBasicDao = new QuizBasicDao();

router.post('/quiz',function(req,res){
    console.log("Inside post quiz");
    console.log("Request body:");
    console.log(req.body);
    var queryResult = [];
   
      const addQuiz = async () => {
        let inputData = {
            "course_id" : req.body.courseID, 
            "title": req.body.title,
            "points":req.body.points
        }
        queryResult = await qBasicDao.createNewUser("quiz",inputData);
        if(queryResult){
          if(queryResult.id != null){
            console.log("Quiz added");
            res.status(200).json({responseMessage: 'Successfully added Quiz!'});
          }
        }
        else{
          res.status(400).json({responseMessage: 'Record not found'});
        }
      }
      try{
        addQuiz();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });

  router.get('/quiz',function(req,res){
    console.log("Inside get quizzes");
    console.log("Request params:");
    console.log(req.query);
    let courseID = req.query.courseID;
    let facultyID = req.query.facultyID;
    var queryResult = [];
      const getQuizzes = async () => {
        queryResult = await quizDao.getQuizzes(courseID,facultyID);
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
        getQuizzes();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });

  router.post('/question',function(req,res){
    console.log("Inside post quiz");
    console.log("Request body:");
    console.log(req.body);
    var queryResult = [];
   
      const addQuiz = async () => {
        let inputData = {
            "quiz_id" : req.body.quizID, 
            "question": req.body.question,
            "optA":req.body.optA,
            "optB":req.body.optB,
            "optC":req.body.optC,
            "answer":req.body.answer
        }
        queryResult = await qBasicDao.createNewUser("question",inputData);
        if(queryResult){
          if(queryResult.id != null){
            console.log("Question added");
            res.status(200).json({responseMessage: 'Successfully added Question!'});
          }
        }
        else{
          res.status(400).json({responseMessage: 'Record not found'});
        }
      }
      try{
        addQuiz();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });


  router.put('/quiz',function(req,res){
    console.log("Inside get quizzes");
    console.log("Request params:");
    console.log(req.query);
    let quizID = req.query.quizID;
    var queryResult = [];
      const updatePublishStatus = async () => {
        queryResult = await quizDao.updatePublishStatus(quizID);
        if(queryResult){
            console.log("Sucessfully updated!");
            res.status(200).json({responseMessage:'Sucessfully updated!'});
        }
        else{
          res.status(400).json({responseMessage: 'Record not found'});
        }
      }
      try{
        updatePublishStatus();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });

  router.get('/student/quiz',function(req,res){
    console.log("Inside get quizzes for a student");
    console.log("Request params:");
    console.log(req.query);
    let courseID = req.query.courseID;
    var queryResult = [];
      const getQuizzes = async () => {
        queryResult = await quizDao.getQuizzesForAStudent(courseID);
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
        getQuizzes();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });

  router.get('/student/quiz/questions',function(req,res){
    console.log("Inside get quiz questions for a student");
    console.log("Request params:");
    console.log(req.query);
    let quizID = req.query.quizID;
    var queryResult = [];
      const getQuizzes = async () => {
        queryResult = await quizDao.getQuizQuestionsForAStudent(quizID);
        if(queryResult[0]){
          if(queryResult[0].id!= null){
            console.log("Data Found!");
            res.status(200).json(queryResult);
          }
        }
        else{
          res.status(400).json({responseMessage: 'Record not found'});
        }
      }
      try{
        getQuizzes();
      }
      catch(err){
        console.log(err);
        res.status(500).json({responseMessage: 'Database not responding'});
      }
  });
module.exports = router;