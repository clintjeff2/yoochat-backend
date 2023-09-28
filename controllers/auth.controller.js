const catchAsync = require('./../utilities/catchAsync');
const ErrorApi = require('./../utilities/ErrorApi');
const {
	createToken,
	verifyToken,
} = require('./../utilities/createVerifyToken');
const sendResponse = require('./../utilities/sendResponse');
const User = require('./../models/user.model');

exports.signUp = catchAsync(async (req, res, next) => {
	const { username, email, password, confirmPassword, photo } = req.body;

	//create user
	const user = await User.create({
		username,
		email,
		password,
		confirmPassword,
		photo,
	});

	//create token
	const token = await createToken(user._id);
	const data = {
		message: 'Signup Completed!',
		data: {
			user: user.username,
			email: user.email,
			photo: user.photo,
			token,
		},
	};

	//send response
	sendResponse(res, 'Success', 201, data);
});

exports.logIn = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	//Check that email and password are provided
	if (!email || !password)
		return next(new ErrorApi('Email and password must be provided', 400));

	const user = await User.findOne({ email }).select('+password');

	//check that user was found
	if (!user)
		return next(
			new ErrorApi('User not found, incorrect details provided', 404)
		);

	const isCorrect = await user.checkPasswordLogin(user.password, password);

	//check if passwords match
	if (!isCorrect)
		return next(
			new ErrorApi(
				'Passwords do not match, please try again with correct details',
				401
			)
		);

	//create token
	const token = await createToken(user._id);
	const data = {
		user: user.username,
		email: user.email,
		photo: user.photo,
		token,
	};

	sendResponse(res, 'success', 200, data);
});

exports.protect = catchAsync(async (req, res, next) => {
	//Get token
	const { headers } = req;
	const token = headers.authorization.split(' ')[1];

	//Check for validity of token
	const tokenInfo = await verifyToken(token);

	console.log(tokenInfo);
	const user = await User.findById(tokenInfo._id);

	if(user)
		req.user = user;

	next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
	//Get email
	const { email } = req.body;

	//Find user
	const user = await User.findOne({ email });

	//check if user EXIST
	if (!user) return next(new ErrorApi('No user found with this email', 404));

	//send email with link to reset password
	//IMPLEMENT SENDING EMAIL LATER ON
	const resetToken = await user.createResetToken();
	const data = {
		message: 'Reset link sent to your email',
		notice: 'Link is only valid for 10 minutes',
		link: `${req.protocol}://${req.hostname}:${process.env.PORT}/api/v1/user/reset-password/${resetToken}`,
	};
	sendResponse(res, 'success', 200, data);
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	//Get user based on password reset token;
	const passwordResetToken = req.params.resetToken;
	const user = await User.findOne({ passwordResetToken });
	if (!user)
		return next(
			new ErrorApi(
				'Invalid reset link, please request for new link in forgot password',
				403
			)
		);

	//Do the following ONLY if resetToken is still valid
	//Get new password and save in db, also reset token and token-time-of-issue
	const isTokenExpired = user.hasResetTokenExpired();

	if (isTokenExpired)
		return next(
			new ErrorApi('Its been 10 minutes, reset link has expired', 403)
		);

	const { password, confirmPassword } = req.body;
	user.password = password;
	user.confirmPassword = confirmPassword;
	user.passwordResetToken = null;
	user.tokenIssuedAt = null;

	await user.save();

	//Generate new JWTtoken
	const token = await createToken({ _id: user._id });
	const data = {
		message: 'Password reset successfully',
		token,
	};
	sendResponse(res, 'Success', 200, data);
});
