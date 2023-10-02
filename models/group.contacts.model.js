const mongoose = require('mongoose');

const groupContactSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: [true, 'A user must own a group contact list'],
	},
	contacts: [
		{
			group: {
				type: mongoose.Types.ObjectId,
				ref: 'Group',
				required: [true, 'Users should be added to a group contact list'],
			},
			dateAdded: {
				type: Date,
				default: new Date(Date.now()),
			},
		},
	],
});

//Select a user and all his groups

const GroupContacts = mongoose.model('Group_Contact', groupContactSchema);
module.exports = GroupContacts;
