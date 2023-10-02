const express = require('express');
const groupController = require('./../controllers/group.controller');
const authController = require('./../controllers/auth.controller');

const router = express.Router();

// router.use(authController.protect);

router
	.route('/')
	.get(groupController.getGroup)
	.post(groupController.createGroup);
router
	.route('/:id')
	.patch(groupController.updateGroup)
	.delete(groupController.deleteGroup);

module.exports = router;
