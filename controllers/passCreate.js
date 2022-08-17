const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);

let adminpassword = bcrypt.hashSync("akash@123", salt);
console.log(adminpassword);