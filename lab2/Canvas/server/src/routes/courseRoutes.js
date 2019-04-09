//imports
const express = require('express');
const router = express.Router();
var kafka = require('../kafka/client');

// Set up middleware
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});


router.post('/course/new', requireAuth, function (req, res) {
  console.log("Inside course post request");
  console.log("Request Body:");
  console.log(req.body);
  kafka.make_request('course_topics',{"path":"new_course", "body": req.body}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Course Added");
      res.status(200).json({ responseMessage: 'Successfully Added!' });
    } else if (result.status === 401){
      console.log("User already exists");
      res.status(200).json({ responseMessage: 'Course Already exists!' });
    }
  });
});


router.get('/course/search', requireAuth, function (req, res) {
  console.log("Inside get /course/search");
  console.log("Request params:");
  console.log(req.query);

  kafka.make_request('course_topics',{"path":"search_course", "body":req.query}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Results found");
      res.status(200).json(result.courses);
    } else if (result.status === 401){
      console.log("No results found");
      res.status(200).json({ dataFound: false });
    }
  });

});


  router.put('/generateWaitlistCode', function (req, res) {
    console.log("Inside put waitlist code");
    console.log("Request params:");
    console.log(req.query);

  kafka.make_request('course_topics',{"path":"waitlist_code", "body":req.query}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Results found");
      res.status(200).json({ responseMessage: "Sucessfully updated" });
    } else{
      res.status(400).json({ responseMessage: "bad request" });
    }
  });

  });  


router.get('/waitlistStudents', requireAuth, function (req, res) {
  console.log("Inside get /waitlistStudents");
  console.log("Request params:");
  console.log(req.query);

  kafka.make_request('course_topics',{"path":"waitlisted_students_course", "body":req.query}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Results found");
      res.status(200).json(result.students);
    } else if (result.status === 205){
      console.log("No results found");
      res.status(200).json({ dataFound: false });
    }
  });

});



router.post('/student/enroll', requireAuth, function (req, res) {
  console.log("Inside course post request");
  console.log("Request Body:");
  console.log(req.body);
  kafka.make_request('course_topics',{"path":"enroll_course", "body": req.body}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Succesfully Registered");
      res.status(200).json({ responseMessage: 'Succesfully Registered!' });
    } else if (result.status === 205){
      console.log("Student already resgistered");
      res.status(200).json({ responseMessage: 'You are already added to the course. Visit mycourses page.' });
    }
  });
});


router.delete('/student/course/delete', function (req, res) {
  console.log("Inside delete student/course/delete");
  console.log("Request params:");
  console.log(req.query);
  kafka.make_request('course_topics',{"path":"delete_course", "body": req.query}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Succesfully deleted");
      res.status(200).json({ responseMessage: 'Droped course : '+req.query.courseID+' successfully!!' });
    } else if (result.status === 400){
      console.log("Student already enrolled");
      res.status(400).json({ responseMessage: 'unable to delete record' });
    }
  });

});


router.get('/student/home', function (req, res) {
  console.log(req.query);

  kafka.make_request('course_topics',{"path":"student_course", "body":req.query}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Results found");
      console.log(result);
      res.status(200).json({ courses : result.courses});
      console.log(result.courses);
    } else if (result.status === 205){
      console.log("No results found");
      res.status(200).json({ responseMessage: 'No courses found' });
    }
  });

});

router.get('/faculty/home', function (req, res) {
  console.log(req.query);

  kafka.make_request('course_topics',{"path":"faculty_course", "body":req.query}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Results found");
      var i;
      for (i = 0; i < result.courses.length; i++) {
        result.courses[i].course_id = result.courses[i]['id'];
        delete result.courses[i].id;
      }
      console.log( result.courses);
      res.status(200).json({ courses : result.courses});
    } else if (result.status === 205){
      console.log("No results found");
      res.status(200).json({ responseMessage: 'No courses found' });
    }
  });

});


router.get('/course/students', requireAuth, function (req, res) {
  console.log("Inside get /course/students");
  console.log("Request params:");
  console.log(req.query);

  kafka.make_request('course_topics',{"path":"students_course", "body":req.query}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Results found");
      res.status(200).json(result.students);
    } else if (result.status === 205){
      console.log("No results found");
      res.status(200).json({ dataFound: false });
    }
  });

});

router.get('/student/grades',  requireAuth, function (req, res) {
  console.log(req.query);

  kafka.make_request('course_topics', {"path":"student_grades", "body":req.query}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Results found");
      console.log(result);
      res.status(200).json({ grades : result.grades});
      console.log(result.grades);
    } else if (result.status === 205){
      console.log("No results found");
      res.status(200).json({ responseMessage: 'No grades found' });
    }
  });

});


module.exports = router;
