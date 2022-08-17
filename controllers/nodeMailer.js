const nodemailer = require('nodemailer');

exports.sendOTP = (genOTP, email) => {
      let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                  user: "akash.sharma@appventurez.com",
                  pass: "akash@6162",
            },
      });
      let mailOptions = {
            from: "From appventurez the OTP is: ",
            to: email,
            subject: "OTP verification",
            text: "From appventurez the OTP is: " + genOTP
      };
      transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                  console.log(error);
            } else {
                  console.log("Email sent: ");
            }
      });
};

// sendOTP(OTP(),"akk6928@gmail.com");

