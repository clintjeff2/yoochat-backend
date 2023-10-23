const mongoose = require('mongoose');

const userMediaSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	receiver: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	files: [
		{
			name: {
				type: String,
				required: [true, 'file must be named'],
			},
			size: Number,
			format: String,
		},
	],
	timeDate: {
		type: Date,
		default: new Date(Date.now()),
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
});

const UserMedia = mongoose.model('user_media', userMediaSchema);
module.exports = UserMedia;
