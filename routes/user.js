const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');

// user login route
router.post('/login',userController.login);

// user register route
router.post('/register',userController.register);

// api for forget password
router.post('/forgotPassword',userController.forgotPassword);

// api for reset password
router.post('/resetPassword/:id/:token',userController.resetPassword);

module.exports = router;