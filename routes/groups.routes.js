const express = require('express');
const groupController = require('./../controllers/group.controller');
const authController = require('./../controllers/auth.controller');

const router = express.Router();

//Protect all group routes
router.use(authController.protect);

router
	.route('/')
	.get(authController.restrictTo('admin'), groupController.getAllGroups)
	.post(groupController.createGroup);
router
	.route('/:groupID')
	.get(groupController.getGroup)
	.patch(groupController.groupProtectAdmin, groupController.updateGroup)
	.delete(groupController.groupProtectCreator, groupController.deleteGroup);

router
	.route('/:groupID/add-admin')
	.patch(groupController.groupProtectCreator, groupController.addGroupAdmin);
router
	.route('/:groupID/remove-admin')
	.patch(groupController.groupProtectCreator, groupController.removeGroupAdmin);
router
	.route('/:groupID/add-user')
	.patch(groupController.groupProtectAdmin, groupController.addGroupUser);
router
	.route('/:groupID/remove-user')
	.patch(groupController.groupProtectAdmin, groupController.removeGroupUser);

// router.route('/all');

module.exports = router;
