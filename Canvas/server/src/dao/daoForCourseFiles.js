const dbConnection = require('./dbConnectionPool');

module.exports = class courseFilesDao {

    async getCourseFiles(courseID){
        let con = await dbConnection();
        try {
          await con.query("START TRANSACTION");
          let result = await con.query('SELECT file_name FROM `course_file` WHERE course_id = ? ', [courseID]);
          await con.query("COMMIT");
          result = JSON.parse(JSON.stringify(result));
          return result;
        } catch (ex) {
          console.log(ex);
          throw ex;
        } finally {
          await con.release();
          await con.destroy();
        }
      }
}