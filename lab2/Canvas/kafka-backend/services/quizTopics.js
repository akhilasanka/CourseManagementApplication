var Quizzes = require('../models/QuizSchema');
var Questions = require('../models/QuestionSchema');
var Grades = require('../models/GradesSchema');

exports.quizService = function quizService(msg, callback) {
    console.log("In quiz Service path:", msg.path);
    switch (msg.path) {
        case "create_quiz":
            createQuiz(msg, callback);
            break;
        case "get_quizzes":
            getQuizzes(msg, callback);
            break;
        case "create_question":
            createQuestion(msg, callback);
            break;
        case "get_question":
            getQuestion(msg, callback);
            break;
        case "publish_quiz":
            publishQuiz(msg, callback);
            break;
        case "get_published_quizzes":
            getPublishedQuizzes(msg, callback);
            break;
        case "get_quiz_questions":
            getQuizQuestions(msg, callback);
            break;
        case "grade_quiz":
            gradeQuiz(msg, callback);
            break;
    }
};

function createQuiz(msg, callback) {

    console.log("In create quiz. Msg: ", msg);
    let quizData = {
        "course_id": parseInt(msg.body.courseID),
        "points": msg.body.points,
        "title": msg.body.title
    }
    Quizzes.create(quizData, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("Saved to quiz Successful");
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

function getQuizzes(msg, callback) {

    console.log("In get quizzes. Msg: ", msg);
    Quizzes.find({ "course_id": parseInt(msg.body.courseID) }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Database error");
            callback(err, "Database error");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, quizzes: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 204 });
            }
        }
    });
}

function createQuestion(msg, callback) {

    console.log("In create question. Msg: ", msg);
    let questionData = {
        "id": parseInt(msg.body.questionID),
        "question": msg.body.question,
        "optA": msg.body.optA,
        "optB": msg.body.optB,
        "optC": msg.body.optC,
        "answer": msg.body.answer,
        "quiz_id": msg.body.quizID
    }
    Questions.findOne({ "id": parseInt(msg.body.questionID), "quiz_id": msg.body.quizID }, function (err, rows) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (rows) {
                console.log("Question to quiz already exists. Updating question");
                Questions.findOneAndUpdate({ "id": parseInt(msg.body.questionID), "quiz_id": msg.body.quizID }, {
                    $set:
                    {
                        "question": msg.body.question,
                        "optA": msg.body.optA,
                        "optB": msg.body.optB,
                        "optC": msg.body.optC,
                        "answer": msg.body.answer
                    }
                }, function (err, results) {
                    if (err) {
                        console.log(err);
                        callback(err, "Database Error");
                    } else {
                        if (results) {
                            console.log("Sucessfully updated question. results:", results);
                            callback(null, { status: 200 });
                        }
                        else {
                            console.log("Unable to update data");
                            callback(null, { status: 400, result: "Unable to update data" });
                        }
                    }
                });
            }
            else {
                Questions.create(questionData, function (err, results) {
                    if (err) {
                        console.log(err);
                        callback(err, "Database Error");
                    } else {
                        if (results) {
                            console.log("Saved to question table Successful");
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
        }
    });
}

function getQuestion(msg, callback) {

    console.log("In get quizzes. Msg: ", msg);
    Questions.findOne({ "id": parseInt(msg.body.questionID),"quiz_id": msg.body.quizID }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Database error");
            callback(err, "Database error");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, question: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 204 });
            }
        }
    });
}

function getQuizQuestions(msg, callback) {

    console.log("In publish quiz. Msg: ", msg);
    Quizzes.findOneAndUpdate({ "_id": msg.body.quizID }, { $set: { "isPublished": true }}, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Database error");
            callback(err, "Database error");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200});
            }
            else {
                console.log("Unable to update data");
                callback(null, { status: 400 });
            }
        }
    });
}

function getPublishedQuizzes(msg, callback) {

    console.log("In get quizzes. Msg: ", msg);
    Quizzes.find({ "course_id": parseInt(msg.body.courseID), "isPublished": true }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Database error");
            callback(err, "Database error");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, quizzes: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 204 });
            }
        }
    });
}

function getQuizQuestions(msg, callback) {

    console.log("In get quizzes. Msg: ", msg);
    Questions.find({ "quiz_id": msg.body.quizID }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Database error");
            callback(err, "Database error");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, questions: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 204 });
            }
        }
    });
}

function  gradeQuiz(msg, callback){
    console.log("In grade quiz. Msg: ", msg);
    Grades.findOne({ id: msg.body.quizID }, function (err, rows) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error when updating in grades table");
        } else {
            if (rows) {
                Grades.findOneAndUpdate({ id: msg.body.quizID }, { $set: { marks: msg.body.marks }} , function (err, user) {
                    if (err) {
                        console.log(err);
                        console.log("unable to update grades");
                        callback(err, "Database Error when updating in grades table");
                    } 
                    else {
                        console.log("Grades for this quiz sucessfully updated");
                        callback(null, { status: 200, user });
                    }
                });
            } else {
                Quizzes.findOne({ "_id": msg.body.quizID }, {"_id":0, "title": 1}, function (err, result) {
                    if (err) {
                        console.log(err);
                        console.log("Database error");
                        callback(err, "Database error");
                    } else {
                        if (result) {
                            console.log("results:", result)
                            var gradesData = {
                                "course_id": msg.body.courseID,
                                "student_id": msg.body.studentID,
                                "graded_for": "Quiz",
                                "id": msg.body.quizID,
                                "title": result.title,
                                "total": msg.body.total,
                                "marks": msg.body.marks
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
                        else {
                            console.log("No results found to get quiz title");
                            callback(null, { status: 400 });
                        }
                    }
                });
            }
        }
    });
}