var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
GradesSchema = new Schema({
  course_id: {
    type: Number,
    default: ''
  },
  student_id: {
    type: String,
    default: ''
  },
  graded_for: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  total: {
      type: Number,
      default: 10
  },
  marks: {
      type: Number
  }
});
    
module.exports = mongoose.model('Grades', GradesSchema); 