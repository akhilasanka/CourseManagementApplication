var Announcements = require('../models/AnnouncementSchema');

exports.announcementService = function assignmentService(msg, callback) {
    console.log("In assignment Service path:", msg.path);
    switch (msg.path) {
        case "create_announcement":
            createAnnouncement(msg, callback);
            break;
        case "get_announcements":
            getAnnouncements(msg, callback);
            break;
    }

};

function createAnnouncement(msg, callback) {

    console.log("In create announcement. Msg: ", msg);
    let announcementData = {
        "course_id": parseInt(msg.body.courseID),
        "desc": msg.body.announcement,
        "title": msg.body.title,
        "timestamp": new Date()
    }
    Announcements.create(announcementData, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log("Saved to announcement collection Successful");
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

function getAnnouncements(msg, callback) {

    console.log("In get announcements. Msg: ", msg);
    Announcements.find({ "course_id": parseInt(msg.body.courseID) }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Database error");
            callback(err, "Database error");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, announcements: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 204 });
            }
        }
    });
}
