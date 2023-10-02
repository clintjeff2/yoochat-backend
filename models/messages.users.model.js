const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: [true, 'A message must be sent by someone'],
		minlength: [1, 'A message must be atleast a character'],
	},
	receiver: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		default: null,
	},
	message: {
		type: String,
		required: [true, 'Cannot send empty text'],
	},
	timeDate: {
		type: Date,
		default: new Date(Date.now()),
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
});

const MessageUsers = mongoose.model('Messages_Users', messageSchema);

module.exports = Message;
