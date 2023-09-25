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
	group: {
		type: mongoose.Types.ObjectId,
		ref: 'Group',
		default: null,
		validate: {
			validator: function (val) {
				const legit = val || this.receiver ? true : false;
        return legit;
			},
			message: 'A message must be sent to a group or to a receiving individual',
		},
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

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;