const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();
const nodemailer = require('./nodeMailer');


let OTP = () => {
      let numbers = "0123456789";
      let OTP = "";
      for (let i = 0; i < 4; i++) {
            OTP += numbers[Math.floor(Math.random() * 10)];
      }
      return OTP;
};



exports.sendOtpMail = async (req, res, next) => {
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

            const [stepMail] = await conn.execute('SELECT step, email FROM users WHERE id = ?',
                  [decoded.id],
            );
            console.log(stepMail[0].email);
            let theOTP = OTP();
            console.log(theOTP);
            const step = stepMail[0].step;

            // const hashPass = await bcrypt.hash(theOTP, 12);
            // console.log(hashPass);


            const otpToken = jwt.sign({ OTP : theOTP }, 'the-super-strong-secrect', { expiresIn: '60000s' });



            if (step == 0) {
                  nodemailer.sendOTP(theOTP, stepMail[0].email);

                  conn.execute('UPDATE users SET OTP = ? WHERE id= ?',
                        [otpToken, decoded.id])

                  return res.status(201).json({
                        message: "OTP sent successfully.",
                  });
            } else {

                  return res.status(422).json({
                        message: "Please complete all the steps first",
                  });

            }

      } catch (err) {
            next(err);
      }
}