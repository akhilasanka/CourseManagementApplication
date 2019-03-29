/*const crypto = require('crypto');

encryptPassword = (inputpassword) => {
   let sha = crypto.createHash('sha1');
    console.log(sha.update(inputpassword));
    let encryptedPassword = sha.digest('hex');
    console.log(encryptPassword);
}

console.log(encryptPassword("abc"));

//module.exports = encryptPassword;*/

var sha1 = require('sha1');
 
console.log(sha1("message"));