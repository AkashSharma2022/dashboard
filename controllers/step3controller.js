const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();

exports.step3 = async (req, res, next) => {

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

            const [step] = await conn.execute('SELECT step FROM users WHERE id = ?',
                  [decoded.id],
            );
            const step1 = step[0].step;

            if (step1 == 0) {
                  return res.status(422).json({
                        message: "You have completed your profile",
                  });
            }
            if (step1 == 1) {

                  // select id of courses from education table 
                  const [eduId] = await conn.execute(
                        "SELECT id FROM education WHERE course = ?",
                        [req.body.course]
                  ); res.status(200).json({
                        message: "data updated successfully"
                  })


                  // insert course id in users table
                  const updateUsers = await conn.execute(
                        `UPDATE users SET eduID = ?, step = 0 WHERE id = ?`,
                        [eduId[0].id, decoded.id]
                  );

                  if (updateUsers.length > 0) {
                        return res.json({
                              users: updateUsers[0].info
                        });
                  }

            } else {
                  return res.status(422).json({
                        message: "Plese complete step 2 first",
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