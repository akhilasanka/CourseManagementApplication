var mysql = require('mysql');
var express = require('express');
var router = express.Router();

 var con = mysql.createConnection({
   connectionLimit: 100,
   host:'localhost',
   user:'root',
   password:'password',
   database:'canvas',
   port: 3306,
   debug: false,
   multipleStatements: true
 });

 router.route('/student/home').get(function (req, res) {
    console.log("Inside profile get request");
    console.log("Request params:");
    console.log(req.query);
    let studentID = req.query.id;
  
     con.query('SELECT course_id,dept FROM studentenrollment AS se INNER JOIN course AS c ON se.course_id = c.id WHERE student_id = ?', [studentID], function (error,result) {
         if(error){
             console.log(error);
             console.log("Courses not found");
             res.status(400).send("Courses not found");
         }else{
             console.log(JSON.stringify(result));
             res.status(200).send(JSON.stringify(result));
             console.log("Courses found");
         }
     });
 });

module.exports = router;