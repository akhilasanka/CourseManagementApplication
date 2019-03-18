const dbConnection = require('./dbConnectionPool');

module.exports = class announcementAssignmentDao {

    async getAnnouncements(courseID){
        let con = await dbConnection();
        try {
          await con.query("START TRANSACTION");
          let result = await con.query('SELECT * FROM `announcement` WHERE course_id = ?', [courseID]);
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

      async getAnnouncementsByFaculty(courseID,facultyID){
        let con = await dbConnection();
        try {
          await con.query("START TRANSACTION");
          let result = await con.query('SELECT a.id, a.title, a.desc FROM `announcement` AS a LEFT JOIN `course` AS c ON a.course_id=c.id WHERE a.course_id = ? AND c.faculty_id=?', [courseID,facultyID]); 
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

      async getAnnouncements(courseID,facultyID){
        let con = await dbConnection();
        try {
          await con.query("START TRANSACTION");
          let result = await con.query('SELECT * FROM `announcement` WHERE course_id = ? ', [courseID]);
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

      async getAssignments(courseID,facultyID){
        let con = await dbConnection();
        try {
          await con.query("START TRANSACTION");
          let result = await con.query('SELECT a.id, a.title, a.desc FROM `assignment` AS a LEFT JOIN `course` AS c ON a.course_id=c.id WHERE a.course_id = ? AND c.faculty_id=?', [courseID,facultyID]);
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

      async getAssignmentsofStudents(courseID,studentID){
        let con = await dbConnection();
        try {
          await con.query("START TRANSACTION");
          let result = await con.query('SELECT * FROM `assignment` WHERE course_id = ?', [courseID]);
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

      async getAssignmentSubmissions(courseID){
        let con = await dbConnection();
        try {
          await con.query("START TRANSACTION");
          let result = await con.query('SELECT * FROM `assignment_submission` WHERE course_id = ?', [courseID]);
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
      
      async getAssignmentSubmissionFile(submissionID){
        let con = await dbConnection();
        try {
          await con.query("START TRANSACTION");
          let result = await con.query('SELECT file_name, marks FROM `assignment_submission` WHERE id = ?', [submissionID]);
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

      async getMyAssignmentSubmissions(courseID,studentID,assignmentID){
        let con = await dbConnection();
        try {
          await con.query("START TRANSACTION");
          let result = await con.query('SELECT * FROM `assignment_submission` WHERE course_id = ? AND student_id = ? AND assignment_id = ?', [courseID,studentID,assignmentID]);
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

      async updateMarks(submissionID,marks) {
        let con = await dbConnection();
        try {
          await con.query("START TRANSACTION");
          await con.query(`UPDATE assignment_submission SET marks = ? WHERE id = ?`, [
              marks, submissionID
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
    

}