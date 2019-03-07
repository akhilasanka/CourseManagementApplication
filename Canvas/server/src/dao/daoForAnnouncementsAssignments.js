const dbConnection = require('./dbConnectionPool');

module.exports = class announcementAssignmentDao {

    async getAnnouncements(courseID){
        let con = await dbConnection();
        try {
          await con.query("START TRANSACTION");
          let result = await con.query('SELECT `desc` FROM `announcement` WHERE course_id = ?', [courseID]);
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