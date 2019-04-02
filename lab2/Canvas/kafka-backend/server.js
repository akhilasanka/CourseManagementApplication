var connection = new require('./kafka/Connection');

//topics file
var loginSignupTopics = require('./services/loginSignupTopics.js');
var inboxTopics = require('./services/inboxTopics.js');
var courseTopics = require('./services/courseTopics.js');
var profileTopics = require('./services/profileTopics.js');

// Set up Database connection
var config = require('./config/settings');
var mongoose = require('mongoose');
var connStr = config.database_type + '://' + config.database_username + ':' + config.database_password + '@' + config.database_host + ':' + config.database_port + '/' + config.database_name;
console.log(connStr);
mongoose.connect(connStr, { useNewUrlParser: true, poolSize: 10, }, function (err) {
    if (err) throw err;
    else {
        console.log('Successfully connected to MongoDB');
    }
});

console.log('Kafka server is running ');

function handleTopicRequest(topic_name, fname) {
    console.log("topic_name:", topic_name)
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    consumer.on('error', function (err) {
        console.log("Kafka Error: Consumer - " + err);
    });
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name + " ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        switch (topic_name) {

            case 'loginSignup_topics':
                loginSignupTopics.loginSignupService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
            case 'inbox_topics':
                inboxTopics.inboxService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
            case 'course_topics':
                courseTopics.courseService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
            case 'profile_topics':
                profileTopics.profileService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
        }
    })
};

function response(data, res, producer) {
    console.log('after handle', res);
    var payloads = [
        {
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
    ];
    producer.send(payloads, function (err, data) {
        console.log('producer send', data);
    });
    return;
}

// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("loginSignup_topics", loginSignupTopics);
handleTopicRequest("inbox_topics", inboxTopics);
handleTopicRequest("course_topics", courseTopics);
handleTopicRequest("profile_topics", profileTopics);