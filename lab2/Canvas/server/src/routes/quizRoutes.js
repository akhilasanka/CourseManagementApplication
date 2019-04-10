//imports
const express = require('express');
const router = express.Router();
var passport = require('passport');
var kafka = require('../kafka/client');

//middleware
var requireAuth = passport.authenticate('jwt', { session: false });

//done
router.post('/quiz', requireAuth, function(req,res){
  console.log("Inside post quiz");
  console.log("Request body:");
  console.log(req.body);
  kafka.make_request('quiz_topics', { "path": "create_quiz", "body": req.body }, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200) {
      console.log("Added quiz");
      res.status(200).json({ responseMessage: 'Quiz successfully added!' });
    } else if (result.status === 400) {
      console.log("Failed to create quiz");
      res.status(400).json({ responseMessage: 'Unable to create quiz. Please try again!' });
    }
  });
});

//done
router.get('/quiz', requireAuth, function(req,res){
  console.log("Inside get quizzes");
  console.log("Request params:");
  console.log(req.query);
  kafka.make_request('quiz_topics', { "path": "get_quizzes", "body": req.query }, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200) {
      console.log("Results found");
      res.status(200).json(result.quizzes);
    } else if (result.status === 204) {
      console.log("No results found");
      res.status(204).json({ responseMessage: 'No results found' });
    }
  });
});

//done
 router.post('/question', requireAuth, function(req,res){
  console.log("Inside post question");
  console.log("Request body:");
  console.log(req.body);
  kafka.make_request('quiz_topics', { "path": "create_question", "body": req.body }, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200) {
      console.log("saved question");
      res.status(200).json({ responseMessage: 'Question successfully saved!' });
    } else if (result.status === 400) {
      console.log("Failed to create question");
      res.status(400).json({ responseMessage: 'Unable to create question. Please try again!' });
    }
  });
});

//done
router.get('/question', requireAuth, function(req,res){
  console.log("Inside get question");
  console.log("Request params:");
  console.log(req.query);
  kafka.make_request('quiz_topics', { "path": "get_question", "body": req.query }, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200) {
      console.log("Results found");
      res.status(200).json(result.question);
      console.log(result.question);
    } else if (result.status === 204) {
      console.log("No results found");
      res.status(204).json({ responseMessage: 'No results found' });
    }
  });
});

//done
router.put('/quiz', requireAuth, function(req,res){
  console.log("Inside get quizzes");
  console.log("Request params:");
  console.log(req.query);
  kafka.make_request('quiz_topics', { "path": "publish_quiz", "body": req.query }, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200) {
      console.log("Published Quiz");
      res.status(200).json({ responseMessage: 'Published Quiz sucessfully' });
    } else if (result.status === 400) {
      console.log("Unable to update data");
      res.status(400).json({ responseMessage: 'Unable to update database' });
    }
  });
});

//done
router.get('/student/quiz', requireAuth, function(req,res){
  console.log("Inside get quizzes for a student");
  console.log("Request params:");
  console.log(req.query);
  kafka.make_request('quiz_topics', { "path": "get_published_quizzes", "body": req.query }, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200) {
      console.log("Results found");
      res.status(200).json(result.quizzes);
    } else if (result.status === 204) {
      console.log("No results found");
      res.status(204).json({ responseMessage: 'No results found' });
    }
  });
});

router.get('/student/quiz/questions', requireAuth, function(req,res){
  console.log("Inside get quiz questions for a student");
  console.log("Request params:");
  console.log(req.query);
  kafka.make_request('quiz_topics', { "path": "get_quiz_questions", "body": req.query }, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200) {
      console.log("Results found");
      res.status(200).json(result.questions);
    } else if (result.status === 204) {
      console.log("No results found");
      res.status(204).json({ responseMessage: 'No results found' });
    }
  });
});

router.put('/student/quiz/grade', requireAuth, function(req,res){
  console.log("Inside set quiz grade");
  console.log("Request params:");
  console.log(req.query);
  kafka.make_request('quiz_topics', { "path": "grade_quiz", "body": req.query }, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200) {
      console.log("Published Quiz");
      res.status(200).json({ responseMessage: 'Graded Quiz sucessfully' });
    } else if (result.status === 400) {
      console.log("Unable to update data");
      res.status(400).json({ responseMessage: 'Unable to update database' });
    }
  });
});

module.exports = router;