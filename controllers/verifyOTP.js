const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();

exports.verifyOtp = async (req, res, next) => {
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

            let [getOtp] = await conn.execute('SELECT OTP FROM users WHERE id = ?',
                  [decoded.id]);

            getOtp = getOtp[0].OTP;

            if (getOtp == "") {
                  res.status(422).json({
                        message: "you are already verified"
                  })
            };

            if (getOtp == '0') {
                  res.status(422).json({
                        message: "Please generate otp"
                  })
            };
            // console.log(getOtp);

            const token = getOtp;

            const isTokenExpired = token => Date.now() >= (JSON.parse(atob(token.split('.')[1]))).exp * 1000

            if (isTokenExpired(token) == true) {

                  return res.json({
                        message: "OTP Expired! Please try again"
                  })
            }

            otp = req.body.giveotp;
            // console.log(otp);

            const otpdecoded = jwt.verify(getOtp, 'the-super-strong-secrect');


            // const passMatch = await bcrypt.compare(otp, getOtp);
            if (otpdecoded.OTP !== otp) {
                  return res.status(422).json({
                        message: "Incorrect otp",
                  });
            }

            else {
                  conn.execute('UPDATE users SET status = 1, OTP = "" WHERE id=?',
                        [decoded.id]);
                  return res.status(201).json({
                        message: " Verified ",
                  })
            }


      } catch (err) {
            next(err);
      }
}