const express = require('express');
const userController = require('./../controllers/user.controller');
const authController = require('./../controllers/auth.controller');
const router = express.Router();

//protect all routes to ensure user is authenticated
// router.use(authController.protect);

router.route('/login').post(authController.logIn);
router.route('/signup').post(authController.signUp);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:resetToken').post(authController.resetPassword);

//protect all routes to ensure user is authenticated
router.use(authController.protect);

router.get('/', userController.getUser);

router.route('/logout').post(authController.logout);

router.patch('/update-user', userController.updateUser);

router.patch('/update-password', userController.updatePassword);

router.patch('/delete-user', userController.deleteUser);

router.patch(
	'/upload-photo',
	userController.uploadProfilePicMiddleware,
	userController.updateProfilePic
);

router.get(
	'/all',
	authController.restrictTo('admin', 'super_admin'),
	userController.getAllUsers
);

module.exports = router;
