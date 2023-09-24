const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		require: [true, 'username name is compulsary'],
		minlength: [4, 'username must be atleast 4 characters'],
		unique: [true, 'user already exist with this name'],
	},
	email: {
		type: String,
		require: [true, 'A user must have an email'],
		unique: [true, 'User already exist with this email'],
		validate: [validator.isEmail, 'Invalid email provided'],
	},
	password: {
		type: String,
		require: [true, 'user must provide a password'],
		minlength: [8, 'password must be atleast 8 characters'],
	},
	confirmPassword: {
		type: String,
		require: [true, 'must provide password confirmation'],
		validate: {
			validator: function (val) {
				return val === this.password;
			},
			message: 'Passwords do not match, please try again',
		},
	},
	photo: String,
});

const User = mongoose.model('User', userSchema);