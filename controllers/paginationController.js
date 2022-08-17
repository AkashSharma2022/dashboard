const jwt = require("jsonwebtoken");
const conn = require("../dbConnection").promise();

exports.pagination = async (req, res, next) => {
      try {
            if (
                  !req.headers.authorization ||
                  !req.headers.authorization.startsWith("Bearer") ||
                  !req.headers.authorization.split(" ")[1]
            ) {
                  return res.status(422).json({
                        message: "Please provide the token",
                  });
            }
            const theToken = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(theToken, "the-super-strong-secrect");
            const [row] = await conn.execute("SELECT * FROM `users` WHERE `id`=?", [
                  decoded.id,
            ]);
            // console.log(row);
            let limit = 2;
            let page_Number = req.params.page;
            console.log(page_Number);

            let offset_value = (page_Number - 1) * limit;
            console.log(offset_value);

            // "select * from Products limit "+limit+" OFFSET "+offset

            const [allusers] = await conn.execute(
                  "select * from users LIMIT " + limit + " OFFSET " + offset_value
            );
            // console.log(allusers);

            const [userOnBoard] = await conn.execute(
                  "SELECT COUNT(*) FROM users WHERE step=0 AND userType='user'"
            );
            const [userPending] = await conn.execute(
                  "SELECT COUNT(*) FROM users WHERE NOT step = 0"
            );
            const [countTotal] = await conn.execute("SELECT COUNT(*) FROM users WHERE userType = 'user'");
            // console.log(Object.values(userPending[0])[0]);
            // delete row[0].password; //for showing user details without password
            // console.log(userOnBoard, userPending);
            if(row[0].userType === 'admin'){

                  return res.json({
                        Total_Users: Object.values(countTotal[0])[0],
                        User_Onboard: Object.values(userOnBoard[0])[0],
                        incomplete_Users: Object.values(userPending[0])[0],
                        All_Users_Details: [allusers][0],
                  });
            } 
            else {
                  return res.status(422).json({
                        message: "You are not an admin"
                  })
            };
            
            
      } catch (err) {
            next(err);
      }
};