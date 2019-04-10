var Assignments = require('../models/AssignmentSchema');
var AssignmentSubmissions = require('../models/AssignmentSubmissionSchema');
var Grades = require('../models/GradesSchema');

exports.assignmentService = function assignmentService(msg, callback) {
    console.log("In assignment Service path:", msg.path);
    switch (msg.path) {
        case "create_assignment":
            createAssignment(msg, callback);
            break;
        case "get_assignments":
            getAssignments(msg, callback);
            break;
        case "submit_assignment":
            submitAssignment(msg, callback);
            break;
        case "get_assignmentsubmissions":
            getAssignmentSubmissions(msg, callback);
            break;
        case "get_assignmentsubmission_details":
            getAssignmentSubmissionDetails(msg, callback);
            break;
        case "update_assignment_marks":
            updateAssignmentMarks(msg, callback);
            break;
        case "get_student_assignmentsubmissions":
              getStudentAssignmentSubmissions(msg, callback);
              break;
    }
};

function createAssignment(msg, callback) {

    console.log("In create assignment. Msg: ", msg);
    let assignmentData = {
        "course_id": parseInt(msg.body.courseID),
        "desc": msg.body.desc,
        "title": msg.body.title
    }
    Assignments.create(assignmentData, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("Saved to assignment collection Successful");
                console.log("results:", results);
                callback(null, { status: 200 });
            }
            else {
                console.log("Unable to save data");
                callback(null, { status: 400, result: "Unable to save data" });
            }
        }
    });
}


function getAssignments(msg, callback) {

    console.log("In get assignments. Msg: ", msg);
    Assignments.find({ "course_id": parseInt(msg.body.courseID) }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Database error");
            callback(err, "Database error");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, assignments: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 204 });
            }
        }
    });
}

function submitAssignment(msg, callback) {

    console.log("In submit assignment. Msg: ", msg);
    let assignmentData = {
        "course_id": msg.body.courseID,
        "student_id": msg.body.studentID,
        "assignment_id": msg.body.assignmentID,
        "comments": msg.body.comments,
        "file_name": msg.filename,
        "timestamp": new Date()
    }
    AssignmentSubmissions.create(assignmentData, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("Saved to assignment submission collection Successful");
                console.log("results:", results);
                callback(null, { status: 200 });
            }
            else {
                console.log("Unable to save data");
                callback(null, { status: 400, result: "Unable to save data" });
            }
        }
    });
}


function getAssignmentSubmissions(msg, callback) {

    console.log("In get assignment submissions. Msg: ", msg);
    AssignmentSubmissions.find({ "assignment_id": msg.body.assignmentID, "course_id": parseInt(msg.body.courseID) }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Database error");
            callback(err, "Database error");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, assignmentsubmissions: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 204 });
            }
        }
    });
}

function getAssignmentSubmissionDetails(msg, callback) {

    console.log("In get assignment submission details. Msg: ", msg);
    AssignmentSubmissions.findOne({ "_id": msg.body.submissionID }, { "_id":0, "file_name":1 , "marks":1 }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Database error");
            callback(err, "Database error");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, submissionDetails: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 204 });
            }
        }
    });
}

function updateAssignmentMarks(msg, callback) {

    console.log("In update assignment marks. Msg: ", msg);
    AssignmentSubmissions.updateMany({ "assignment_id": msg.body.assignmentID , "student_id": msg.body.studentID},  { $set: { marks: msg.body.marks }}, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("Updated marks successfully");
                console.log("results:", results);
                Assignments.findOne({ "_id": msg.body.assignmentID}, function (err, results) {
                    if(results){
                        updateStudentMarksInGradesTable(results, msg.body.marks, msg.body.studentID, function (err, results){
                            if(err){
                                console.log(err);
                                callback(err, "Database Error");
                            }
                            else{
                                console.log("success");
                                callback(null, { status: 200 });
                            }
                        });
                    }
                    else{
                        callback(null, { status: 400, result: "Unable to save data" });
                    }
                });
            }
            else {
                console.log("Unable to save data");
                callback(null, { status: 400, result: "Unable to save data" });
            }
        }
    });
}


function updateStudentMarksInGradesTable(result, marks, studentID, callback){
    console.log("marks",marks);
    console.log ( "adding assignment marks to user table");
   Grades.findOne({ id: result._id }, function (err, rows) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error when updating in grades table");
        } else {
            if (rows) {
                Grades.findOneAndUpdate({ id: result._id }, { $set: { marks: marks }} , function (err, user) {
                    if (err) {
                        console.log(err);
                        console.log("unable to update grades");
                        callback(err, "Database Error when updating in grades table");
                    } 
                    else {
                        console.log("Grades for this assignment sucessfully updated");
                        callback(null, { status: 200, user });
                    }
                });
            } else {
                    var gradesData = {
                        "course_id": result.course_id,
                        "student_id": studentID,
                        "graded_for": "Assignment",
                        "id": result._id,
                        "title": result.title,
                        "total": 10,
                        "marks": marks
                    }
                    Grades.create(gradesData, function (err, user) {
                        if (err) {
                            console.log("unable to insert marks data into database", err);
                            callback(err, "Database Error");
                        } else {
                            console.log("Grades for this assignment sucessfully added");
                            callback(null, { status: 200, user });
                        }
                    });
            }
        }
    });
}

function getStudentAssignmentSubmissions(msg, callback) {

    console.log("In get student assignment submissions. Msg: ", msg);
    AssignmentSubmissions.find({ "course_id": parseInt(msg.body.courseID) , "student_id": msg.body.studentID , "assignment_id": msg.body.assignmentID }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Database error");
            callback(err, "Database error");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, assignmentsubmissions: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 204 });
            }
        }
    });
}