const express = require('express');
const messageUserController = require('./../controllers/messages.users.controller');
const authController = require('./../controllers/auth.controller');

const router = express.Router();

//ensure every user is logged in and protected
router.use(authController.protect);

router
	.route('/:receiverID')
	.get(messageUserController.getUserMessages)
	.post(messageUserController.sendUserMessage);

router.route('/:messageID').delete(messageUserController.deleteMessageTemp);

router.get(
	'/admin/:messageID',
	authController.restrictTo('admin'),
	messageUserController.getMessage
);


router.get(
	'/',
	authController.restrictTo('admin'),
	messageUserController.getAllMessages
);


router.delete(
	'/delete/:messageID',
	authController.restrictTo('admin'),
	messageUserController.discardMessage
);

module.exports = router;
