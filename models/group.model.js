const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: [4, 'Group name should be a minimum of 4 characters'],
		required: [true, 'A group must have a name'],
	},
	admin: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: [true, 'A group must be created by a user'],
	},
	photo: String,
});

const Group = mongoose.model('Group', groupSchema);
