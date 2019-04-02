var Users = require('../models/UserSchema');
var Messages = require('../models/MessageSchema');

exports.inboxService = function inboxService(msg, callback) {
    console.log("In inbox Service path:", msg.path);
    switch (msg.path) {
        case "inbox_emailList":
            getEmailList(msg, callback);
            break;
        case "inbox_save_new_message":
            saveMessage(msg, callback);
            break;
        case "inbox_messages":
            getMessages(msg, callback);
            break;
    }
};

function getEmailList(msg, callback) {

    console.log("In inbox get email List. Msg: ", msg);

    Users.find({}, { "email": 1 }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Email list not found");
            callback(err, "Email list not found");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, emailList: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 401 });
            }
        }
    })
}

function saveMessage(msg, callback) {

    console.log("In inbox save new msg service. Msg: ", msg);

    var msgData = {
        "to": msg.body.to,
        "from": msg.body.from,
        "message": msg.body.message,
        "timestamp": new Date()
    }
    //Save the user in database
    Messages.create(msgData, function (err, message) {
        if (err) {
            console.log("unable to insert into database", message);
            callback(err, "Database Error");
        } else {
            console.log("msg sent");
            callback(null, { status: 200, message });
        }
    });
}


function getMessages(msg, callback) {

    let sortCriteria = { timestamp : 1 };
    console.log("In inbox get messages. Msg: ", msg)

    Messages.find({ $or: [{ to : msg.email},{ from : msg.email}] }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Email list not found");
            callback(err, "Email list not found");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, msgs: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 401 });
            }
        }
    }).sort(sortCriteria);
}


