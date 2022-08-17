const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();

exports.getCourses = async (req, res, next) => {

      try {

            if (
                  !req.headers.authorization ||
                  !req.headers.authorization.startsWith('Bearer') ||
                  !req.headers.authorization.split(' ')[1]
            ) {
                  return res.status(422).json({
                        message: "Please provide the token",
                  });
            }

            const theToken = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(theToken, 'the-super-strong-secrect');

            const getAllCourses = await conn.execute(
                  "SELECT * FROM education",
            );

            if (getAllCourses.length > 0) {
                  return res.json({
                        user: getAllCourses[0]
                  });
            }

            res.json({
                  message: "Course not found"
            });

            
      }
      catch (err) {
            next(err);
      }
}