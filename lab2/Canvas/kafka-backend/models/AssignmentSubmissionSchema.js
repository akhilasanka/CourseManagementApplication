var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
AssignmentSubmissionSchema = new Schema({
  course_id: {
    type: Number,
    default: ''
  },
  student_id: {
    type: String,
    default: ''
  },
  assignment_id: {
    type: String,
    default: ''
  },
  comments:{
      type: String,
      default: '-'
  },
  file_name: {
    type: String,
    default: ''
  },
  timestamp: {
      type: String,
      default: ''
  },
  marks: {
      type: Number
  }
});
    
module.exports = mongoose.model('AssignmentSubmissions', AssignmentSubmissionSchema); 