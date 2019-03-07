const dbConnection = require('./dbConnectionPool');

module.exports = class courseDAO {
    async getWaitlistStudents(courseID) {
        let con = await dbConnection();
        try {
            await con.query("START TRANSACTION");
            let result = 
            await con.query('SELECT s.id, s.name  FROM student as s INNER JOIN studentenrollment as se ON s.id = se.student_id WHERE se.status = "W" AND se.course_id = ?;', [courseID]);
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

        async searchCourseList(table,courseID,deptID){
          let con = await dbConnection();
          try {
              await con.query("START TRANSACTION");
              let result = await con.query('SELECT * FROM ?? WHERE id = ? AND  dept = ?', [table, courseID, deptID]);
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

            async searchCourseListGreater(table,courseID,deptID){
              let con = await dbConnection();
              try {
                  await con.query("START TRANSACTION");
                  let result = await con.query('SELECT * FROM ?? WHERE id > ? AND  dept = ?', [table, courseID, deptID]);
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

              async searchCourseListLess(table,courseID,deptID){
                let con = await dbConnection();
                try {
                    await con.query("START TRANSACTION");
                    let result = await con.query('SELECT * FROM ?? WHERE id < ? AND  dept = ?', [table, courseID, deptID]);
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

                async checkIfStudentIsRegistered(table,courseID,studentID){
                  let con = await dbConnection();
                  try {
                      await con.query("START TRANSACTION");
                      let result = await con.query('SELECT * FROM ?? WHERE course_id = ? AND  student_id = ? AND status!="NULL"', [table, courseID, studentID]);
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

                  async getStudentsForAStatus(table,courseID,status){
                    let con = await dbConnection();
                    try {
                      await con.query("START TRANSACTION");
                      let result = await con.query('SELECT * FROM ?? WHERE course_id = ? AND  student_id = ? AND status= ?', [table, courseID, status]);
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

                  async deleteStudentEnrollmentRecord(table,courseID,studentID) {
                    let con = await dbConnection();
                    try {
                      await con.query("START TRANSACTION");
                      await con.query(`DELETE FROM ??? WHERE course_id = ? AND student_id = ?`, [table, courseID, studentID]);
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

                  async getCoursesForAStudent(table,studentID){
                    let con = await dbConnection();
                    try {
                      await con.query("START TRANSACTION");
                      let result = await con.query('SELECT * FROM ?? WHERE student_id = ?', [table, studentID]);
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


                  async getCoursesByFaculty(table,facultyID){
                    let con = await dbConnection();
                    try {
                      await con.query("START TRANSACTION");
                      let result = await con.query('SELECT * FROM ?? WHERE faculty_id = ?', [table, facultyID]);
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

                  async getStudentsForACourse(courseID){
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
                
}