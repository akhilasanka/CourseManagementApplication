const express = require('express');
const router = express.Router();
const CourseRoutesDao = require("../dao/daoForCourseRoutes");
const courseDao = new CourseRoutesDao();
const CourseRoutesBasic = require("../dao/daoForLoginSignupRoutes");
const courseDaoBasic = new CourseRoutesBasic();
const sha1 = require('sha1');


router.post('/course', function(req,res){
    console.log("Inside course post request");
    console.log("Request Body:");
    console.log(req.body);
    let formatEmail = req.body.email.toLowerCase().trim();
    console.log("formatted email:"+formatEmail);
    var queryResult = [];
    const createCourseIfNotPresent = async () => {
      queryResult = await courseDaoBasic.checkIfUserExists("course",formatEmail);
      if(queryResult[0]){
        if(queryResult[0].id != null){
          console.log("Course already exists!");
          res.status(200).json({responseMessage: 'Course already exists!'});
        }
      }
      else{
        var inputData = {
            "id" : req.body.id, 
            "name" : req.body.name,
            "dept" : req.body.dept,
            "description" :  req.body.description,
            "room" : req.body.room,
            "capacity" : req.body.capacity,
            "waitlistCapacity" : req.body.waitlistCapacity,
            "courseTerm" : req.body.courseTerm,
            "faculty_id" : req.body.faculty_id
        }
        queryResult = await courseDao.createNewUser("course",inputData);
        console.log("Course Added");
        res.status(200).json({responseMessage: 'Successfully Added!'});
      }
    }

    try{
      createCourseIfNotPresent();
    }
    catch(err){
      console.log(err);
      res.status(500).json({responseMessage: 'Database not responding'});
    }
});



router.post('/generateWaitlistCode',function (req, res) {
  console.log("Inside grenate waitlist code");
  console.log("Request Body:");
  console.log(req.body);
  let facultyID = req.body.facultyID;
  let courseID = req.course.courseID;
  let name = req.body.student_name;
  let inputKey = name+courseID+facultyID;
  let permissionCode = sha1(inputKey);
  res.status(200).json({responseMessage: permissionCode});
});


router.get('/waitlistStudents',function(req,res){
  console.log("Inside get waitlist students");
  console.log("Request params:");
  console.log(req.query);
  let courseID = req.query.courseID;
  var queryResult = [];
    const getWaitlistStudents = async () => {
      queryResult = await courseDao.getWaitlistStudents(courseID);
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
      getWaitlistStudents();
    }
    catch(err){
      console.log(err);
      res.status(500).json({responseMessage: 'Database not responding'});
    }
});

router.get('/course/search',function(req,res){
  console.log("Inside get waitlist students");
  console.log("Request params:");
  console.log(req.query);
  let courseID = req.query.courseID;
  let deptID = req.query.deptID;
  var queryResult = [];
    const getCourses = async () => {
      queryResult = await courseDao.searchCourseList("course",courseID,deptID);
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
      getCourses();
    }
    catch(err){
      console.log(err);
      res.status(500).json({responseMessage: 'Database not responding'});
    }
});

router.get('/course/searchfiltergreatherthan',function(req,res){
  console.log("Inside get waitlist greater than filter students");
  console.log("Request params:");
  console.log(req.query);
  let courseID = req.query.courseID;
  let deptID = req.query.deptID;
  var queryResult = [];
    const getCourses = async () => {
      queryResult = await courseDao.searchCourseListGreater("course",courseID,deptID);
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
      getCourses();
    }
    catch(err){
      console.log(err);
      res.status(500).json({responseMessage: 'Database not responding'});
    }
});

router.get('/course/searchfilterlessthan',function(req,res){
  console.log("Inside get waitlist less than filter students");
  console.log("Request params:");
  console.log(req.query);
  let courseID = req.query.courseID;
  let deptID = req.query.deptID;
  var queryResult = [];
    const getCourses = async () => {
      queryResult = await courseDao.searchCourseListLess("course",courseID,deptID);
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
      getCourses();
    }
    catch(err){
      console.log(err);
      res.status(500).json({responseMessage: 'Database not responding'});
    }
});


router.post('/student/enroll',function(req,res){
  console.log("Inside post student/enroll");
  console.log("Request body:");
  console.log(req.body);
  var queryResult = [];
  const enrollCourse = async () => {
      var inputData = {
          "course_id" : req.body.courseID, 
          "student_id" : req.body.studentID,
          "status" : req.body.status
      }
      queryResult = await courseDaoBasic.createNewUser("studentenrollment",inputData);
      if(queryResult[0]){
        if(queryResult[0].id != null){
          console.log("Course resgistered");
          res.status(200).json({responseMessage: 'Successfully Registered!'});
        }
      }
      else{
        res.status(400).json({responseMessage: 'Record not found'});
      }
    }
    try{
          enrollCourse();
    }
    catch(err){
      console.log(err);
      res.status(500).json({responseMessage: 'Database not responding'});
    }
});

router.get('/student/getCourseStatus',function(req,res){
  console.log("Inside get student/getCourseStatus");
  console.log("Request params:");
  console.log(req.query);
  let queryResult = [];
  let courseID = req.query.id;
  const getcapacity = async () => {
    queryResult = await courseDaoBasic.checkIfUserExists("course",courseID);
  }
  const getStudents = async (status) => {
    queryResult = null;
    queryResult = await courseDao.getStudentsForAStatus("studentenrollment",courseID,status);
    if(queryResult[0]){
      return queryResult.length;
    }
  }
  const registered = async () => {
    queryResult = [];
    let isRegistered = null;
    queryResult = await courseDao.checkIfStudentIsRegistered("studentenrollment",courseID,studentID);
    if(queryResult[0]){
      isRegistered = false;
    }
    else{
      isRegistered = true;
    }
    return isRegistered;
  }
  try{
  getcapacity();
  if(queryResult[0]){
    if(queryResult[0].id == null){
      res.status(200).json({msg: 'invalid Couse ID'});
    }
}
else{
  let capacity = queryResult.capacity;
  let waitlistCapacity = queryResult.waitlistCapacity;
  let enrolledStudents = getStudents('E');
  let waitlistStudents = getStudents('W');
  let status = null;
  if(registered){
    status = 'R';
  }
  else{
    if(capacity>enrolledStudents){
      status = 'E';
    }
    else{
      if(waitlistCapacity>waitlistStudents){
        status = 'W';
        enrollCourse(status);
        res.status(200).json({msg: 'Enrollmentment Full. Added to Waitlist'});
      }
    }
  }
  res.status(200).json({status: status});
}
}
catch(err){
  console.log(err);
  res.status(500).json({responseMessage: 'Database not responding'});
}
});


router.delete('/student/deleteEnrollment',function(req,res){
  console.log("Inside delete student/deleteEnrollment");
  console.log("Request params:");
  console.log(req.query);
  let queryResult = [];
  let courseID = req.query.couseID;
  let studentID = req.query.studentID;
  const deleteStudentEnrollment = async () => {
    queryResult = await courseDao.deleteStudentEnrollmentRecord("studentenrollment",courseID,studentID);
  }
  try{
    deleteStudentEnrollment();
    if(queryResult){
      res.status(200).json({msg: 'Deletion Successful'});
    }
    else{
      res.status(400).json({msg: 'unable to delete record'});
    }
 
}
catch(err){
  console.log(err);
  res.status(500).json({responseMessage: 'Database not responding'});
}
});


router.get('/student/home',function(req,res){
  console.log("Inside get student home");
  console.log("Request params:");
  console.log(req.query);
  let studentID = req.query.studentID;
  var queryResult = [];
    const getList = async () => {
      queryResult = await courseDao.getCoursesForAStudent("studentenrollment",studentID);
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
      getList();
    }
    catch(err){
      console.log(err);
      res.status(500).json({responseMessage: 'Database not responding'});
    }
});


router.get('/student/home',function(req,res){
  console.log("Inside get student home");
  console.log("Request params:");
  console.log(req.query);
  let deptID = req.query.studentID;
  var queryResult = [];
    const getList = async () => {
      queryResult = await courseDao.getCoursesForAStudent("studentenrollment",studentID);
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
      getList();
    }
    catch(err){
      console.log(err);
      res.status(500).json({responseMessage: 'Database not responding'});
    }
});


router.get('/studentRegisteredForACourse',function(req,res){
  console.log("Inside get studentRegisteredForACourse");
  console.log("Request params:");
  console.log(req.query);
  let courseID = req.query.courseID;
  var queryResult = [];
    const getStudentsForACourse = async () => {
      queryResult = await courseDao.getStudentsForACourse("studentenrollment",courseID);
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
      getStudentsForACourse();
    }
    catch(err){
      console.log(err);
      res.status(500).json({responseMessage: 'Database not responding'});
    }
});


module.exports = router;
