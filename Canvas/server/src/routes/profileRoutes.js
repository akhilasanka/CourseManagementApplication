
const express = require('express');
const router = express.Router();
const ProfileDao = require("../dao/daoForLoginSignupRoutes");
const profileDao = new ProfileDao();
var fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/profilepics');
  },
  filename: (req, file, callback) => {
    fileExtension = file.originalname.split('.')[1];
    console.log("fileExtension", fileExtension);
    callback(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + fileExtension);
  },
});

var upload = multer({ storage: storage });

router.get('/profile', function (req, res) {
  console.log("Inside profile get request");
  console.log("Request params:");
  console.log(req.query);
  let studentID = req.query.id;
  var queryResult = [];
  const getProfileData = async () => {
    queryResult = await profileDao.checkIfUserExists(req.query.table, studentID);
    if (queryResult[0]) {
      if (queryResult[0].email != null) {
        console.log("Data Found!");
        let obj = queryResult[0];
        delete obj['password'];
        Object.keys(obj).forEach(k => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
        res.status(200).json(obj);
      }
    }
    else {
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    getProfileData();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});




router.post('/profile', function (req, res) {
  console.log("Inside profile put request");
  console.log("Request Body:");
  console.log(req.body);
  let studentID = req.body.id;
  let table = req.body.table;
  var queryResult = [];
  var inputData = {
    "name": req.body.name,
    "img": req.body.img,
    "phonenumber": req.body.phoneNumber,
    "country": req.body.country,
    "school": req.body.school,
    "hometown": req.body.hometown,
    "languages": req.body.languages,
    "gender": req.body.gender,
  }
  const getProfileData = async () => {
    queryResult = await profileDao.updateUser(table, studentID, inputData);
    if (queryResult) {
      console.log("Data updated!");
      res.status(200).json(queryResult);
    }
    else {
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    getProfileData();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});


router.post('/img/upload', upload.single('selectedFile'), function (req, res) {
  console.log("Inside post profile img");
  console.log("Request body:");
  console.log(req.body);
  console.log("filename", req.file.filename);
  let filename = req.file.filename;
  var queryResult = [];

  let id = req.body.id;
  let role = req.body.role;
  const addProfilePic = async () => {
    queryResult = await profileDao.addProfilePic(role, id, filename);
    if (queryResult) {
      console.log("pic added");
      res.status(200).json({ responseMessage: 'File successfully uploaded!' });
    }
    else {
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    addProfilePic();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});

router.get('/profile/img', function (req, res) {
  console.log("Inside profile get request");
  console.log("Request params:");
  console.log(req.query);
  let id = req.query.id;
  let role = req.query.role;
  var queryResult = [];
  let filename = '';
  const getProfilepic = async () => {
    queryResult = await profileDao.getProfilepic(role, id);
    console.log(queryResult);
    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return new Buffer(bitmap).toString('base64');
    }
    if (queryResult[0]) {
      filename = queryResult[0].img;
      console.log(filename);
      let filePath = "C:/Users/akhila/Documents/sjsu/sem1/273/lab1/CMPE273-SP19-60/Canvas/server/uploads/profilepics/" + filename;
        var base64str = base64_encode(filePath);
        console.log(base64str);
        res.status(200).json({ base64str: base64str });
    }
    else {
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    getProfilepic();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});

module.exports = router;