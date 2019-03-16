const dbConnection = require('./dbConnectionPool');

module.exports = class courseDAO {
  async getWaitlistStudents(facultyID) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result =
        await con.query('SELECT course_id,name AS course_name,student_id,waitlistCapacity FROM studentenrollment as se INNER JOIN course as c ON se.course_id = c.id WHERE se.status = "W" AND se.waitlistCode IS NULL AND c.faculty_id = ?;', [facultyID]);
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

  async searchCourses(query) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query(query);
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


  async checkIfStudentIsRegistered(table, courseID, studentID) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT * FROM ?? WHERE course_id = ? AND  student_id = ?', [table, courseID, studentID]);
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

  async getStudentCourseDetails(studentID) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT c.id AS courseID, c.name AS courseName, c.dept AS dept, c.courseTerm, s.status, c.room, f.name AS facultyName, f.email AS facultyEmail FROM studentenrollment AS s LEFT JOIN course c ON s.course_id=c.id LEFT JOIN faculty f ON c.faculty_id=f.id WHERE s.student_id=? ORDER BY c.id', [studentID]);
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

  async deleteStudentEnrollmentRecord(table, courseID, studentID) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      await con.query(`DELETE FROM ?? WHERE course_id = ? AND student_id = ?`, [table, courseID, studentID]);
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

  async getCoursesForAStudent(studentID) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT course_id,dept FROM studentenrollment AS se INNER JOIN course AS c ON se.course_id = c.id WHERE student_id = ?', [studentID]);
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


  async getCoursesByFaculty(facultyID) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT id AS course_id, dept FROM `course` WHERE faculty_id = ?', [facultyID]);
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

  async getStudentsForACourse(courseID) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT s.name FROM `student` AS s INNER JOIN `studentenrollment` as se ON s.id=se.student_id WHERE course_id = ?', [courseID]);
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

  async updateWaitlistCode(student_id, course_id, waitlistCode) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      await con.query(`UPDATE studentenrollment SET waitlistCode = ? WHERE student_id = ? AND course_id = ?
      AND waitlistCode IS NULL`, [
          waitlistCode,
          student_id,
          course_id
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

  async updateCurrentStudentsCount(courseID,operation) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      await con.query(`UPDATE course SET currentEnrolledStudents = currentEnrolledStudents`+operation+`1 WHERE id = ?`, [
          courseID
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

  async getPeople(courseID) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result =
        await con.query('SELECT s.id, s.name, c.dept FROM studentenrollment AS se LEFT JOIN student AS s ON se.student_id=s.id INNER JOIN course as c ON se.course_id=c.id WHERE se.course_id=?', [courseID]);
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