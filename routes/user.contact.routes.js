const express = require('express');
const authController = require('./../controllers/auth.controller');
const {
	createAddContact,
	getContacts,
	updateContactName,
	deleteUserContact,
	getAllContacts,
} = require('./../controllers/user.contacts.controller');

const router = express.Router();

router
	.route('/')
	.get(authController.protect, getContacts)
	.post(authController.protect, createAddContact);

router
	.route('/:contactID')
	.patch(authController.protect, updateContactName)
	.delete(authController.protect, deleteUserContact);

router
	.route('/all')
	.get(
		authController.protect,
		authController.restrictTo('admin', 'super_admin'),
		getAllContacts
	);
module.exports = router;
