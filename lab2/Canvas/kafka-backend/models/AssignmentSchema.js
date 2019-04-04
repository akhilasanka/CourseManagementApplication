var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
AssignmentSchema = new Schema({
  course_id: {
    type: Number,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  }
});
    
module.exports = mongoose.model('Assignments', AssignmentSchema); 