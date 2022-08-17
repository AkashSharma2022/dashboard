const router = require('express').Router();
const { body } = require('express-validator');
const { register } = require('./controllers/registerController');
const { login } = require('./controllers/loginController');
const { getUser } = require('./controllers/getUserController');
const { step1 } = require('./controllers/step1controller');
const { step2 } = require('./controllers/step2controller');
const { getCourses } = require('./controllers/getAllCourses');
const { step3 } = require('./controllers/step3controller');
const { adminLogin } = require('./controllers/adminLoginController');
const { getAllUsers } = require('./controllers/adminController');
const sendOtpMail = require('./controllers/sendOTPcontroller');
const {verifyOtp }= require('./controllers/verifyOTP');
const { makePost } = require('./controllers/makePost');
const { getPost } = require('./controllers/getPost');
const { pagination } = require('./controllers/paginationController');





router.post('/register', [
      body('name', "The name must be of minimum 3 characters length")
            .notEmpty()
            .escape()
            .trim()
            .isLength({ min: 3 }),
      body('email', "Invalid email address")
            .notEmpty()
            .escape()
            .trim().isEmail(),
      body('password', "The Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 }),

      body('phone', "Please provide 10 digit phone number")
            .notEmpty()
            .escape()
            .trim()
            .isLength({ min: 10 }),
], register);


router.post('/login', [
      body('email', "Invalid email address")
            .escape()
            .trim(),
      body('phone', "Invalid phone")
            .escape()
            .trim(),
      body('password', "The Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 }),
], login);

router.get('/getuser', getUser);

router.put('/step1', [
      body('age', "Invalid age").notEmpty().trim().isNumeric(),
      body('gender', "Invalid gender")
            .notEmpty().trim().escape(),
], step1);

router.put('/step2', [
      body('address', "must be of minimum 3 of length")
            .notEmpty()
            .escape()
            .trim().isLength({ min: 3 }),

], step2);

router.get('/getCourses', getCourses);

router.put('/step3', [
      body('course', "please select a valid course")
            .isEmpty()
            .escape()
            .trim()
],
      step3);

router.post('/adminLogin', [
      body('email', "Invalid email address")
            .escape()
            .trim(),
      body('password', "The Password must be of minimum 4 characters length")
            .notEmpty()
            .trim()
            .isLength({ min: 4 }),
], adminLogin);

router.get('/getAllUsers', getAllUsers);

router.post('/sendOtp', sendOtpMail.sendOtpMail)


router.post('/verify',[
      body('giveotp', "Otp does not matched")
            // .isEmpty()
            // .escape()
            // .trim()
            // .isNumeric()
],
verifyOtp);

router.post('/post', [
      body('post', "Please enter in correct format")
      .notEmpty()
      .trim()
      .isLength({ min: 4 }),
], makePost);

router.get('/getPost', getPost );

router.get("/pagination:page", pagination);


module.exports = router;