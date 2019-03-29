const dbConnection = require('./dbConnectionPool');

module.exports = class announcementAssignmentDao {

async getQuizzes(courseID,facultyID){
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT q.id, q.title, q.points, q.isPublished FROM `quiz` AS q LEFT JOIN `course` AS c ON q.course_id=c.id WHERE q.course_id = ? AND c.faculty_id=?', [courseID,facultyID]);
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

  async updatePublishStatus(quizID) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      await con.query(`UPDATE quiz SET isPublished = 1 WHERE id = ?`, [
          quizID
        ]);
      await con.query("COMMIT");
      return true;
    } catch (ex) {
      await con.query("ROLLBACK");
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async getQuizzesForAStudent(courseID){
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT q.id, q.title, q.points, q.isPublished FROM `quiz` AS q LEFT JOIN `course` AS c ON q.course_id=c.id WHERE q.course_id = ?', [courseID]);
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

  async getQuizQuestionsForAStudent(quizID){
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT * FROM `question` WHERE quiz_id = ?', [quizID]);
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