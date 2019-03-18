const dbConnection = require('./dbConnectionPool');


module.exports = class LoginSignupDao {
    async login(table,username,password) {
        let con = await dbConnection();
        try {
            await con.query("START TRANSACTION");
            let result = await con.query('SELECT * FROM ?? WHERE email = ? AND password = ?', [table, username, password]);
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

    async checkIfUserExists(table,id){
        let con = await dbConnection();
        try {
            await con.query("START TRANSACTION");
            let result = await con.query('SELECT * FROM ?? WHERE id = ?', [table, id]);
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

    async createNewUser(table,inputData){
        let con = await dbConnection();
        try {
            await con.query("START TRANSACTION");
            let savedUser = await con.query('INSERT INTO ?? SET ?', [table, inputData]);
            await con.query("COMMIT");
            inputData.id = savedUser.insertId;
            console.log(inputData);
            return inputData;
          } catch (ex) {
            console.log(ex);
            await con.query("ROLLBACK");
            console.log(ex);
            throw ex;
          } finally {
            await con.release();
            await con.destroy();
          }
    }


    async updateUser(table,id,inputData){
      let con = await dbConnection();
        try {
            await con.query("START TRANSACTION");
            await con.query(`UPDATE ?? SET name = ?, img = ?, phonenumber = ?, country = ?,
school= ?, hometown= ?, languages = ?, gender = ? WHERE id = ?`,[
      table,
      inputData.name,
			inputData.img,
			inputData.phonenumber,
			inputData.country,
			inputData.school,
			inputData.hometown,
			inputData.languages,
      inputData.gender,
      id
			]);
            await con.query("COMMIT");
            console.log(inputData);
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

    async addProfilePic(role, id, filename) {
      let con = await dbConnection();
      try {
        await con.query("START TRANSACTION");
        await con.query(`UPDATE ?? SET img = ? WHERE id = ?`, [
            role,
            filename,
            id
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

    async getProfilepic(table,id){
      let con = await dbConnection();
      try {
          await con.query("START TRANSACTION");
          let result = await con.query('SELECT img FROM ?? WHERE id = ?', [table, id]);
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

      async checkIfEmailExists(table,email){
        let con = await dbConnection();
        try {
            await con.query("START TRANSACTION");
            let result = await con.query('SELECT * FROM ?? WHERE email = ?', [table, email]);
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