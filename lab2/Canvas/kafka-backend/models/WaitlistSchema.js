var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
WaitlistSchema = new Schema({
    course_id: {
    type: Number,
    default: ''
  },
  course_name: {
    type: String,
    default: ''
  },
  student_id: {
    type: String,
    default: ''
  },
  student_name:{
    type: String,
    default: ''
  },
  faculty_id: {
    type: String,
    default: ''
  },
  term: {
    type: String,
    default: ''
  },
  waitlistCapacity:{
    type: Number,
    default: 0
  },
  waitlistCode: {
    type: String,
    default: ''
  }
});
    
module.exports = mongoose.model('Waitlist', WaitlistSchema); 