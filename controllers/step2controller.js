const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { step1 } = require('./step1controller');
const conn = require('../dbConnection').promise();

exports.step2 = async (req, res, next) => {
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
            if (step1 == 3) {
                  return res.status(422).json({
                        message: "You have completed this step",
                  });
            }
            if (step1 == 2) {
                  const [rows] = await conn.execute('UPDATE users SET address=?, step = 3 WHERE id=?', [
                        req.body.address,
                        decoded.id
                  ]);

                  if (rows.affectedRows == 1) {
                        return res.status(201).json({
                              message: "Data updated successfully .",
                        });
                  }
            } else {
                  return res.status(422).json({
                        message: "Plese complete step 1 first",
                  });
            }




      } catch (err) {
            next(err);
      }
}