var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
CourseSchema = new Schema({
    id: {
        type: Number
      },
    name: {
        type: String,
        default: '',
    },
    dept: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    room: {
        type: String,
        default: '',
    },
    capacity: {
        type: Number,
        default: 0
    },
    waitlistCapacity: {
        type: Number,
        default: 0
    },
    currentEnrolledStudents: {
        type: Number,
        deafult: 0
    },
    courseTerm: {
        type: String,
        deafult: ''
    },
    faculty_id: {
        type: String,
        default: ''
    },
    faculty_name: {
        type: String,
        deafult: ''
    }
});
    
module.exports = mongoose.model('Courses', CourseSchema); 