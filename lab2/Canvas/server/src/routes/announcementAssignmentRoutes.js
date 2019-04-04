//imports
const express = require('express');
const router = express.Router();
var fs = require('fs');
const multer = require('multer');
var passport = require('passport');
var kafka = require('../kafka/client');
const path = require('path');

//middleware
var requireAuth = passport.authenticate('jwt', { session: false });

//multer storage
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

router.get('/announcements', requireAuth, function(req,res){
  console.log("Inside get announcements");
  console.log("Request params:");
  console.log(req.query);
  kafka.make_request('announcement_topics', { "path": "get_announcements", "body": req.query }, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200) {
      console.log("Results found");
      res.status(200).json(result.announcements);
    } else if (result.status === 204) {
      console.log("No results found");
      res.status(204).json({ responseMessage: 'No results found' });
    }
  });
});

  router.post('/announcements', requireAuth, function(req,res){
    console.log("Inside post announcements");
    console.log("Request body:");
    console.log(req.body);
    kafka.make_request('announcement_topics', { "path": "create_announcement", "body": req.body }, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200) {
        console.log("Added file");
        res.status(200).json({ responseMessage: 'Successfully Published!' });
      } else if (result.status === 400) {
        console.log("No results found to update");
        res.status(400).json({ responseMessage: 'No results found to update' });
      }
    });
  });

  router.post('/assignments/upload',upload.single('selectedFile'), requireAuth, function(req,res){
    console.log("Inside post assignments");
    console.log("Request body:");
    console.log(req.file);
    console.log("filename",req.file.filename);
    let filename = req.file.filename;
    kafka.make_request('assignment_topics', { "path": "submit_assignment", "body": req.body, "filename": filename }, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200) {
        console.log("Added submission file");
        res.status(200).json({ responseMessage: 'Successfully Submiteed!' });
      } else if (result.status === 400) {
        console.log("No results found to update");
        res.status(400).json({ responseMessage: 'Submission failed. Please try again after sometime' });
      }
    });
  });

  router.post('/assignments', requireAuth, function(req,res){
    console.log("Inside post announcements");
    console.log("Request body:");
    console.log(req.body);
    kafka.make_request('assignment_topics', { "path": "create_assignment", "body": req.body }, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200) {
        console.log("Added file");
        res.status(200).json({ responseMessage: 'Successfully Saved!' });
      } else if (result.status === 400) {
        console.log("No results found to update");
        res.status(400).json({ responseMessage: 'No results found to update' });
      }
    });

  });

  router.get('/assignments', requireAuth, function(req,res){
    console.log("Inside get assignments");
    console.log("Request params:");
    console.log(req.query);
    kafka.make_request('assignment_topics', { "path": "get_assignments", "body": req.query }, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200) {
        console.log("Results found");
        res.status(200).json(result.assignments);
      } else if (result.status === 204) {
        console.log("No results found");
        res.status(204).json({ responseMessage: 'No results found' });
      }
    });
  });

  router.get('/assignmentSubmissions', requireAuth, function(req,res){
    console.log("Inside get assignmentSubmissions");
    console.log("Request params:");
    console.log(req.query);
    kafka.make_request('assignment_topics', { "path": "get_assignmentsubmissions", "body": req.query }, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200) {
        console.log("Results found");
        res.status(200).json(result.assignmentsubmissions);
      } else if (result.status === 204) {
        console.log("No results found");
        res.status(204).json({ responseMessage: 'No results found' });
      }
    });
  });

  router.get('/student/assignmentSubmissions', requireAuth, function(req,res){
    console.log("Inside get student assignment submissions");
    console.log("Request params:");
    console.log(req.query);
    kafka.make_request('assignment_topics', { "path": "get_student_assignmentsubmissions", "body": req.query }, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200) {
        console.log("Results found");
        res.status(200).json(result.assignmentsubmissions);
      } else if (result.status === 204) {
        console.log("No results found");
        res.status(204).json({ responseMessage: 'No results found' });
      }
    });
  });

  router.get('/assignmentsubmission/details', requireAuth, function(req,res){
    console.log("Inside get assignment submission details");
    console.log("Request params:");
    console.log(req.query);
    kafka.make_request('assignment_topics', { "path": "get_assignmentsubmission_details", "body": req.query }, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200) {
        console.log("Results found");
        function base64_encode(file) {
          var bitmap = fs.readFileSync(file);
          return new Buffer(bitmap).toString('base64');
      }
      let fileName = result.submissionDetails.file_name;
      let pdfPath = path.join(__dirname + '../../../uploads/assignmentsubmissions',fileName);
      var base64str = base64_encode(pdfPath);
      console.log("base64str of pdf sent");
      res.status(200).json({base64str : base64str, marks: result.submissionDetails.marks});
      } else if (result.status === 204) {
        console.log("No results found");
        res.status(204).json({ responseMessage: 'No results found' });
      }
    });
  });

  router.put('/assignmentsubmission/marks', requireAuth, function(req,res){
    console.log("Inside get assignments");
    console.log("Request params:");
    console.log(req.query);
    kafka.make_request('assignment_topics', { "path": "update_assignment_marks", "body": req.query }, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200) {
        console.log("Results found");
        res.status(200).json({ responseMessage: 'Successfully Updated' });
      } else if (result.status === 204) {
        console.log("No results found");
        res.status(204).json({ responseMessage: 'No results found' });
      }
    });
  });
  
  router.get('/assignmentsubmission/file/base64str', requireAuth, function (req, res) {
    console.log("Inside get file base64");
    console.log("Request params:");
    console.log(req.query);
    let fileName = req.query.fileName;
    console.log(fileName);
    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return new Buffer(bitmap).toString('base64');
    }
    try {
      var filePath = path.join(__dirname + '../../../uploads/assignmentsubmissions',fileName);
      var base64str = base64_encode(filePath);
      console.log(base64str);
      res.status(200).json({ base64str: base64str });
    } catch (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
  });

module.exports = router;