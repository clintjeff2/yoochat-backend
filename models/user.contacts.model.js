const mongoose = require('mongoose');

const userContactSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: [true, 'A user must own a contact list'],
		unique: [
			true,
			'Already exist, each user only has a single contact card for all their contacts',
		],
	},
	contacts: [
		{
			user: {
				type: mongoose.Types.ObjectId,
				ref: 'User',
				required: [true, 'Users should be added to a contact list'],
				// unique: [
				// 	true,
				// 	'Cannot add a contact that already exist in the contact card',
				// ],
			},
			dateAdded: {
				type: Date,
				default: new Date(Date.now()),
			},
			contactName: String,
		},
	],
});

//Query middleware to populate users on userContactSchema, also set contactName to user.username if contactName is void
userContactSchema.pre('find', function (next) {
	this.populate({ path: 'contacts.user', select: '_id username photo' });
	// if(!this.contacts.contactName) this.contacts.contactName =

	next();
});


const UserContacts = mongoose.model('User_Contact', userContactSchema);
module.exports = UserContacts;
