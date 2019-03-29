const express = require('express');
const router = express.Router();
const CourseRoutesDao = require("../dao/daoForCourseRoutes");
const courseDao = new CourseRoutesDao();
const CourseRoutesBasic = require("../dao/daoForLoginSignupRoutes");
const courseDaoBasic = new CourseRoutesBasic();
const sha1 = require('sha1');

// Set up middleware
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});

router.post('/course/new', function (req, res) {
  console.log("Inside course post request");
  console.log("Request Body:");
  console.log(req.body);
  let id = req.body.id;
  var queryResult = [];
  const createCourseIfNotPresent = async () => {
    queryResult = await courseDaoBasic.checkIfUserExists("course", id);
    if (queryResult[0]) {
      if (queryResult[0].id != null) {
        console.log("Course already exists!");
        res.status(200).json({ responseMessage: 'Course already exists!' });
      }
    }
    else {
      var inputData = {
        "id": req.body.id,
        "name": req.body.name,
        "dept": req.body.dept,
        "description": req.body.description,
        "room": req.body.room,
        "capacity": req.body.capacity,
        "waitlistCapacity": req.body.waitlistCapacity,
        "courseTerm": req.body.courseTerm,
        "faculty_id": req.body.faculty_id
      }
      queryResult = await courseDaoBasic.createNewUser("course", inputData);
      console.log("Course Added");
      res.status(200).json({ responseMessage: 'Successfully Added!' });
    }
  }

  try {
    createCourseIfNotPresent();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});



router.get('/generateWaitlistCode', function (req, res) {
  console.log("Inside grenate waitlist code");
  console.log("Request params:");
  console.log(req.query);
  let studentID = req.query.studentID;
  let courseID = req.query.courseID;
  let inputKey = courseID + studentID;
  let permissionCode = sha1(inputKey);
  console.log(permissionCode);
  res.status(200).json({ responseMessage: permissionCode });
});


router.put('/waitlistCode', function (req, res) {
  console.log("Inside put waitlist code");
  console.log("Request params:");

  let records = req.query.records;
  console.log(records);
  var recordsJson = records.map(JSON.parse);
  console.log(recordsJson);
  var isRecordSetUpdated = true;
  updateRecords = (sendStatus) => {
    const updateWaitlistCode = async (student_id, course_id, waitlistCode) => {

      queryResult = await courseDao.updateWaitlistCode(student_id, course_id, waitlistCode);
      console.log(queryResult);
      let record = "record: studentid " + student_id + " courseid " + course_id + " waitlistcode " + waitlistCode;
      if (queryResult) {
        console.log(record);
        console.log("Record updated");
      }
      else {
        isRecordSetUpdated = false;
      }
    }

    for (var key in recordsJson) {
      if (recordsJson.hasOwnProperty(key)) {
        // here you have access to
        var student_id = recordsJson[key].studentID;
        var course_id = recordsJson[key].courseID;
        var waitlistCode = recordsJson[key].waitListCode;
        console.log("Record: studentID:" + student_id + " CourseID:" + course_id + " waitlistCode:" + waitlistCode);
        try {
          console.log("Updating records");
          updateWaitlistCode(student_id, course_id, waitlistCode);
        }
        catch (err) {
          console.log(err);
        }
      }

    }
    sendStatus();
  }

  updateRecords(() => {
    if (isRecordSetUpdated) {
      console.log("sending response");
      res.status(200).json({ responseMessage: "Code(s) sucessfully sent to students" });
    }
    else {
      res.status(200).json({ responseMessage: "Not all records were updated. Please verify and send again" });
    }

  });


});

router.get('/waitlistStudents', function (req, res) {
  console.log("Inside get waitlist students");
  console.log("Request params:");
  console.log(req.query);
  let facultyID = req.query.facultyID;
  var queryResult = [];
  const getWaitlistStudents = async () => {
    queryResult = await courseDao.getWaitlistStudents(facultyID);
    console.log(queryResult);
    if (queryResult[0]) {
      if (queryResult[0].waitlistCapacity > 0) {
        console.log("Data Found!");
        res.status(200).json(queryResult);
      }
    }
    else {
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    getWaitlistStudents();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});

router.get('/course/search', function (req, res) {
  console.log("Inside get /course/search");
  console.log("Request params:");
  console.log(req.query);
  let courseID = req.query.course_id;
  let dept = req.query.dept;
  let operation = req.query.operation;
  let term = req.query.term;
  let base_query = `SELECT c.id, c.name, c.dept, c.courseTerm, f.name AS faculty_name, c.capacity, c.currentEnrolledStudents, c.waitlistCapacity, c.currentwaitlistStudents FROM course AS c LEFT JOIN faculty AS f ON c.faculty_id = f.id WHERE `;
  let where_query = ``;

  if (courseID) {
    console.log("inside courseID");
    where_query = where_query + `c.id ` + operation + ` "` + courseID + `"`;
    if (dept) {
      where_query = where_query + ` AND c.dept = "` + dept + `"`;
    }
    if (term) {
      where_query = where_query + ` AND c.courseTerm = "` + term + `"`;
    }
  } else if (dept) {
    where_query = where_query + `c.dept = "` + dept + `"`;
    if (term) {
      where_query = where_query + ` AND c.courseTerm = "` + term + `"`;
    }
  } else {
    where_query = where_query + `c.courseTerm = "` + term + `"`;
  }
  let query = base_query + where_query + ` ORDER BY c.id`;
  console.log(query);
  var queryResult = [];
  const getCourses = async () => {
    queryResult = await courseDao.searchCourses(query);
    console.log(queryResult);
    if (queryResult[0]) {
      if (queryResult[0].id != null) {
        console.log("Data Found!");
        res.status(200).json(queryResult);
      }
    }
    else {
      res.status(200).json({ dataFound: false });
    }
  }
  try {
    getCourses();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});


router.post('/student/enroll', function (req, res) {
  console.log("Inside post student/enroll");
  console.log("Request body:");
  console.log(req.body);
  let courseID = req.body.courseID;
  let studentID = req.body.studentID;
  let status = req.body.status;
  var queryResult = [];

  const updateCurrentStudentsCount = async () => {
    queryResult = await courseDao.updateCurrentStudentsCount(courseID,'+');
    if(queryResult){
      console.log("Updated count sucessfully");
    }
  }
  const enrollCourse = async () => {
    queryResult = await courseDao.checkIfStudentIsRegistered("studentenrollment", courseID, studentID);
    if (queryResult[0]) {
      res.status(200).json({ responseMessage: 'You are already added to the course. Visit mycourses page.' });
    }
    else {
      var inputData = {
        "course_id": courseID,
        "student_id": studentID,
        "status": status
      }
      queryResult = await courseDaoBasic.createNewUser("studentenrollment", inputData);
      if (queryResult) {
        if (queryResult.id != null) {
          console.log("Course resgistered");
          res.status(200).json({ responseMessage: 'Successfully Registered!' });
        }
        if(status == 'E'){
          updateCurrentStudentsCount(courseID,studentID);
        }
      }
      else {
        res.status(400).json({ responseMessage: 'Record not found' });
      }
    }
  }
  try {
    enrollCourse();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});

router.get('/student/course/details', function (req, res) {
  console.log("Inside get /student/course/details");
  console.log("Request params:");
  console.log(req.query);
  let queryResult = [];
  let studentID = req.query.id;
  const getStudentDetails = async () => {
    queryResult = await courseDao.getStudentCourseDetails(studentID);
    if (queryResult) {
      console.log("Data sent");
      res.status(200).json(queryResult);
    }
    else {
      console.log("Unable to get data");
      res.status(400).json({ responseMessage: 'unable to get student course details' });
    }

  }
  try {
    getStudentDetails();
    
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});


router.delete('/student/course/delete', function (req, res) {
  console.log("Inside delete student/course/delete");
  console.log("Request params:");
  console.log(req.query);
  var queryResult = [];
  var courseID = req.query.courseID;
  var studentID = req.query.studentID;

  const updateCurrentStudentsCount = async () => {
    queryResult = await courseDao.updateCurrentStudentsCount(courseID,'-');
    if(queryResult){
      console.log("Updated count sucessfully");
    }
  }

  const deleteStudentEnrollment = async () => {
    queryResult = await courseDao.deleteStudentEnrollmentRecord("studentenrollment", courseID, studentID);
    
    if (queryResult) {
      updateCurrentStudentsCount(courseID,studentID);
      res.status(200).json({ responseMessage: 'Droped course : '+courseID+' successfully!!' });
    }
    else {
      res.status(400).json({ responseMessage: 'unable to delete record' });
    }
  }
  try {
    deleteStudentEnrollment();
   

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});


router.get('/student/home' , function (req, res) {
 //console.log("Inside get student home");
  //console.log("Request params:");
  //console.log(req.query);
  let id = req.query.id;
  var queryResult = [];
  const getList = async () => {
    queryResult = await courseDao.getCoursesForAStudent(id);
    if (queryResult[0]) {
      if (queryResult[0].course_id != null) {
        console.log("Data Found!");
        res.status(200).json(queryResult);
      }
    }
    else {
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    getList();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});


router.get('/faculty/home', function (req, res) {
  console.log("Inside get faculty home");
  console.log("Request params:");
  console.log(req.query);
  let id = req.query.id;
  var queryResult = [];
  const getList = async () => {
    queryResult = await courseDao.getCoursesByFaculty(id);
    console.log(queryResult);
    if (queryResult[0]) {
      if (queryResult[0].course_id != null) {
        console.log("Data Found!");
        res.status(200).json(queryResult);
      }
    }
    else {
      console.log("Data Not Found!");
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    getList();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});


router.get('/studentRegisteredForACourse', function (req, res) {
  console.log("Inside get studentRegisteredForACourse");
  console.log("Request params:");
  console.log(req.query);
  let courseID = req.query.courseID;
  var queryResult = [];
  const getStudentsForACourse = async () => {
    queryResult = await courseDao.getStudentsForACourse("studentenrollment", courseID);
    if (queryResult[0]) {
      if (queryResult[0].id != null) {
        console.log("Data Found!");
        res.status(200).json(queryResult);
      }
    }
    else {
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    getStudentsForACourse();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});

router.get('/people', function (req, res) {
  console.log("Inside get people");
  console.log("Request params:");
  console.log(req.query);
  let courseID = req.query.courseID;
  var queryResult = [];
  const getPeople = async () => {
    queryResult = await courseDao.getPeople(courseID);
    if (queryResult[0]) {
      if (queryResult[0].name != null) {
        console.log("Data Found!");
        res.status(200).json(queryResult);
      }
    }
    else {
      res.status(400).json({ responseMessage: 'Record not found' });
    }
  }
  try {
    getPeople();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ responseMessage: 'Database not responding' });
  }
});


module.exports = router;
