const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();


exports.step1 = async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
      }

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
            // console.log(step[0].step);
            const step1 = step[0].step;

            if (step1 == 0) {
                  return res.status(422).json({
                        message: "You have completed your profile",
                  });
            }
            if (step1 == 1) {
                  const [rows] = await conn.execute('UPDATE users SET age=?, gender=?, step = 2 WHERE id=?', [
                        req.body.age,
                        req.body.gender,
                        decoded.id
                  ]);

                  if (rows.affectedRows === 1) {
                        return res.status(201).json({
                              message: "Age, Gender updated successfully .",
                        });
                  }
            } else {
                  return res.status(422).json({
                        message: "You have already completed this step plase go to step 2",
                  });
            }

      } catch (err) {
            next(err);
      }
}