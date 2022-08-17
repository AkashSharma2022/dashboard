const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();


exports.getPost = async (req, res, next) => {
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


            const [step] = await conn.execute('SELECT id, email, name, step FROM users WHERE id = ?',
                  [decoded.id],
            );
            // console.log(step[0]);
            const step1 = step[0].step;

            if (step1 == 0) {
                  [rows] = await conn.execute('SELECT name, post FROM posts WHERE name = ?',
                  [step[0].name]);
                  console.log(rows[0].name);

                  if (1) {
                        return res.status(201).json({
                              message: rows,
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