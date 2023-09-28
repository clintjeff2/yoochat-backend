const express = require('express');
const userController = require('./../controllers/user.controller');
const authController = require('./../controllers/auth.controller');
const router = express.Router();

router.route('/login').post(authController.logIn);
router.route('/signup').post(authController.signUp);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:resetToken').post(authController.resetPassword);

router.route('/').get(authController.protect, (req, res, next) => {
	res.status(200).send('<h2>This is finally a response</h2>');
});

module.exports = router;
