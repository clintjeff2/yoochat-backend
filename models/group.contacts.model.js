const mongoose = require('mongoose');

const groupContactSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		require: [true, 'A user must own a group contact list'],
	},
	contacts: [
		{
			group: {
				type: mongoose.Types.ObjectId,
				ref: 'Group',
				require: [true, 'Users should be added to a group contact list'],
			},
			dateAdded: {
				type: Date,
				default: new Date(Date.now()),
			},
		},
	],
});

const UserContacts = mongoose.model('User_Contact', userContactSchema);
