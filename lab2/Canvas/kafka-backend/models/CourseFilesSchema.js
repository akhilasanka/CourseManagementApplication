var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
CourseFilesSchema = new Schema({
  course_id: {
    type: Number,
    default: ''
  },
  file_name: {
    type: String,
    default: ''
  }
});
    
module.exports = mongoose.model('CourseFiles', CourseFilesSchema); 