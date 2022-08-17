const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();


exports.makePost = async (req, res, next) => {
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
                  conn.execute('INSERT INTO posts(id, email, name, post) VALUES (?, ?, ?, ?)', [
                        step[0].id,
                        step[0].email,
                        step[0].name,
                        req.body.post
                  ]);

                  if (1) {
                        return res.status(201).json({
                              message: "Post created.",
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