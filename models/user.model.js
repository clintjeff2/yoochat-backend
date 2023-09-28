const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'username name is compulsary'],
		minlength: [4, 'username must be atleast 4 characters'],
		unique: [true, 'user already exist with this name'],
	},
	email: {
		type: String,
		required: [true, 'A user must have an email'],
		unique: [true, 'User already exist with this email'],
		validate: [validator.isEmail, 'Invalid email provided'],
	},
	password: {
		type: String,
		required: [true, 'user must provide a password'],
		minlength: [8, 'password must be atleast 8 characters'],
		select: false,
	},
	confirmPassword: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			validator: function (val) {
				return val === this.password;
			},
			message: 'Passwords do not match, please try again',
		},
		select: false,
	},
	photo: String,
	role: {
		type: String,
		default: 'user',
		enum: {
			values: ['user', 'admin'],
			message: 'Role must be user or admin',
		},
	},
	passwordResetToken: {
		type: String,
		default: null,
	},
	tokenIssuedAt: {
		type: Date,
		default: null,
	},
	createdAt: {
		type: Date,
		default: new Date(Date.now()),
	},
	active: {
		type: Boolean,
		default: true,
	},
});

//pre document middleware to encrypt password
userSchema.pre('save', async function (next) {
	if (this.isModified('password') || this.isNew) {
		const hash = await bcrypt.hash(this.password, 12);

		this.password = `${hash}`;
		this.confirmPassword = undefined;
	}

	next();
});

//instance method to check for password correctness
userSchema.methods.checkPasswordLogin = async function (
	dbPassword,
	currPassword
) {
	const isCorrect = await bcrypt.compare(currPassword, dbPassword);
	return isCorrect;
};

userSchema.methods.createResetToken = async function () {
	//generate password reset token
	const token = await crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = token;
	this.tokenIssuedAt = new Date(Date.now());

	//save document
	await this.save();
	return token;
};

userSchema.methods.hasResetTokenExpired = function () {
	const timeDifference = Date.now() - this.tokenIssuedAt.getTime();
	// console.log(this.tokenIssuedAt.getTime(), Date.now(), timeDifference);

	if (timeDifference > 10 * 60 * 1000) return true;

	return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
