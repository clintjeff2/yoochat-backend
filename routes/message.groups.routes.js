const express = require('express');
const messageGroupController = require('./../controllers/messages.group.controller');
const authController = require('./../controllers/auth.controller');
const authGroupController = require('./../controllers/auth.group.controller');

const router = express.Router();

//ensure every user is logged in and protected
router.use(authController.protect);

router.get(
	'/',
	authController.restrictTo('admin'),
	messageGroupController.getAllGroupMessages
);

//ensure every user interacting with a group is part of that group
// router.use(authGroupController.protect);

router
	.route('/:groupID')
	.get(authGroupController.protect, messageGroupController.getGroupMessages)
	.post(authGroupController.protect, messageGroupController.sendGroupMessage);

//delete temporarily
router.delete(
	'/:messageID',
	authGroupController.protectDeleteMessage,
	messageGroupController.deleteGroupMessage
);

//permanent delete
router.delete(
	'/delete/:messageID',
	authController.restrictTo('admin'),
	messageGroupController.discardGroupMessage
);

module.exports = router;
