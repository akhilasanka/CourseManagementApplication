var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
AnnouncementSchema = new Schema({
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
  },
  timestamp: {
    type: String,
    default: ''
  }
});
    
module.exports = mongoose.model('Announcements', AnnouncementSchema); 