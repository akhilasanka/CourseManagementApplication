var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
MessageSchema = new Schema({
  to: {
    type: String,
    default: ''
  },
  from: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  timestamp: {
    type: String,
    default: ''
  }
});
    
module.exports = mongoose.model('Messages', MessageSchema); 