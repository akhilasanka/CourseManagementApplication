var Courses = require('../models/CourseSchema');
var Users = require('../models/UserSchema');
var Grades = require('../models/GradesSchema');
var Waitlist = require('../models/WaitlistSchema');
var sha1 = require('sha1');

exports.courseService = function courseService(msg, callback) {
    console.log("In course Service path:", msg.path);
    switch (msg.path) {
        case "new_course":
            createNewCourse(msg, callback);
            break;
        case "search_course":
            searchCourses(msg, callback);
            break;
        case "enroll_course":
            enrollCourse(msg, callback);
            break;
        case "student_course":
            getStudentCourses(msg, callback);
            break;
        case "faculty_course":
            getFacultyCourses(msg, callback);
            break;
        case "delete_course":
            deleteCourse(msg, callback);
            break;
        case "details_course":
            getCourseDetails(msg, callback);
            break;
        case "students_course":
            getStudentsForACourse(msg, callback);
            break;
        case "waitlisted_students_course":
            getWaitlistedStudentsForACourse(msg, callback);
            break;
        case "waitlist_code":
            generateWaitlistCode(msg, callback);
            break;
        case "student_grades":
             getStudentGrades(msg, callback);
    }
};

function createNewCourse(msg, callback) {

    console.log("In create New Course topic service. Msg: ", msg);
    Courses.findOne({ id: msg.id }, function (err, rows) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if (rows) {
                console.log("Course already exists");
                callback(null, { status: 401, rows });
            } else {
                var courseData = {
                    "id": msg.body.id,
                    "name": msg.body.name,
                    "dept": msg.body.dept,
                    "description": msg.body.description,
                    "room": msg.body.room,
                    "capacity": msg.body.capacity,
                    "waitlistCapacity": msg.body.waitlistCapacity,
                    "courseTerm": msg.body.courseTerm,
                    "faculty_id": msg.body.faculty_id,
                    "faculty_name": msg.body.faculty_name,
                    "currentEnrolledStudents": 0
                }
                //Save the courses in database
                Courses.create(courseData, function (err, user) {
                    if (err) {
                        console.log("unable to insert into database", err);
                        callback(err, "Database Error");
                    } else {
                        console.log("User Signup Successful");
                        callback(null, { status: 200, user });
                    }
                });
            }
        }
    });
}

function searchCourses(msg, callback) {

    console.log("In search Course topic service. Msg: ", msg);

    let query = {};
    if (msg.body.course_id) {
        switch (msg.body.operation) {
            case '=': query['$and'] = [{ id: { $eq: msg.body.course_id } }];
                break;
            case '<': query['$and'] = [{ id: { $lt: msg.body.course_id } }];
                break;
            case '>': query['$and'] = [{ id: { $gt: msg.body.course_id } }];
                break;
        }
    } else {
        query['$and'] = [];
    }
    if (msg.body.term) {
        query['$and'].push({ courseTerm: msg.body.term });
    }
    if (msg.body.dept) {
        query['$and'].push({ dept: msg.body.dept });
    }

    console.log(query);
    Courses.find(query)
        .exec(function (err, results) {
            if (err) {
                console.log(err);
                console.log("Email list not found");
                callback(err, "Email list not found");
            } else {
                if (results[0]) {
                    console.log("results:", results)
                    callback(null, { status: 200, courses: results });
                }
                else {
                    console.log("No results found");
                    callback(null, { status: 401 });
                }
            }
        });

}

function enrollCourse(msg, callback) {

    console.log("In enroll Course topic service. Msg: ", msg);
    Users.findOne({ _id: msg.body.studentID, role: 'student', 'courses.course_id': msg.body.courseID }, function (err, rows) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            console.log("rows", rows);
            if (rows) {
                console.log("Course already enrolled");
                callback(null, { status: 205, rows });
            } else {
                Courses.find({ id: msg.body.courseID }, function (err, result) {
                    if (result) {
                        var courseData = {
                            "course_id": msg.body.courseID,
                            "course_name": result[0].name,
                            "status": msg.body.status,
                            "waitlistCode": '',
                            "grade": '-',
                            "dept": result[0].dept,
                            "term": result[0].courseTerm,
                            "faculty_id": result[0].faculty_id,
                            "faculty_name": result[0].faculty_name
                        }
                        var waitlistData = '';
                        if (msg.body.status === 'W') {
                        waitlistData = {
                                "course_id": msg.body.courseID,
                                "course_name": result[0].name,
                                "waitlistCode": '',
                                "term": result[0].courseTerm,
                                "student_id": msg.body.studentID,
                                "student_name": msg.body.studentName,
                                "faculty_id": result[0].faculty_id,
                                "waitlistCapacity":result[0].waitlistCapacity
                            }
                        }

                        Users.findOneAndUpdate({ _id: msg.body.studentID }, { $push: { courses: courseData } }, function (err, result) {
                            if (err) {
                                console.log("unable to insert into database", err);
                                callback(err, "Database Error");
                            } else {
                                console.log("course enrolled Successful");
                                if (msg.body.status === 'E') {
                                    Courses.findOneAndUpdate({ id: msg.body.courseID }, { $inc: { currentEnrolledStudents: 1 } }, function (err, result) {
                                        if (err) {
                                            console.log("unable to update enrolled students", err);
                                            callback(err, "Database Error");
                                        } else {
                                            if(result){
                                            console.log("Enrolled student count incremented");
                                            callback(null, { status: 200, result });
                                            }
                                            else{
                                                console.log(err);
                                            }
                                        }
                                    });
                                }
                                else {
                                    
                                    console.log("waitlist data:");
                                    console.log(waitlistData);
                                    Waitlist.create(waitlistData, function (err, user) {
                                        if (err) {
                                            console.log("unable to insert into database", err);
                                            callback(err, "Database Error");
                                        } else {
                                            console.log("Saved to waitlist collection Successful");
                                            callback(null, { status: 200, result: "Successfully added" });
                                        }
                                    });

                                }
                            }

                        });
                    }
                    else {
                        callback(err, "Database Error");
                    }

                });
            }
        }
    });
}

function getStudentCourses(msg, callback) {

    console.log("In get student courses. Msg: ", msg)

    Users.findOne({ _id: msg.body.id, role: 'student' }, { '_id': 0, "courses": 1 }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Email list not found");
            callback(err, "Email list not found");
        } else {
            if (results) {
                console.log("results:", results);
                callback(null, { status: 200, courses: results.courses });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }
        }
    })
}

function getFacultyCourses(msg, callback) {

    console.log("In get faculty courses. Msg: ", msg)

    Courses.find({ faculty_id: msg.body.id }, { '_id': 0, "id": 1, "dept": 1 }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Email list not found");
            callback(err, "Email list not found");
        } else {
            if (results) {
                callback(null, { status: 200, courses: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }
        }
    })
}


function deleteCourse(msg, callback) {

    console.log("In delete Course topic service. Msg: ", msg);
    Users.findOne({ _id: msg.body.studentID, role: 'student', 'courses.course_id': parseInt(msg.body.courseID) }, function (err, rows) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if (rows) {
                console.log(rows);
                Users.findOneAndUpdate({ _id: msg.body.studentID }, { $pull: { 'courses': { course_id: parseInt(msg.body.courseID) } } }, function (err, result) {
                    if (err) {
                        console.log("unable to update database", err);
                        callback(err, "Database Error");
                    } else {
                        console.log("Deletion Successful......");
                        if (msg.body.status === 'E') {
                            Courses.findOneAndUpdate({ id: parseInt(msg.body.courseID) }, { $inc: { currentEnrolledStudents: -1 } }, function (err, result) {
                                if (err) {
                                    console.log("unable to update enrolled students", err);
                                    callback(err, "Database Error");
                                } else {
                                    if(result){
                                    console.log(result);
                                    console.log("Enrolled student count decremented");
                                    callback(null, { status: 200, result });
                                    }
                                    else{
                                        console.log(err);
                                    }
                                }
                            });
                        } else {
                            Waitlist.findOneAndRemove({ course_id: parseInt(msg.body.courseID), student_id:msg.body.studentID }, function (err, result) {
                                if (err) {
                                    console.log("unable to update enrolled students", err);
                                    callback(err, "Database Error");
                                } else {
                                   
                                    console.log("Enrolled student count decremented");
                                    callback(null, { status: 200, result });
                                }
                            });
                        }
                    }
                });
            } else {
                callback(null, { status: 205 });
            }
        }
    });
}


function getStudentsForACourse(msg, callback) {

    console.log("In get students for a course. Msg: ", msg)

    Users.find({ 'courses.course_id': parseInt(msg.body.courseID) }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("results:", results);
                callback(null, { status: 200, students: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }
        }
    });
}

function getWaitlistedStudentsForACourse(msg, callback) {

    console.log("In get waitlisted students for a course. Msg: ", msg)

    Waitlist.find({ 'faculty_id': msg.body.facultyID }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("results:", results);
                callback(null, { status: 200, students: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }
        }
    })
}

function generateWaitlistCode(msg, callback) {

    console.log("In generate waitlist code for a course. Msg: ", msg);

    let studentID = msg.body.studentID;
    let courseID = msg.body.courseID;
    let inputKey = courseID + studentID;
    let permissionCode = sha1(inputKey);
    console.log("permission code:",permissionCode);

    Waitlist.findOneAndUpdate({ course_id: parseInt(msg.body.courseID), student_id:msg.body.studentID },  { $set: { waitlistCode: permissionCode }}, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("results:", results);
                callback(null, { status: 200});
            }
            else {
                console.log("Updation failed");
                callback(null, { status: 400 });
            }
        }
    })
}

function getStudentGrades(msg, callback) {

    console.log("In get student grades. Msg: ", msg)

    Grades.find({ student_id: msg.body.studentID, course_id: parseInt(msg.body.courseID) }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Grades list not found");
            callback(err, "Grades list not found");
        } else {
            if (results) {
                console.log("results:", results);
                callback(null, { status: 200, grades: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }
        }
    })
}