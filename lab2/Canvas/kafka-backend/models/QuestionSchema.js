var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
QuestionSchema = new Schema({
  id: {
    type: Number
  },
  question: {
    type: String,
    default: ''
  },
  optA: {
    type: String,
    default: ''
  },
  optB: {
    type: String,
    default: ''
  },
  optC: {
    type: String,
    default: ''
  },
  answer: {
    type: String,
    default: ''
  },
  quiz_id: {
    type: String
  }
});
    
module.exports = mongoose.model('Question', QuestionSchema); 