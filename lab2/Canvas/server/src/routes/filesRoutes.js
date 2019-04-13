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
    callback(null, './uploads/coursefiles');
  },
  filename: (req, file, callback) => {
    fileExtension = file.originalname.split('.')[1];
    console.log("fileExtension", fileExtension);
    callback(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + fileExtension);
  },
});

var upload = multer({ storage: storage });

router.post('/files/upload', upload.single('selectedFile'), requireAuth, function (req, res) {
  console.log("Inside post assignments");
  console.log("Request body:");
  console.log(req.body);
  console.log("filename", req.file.filename);
  let filename = req.file.filename;
  kafka.make_request('file_topics', { "path": "upload_file", "body": req.body, "filename": filename }, function (err, result) {
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


router.get('/files', requireAuth, function (req, res) {
  console.log("Inside get files");
  console.log("Request params:");
  console.log(req.query);

  kafka.make_request('file_topics',{"path":"get_files", "body": req.query}, function(err,result){
    if (err) {
      console.log(err);
      res.status(500).json({ responseMessage: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("Results found");
      res.status(200).json(result.files);
    } else if (result.status === 204){
      console.log("No results found");
      res.status(200).json({ responseMessage: 'No results found!' });
    }
  });
});


router.get('/file/base64str', function (req, res) {
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
    var filePath = path.join(__dirname + '../../../uploads/coursefiles',fileName);
    var base64str = base64_encode(filePath);
    console.log(base64str);
    res.status(200).json({ base64str: base64str });
  } catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});

module.exports = router;