const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: [4, 'Group name should be a minimum of 4 characters'],
		required: [true, 'A group must have a name'],
	},
	creator: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: [true, 'A group must be created by a user'],
	},
	users: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: [true, 'A group must have users'],
		},
	],
	admins: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
	],
	photo: String,
	description: String,
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
