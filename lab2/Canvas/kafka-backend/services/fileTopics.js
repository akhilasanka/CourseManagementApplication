var Files = require('../models/CourseFilesSchema');

exports.fileService = function fileService(msg, callback) {
    console.log("In file Service path:", msg.path);
    switch (msg.path) {
        case "upload_file":
            uploadCourseFile(msg, callback);
            break;
        case "get_files":
            getFiles(msg,callback);
            break;
    }
};


function uploadCourseFile(msg, callback) {

    console.log("In upload course file. Msg: ", msg);
    var fileData = {
        "course_id" : msg.body.courseID,
        "file_name" : msg.filename
    }
    Files.create(fileData, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("Saved to files collection Successful");
                console.log("results:", results);
                callback(null, {status: 200});
            }
            else {
                console.log("Unable to save data");
                callback(null, { status: 400, result: "Unable to save data" });
            }
        }
    });
}

function getFiles(msg, callback) {

    console.log("In get files. Msg: ", msg);

    Files.find({ course_id: parseInt(msg.body.courseID) }, { "file_name": 1 }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Files list not found");
            callback(err, "Files list not found");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, files: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 205 });
            }
        }
    })
}