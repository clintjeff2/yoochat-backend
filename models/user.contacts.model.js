const mongoose = require('mongoose');

const userContactSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		require: [true, 'A user must own a contact list'],
	},
	contacts: [
		{
			user: {
				type: mongoose.Types.ObjectId,
				ref: 'User',
				require: [true, 'Users should be added to a contact list'],
			},
			dateAdded: {
				type: Date,
				default: new Date(Date.now()),
			},
		},
	],
});

const UserContacts = mongoose.model('User_Contact', userContactSchema);
