const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();

exports.getAllUsers = async (req, res, next) => {

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

            const [userType] = await conn.execute('SELECT userType FROM users WHERE id = ?',
                  [decoded.id],
            );

            const userType1 = userType[0].userType;

            if (userType1 == "admin") {

                  const [row] = await conn.execute(
                        "SELECT `id`,`name`,`email`, age, gender, address, eduID, step, userType FROM `users`",
                  );










                  if (row.length > 0) {
                        return res.json({
                              user: row
                        });
                  }






                  const page = parseInt(req.query.page);
                  const limit = parseInt(req.query.limit);

                  // calculating the starting and ending index
                  const startIndex = (page - 1) * limit;
                  const endIndex = page * limit;

                  const results = {};
                  if (endIndex < model.length) {
                        results.next = {
                              page: page + 1,
                              limit: limit
                        };
                  }

                  if (startIndex > 0) {
                        results.previous = {
                              page: page - 1,
                              limit: limit
                        };
                  }

                  results.results = model.slice(startIndex, endIndex);

                  res.paginatedResults = results;






            } else {
                  res.json({
                        message: "You are not admin"
                  });
            }

            res.json({
                  message: "No user found"
            });

      }
      catch (err) {
            next(err);
      }
}