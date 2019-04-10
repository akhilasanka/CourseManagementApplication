var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
QuizSchema = new Schema({
  course_id: {
    type: Number,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  points: {
    type: Number
  },
  isPublished: {
      type: Boolean,
      default: false
  }
});
    
module.exports = mongoose.model('Quiz', QuizSchema); 