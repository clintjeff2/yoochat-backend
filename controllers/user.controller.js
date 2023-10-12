const User = require('./../models/user.model');
const catchAsync = require('./../utilities/catchAsync');
const sendResponse = require('./../utilities/sendResponse');
const ErrorApi = require('./../utilities/ErrorApi');
const multer = require('multer');
const fs = require('fs');

//Get all users BY APPLICATION super_admin
exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find({});

	sendResponse(res, 'success', 200, users);
});

//update user without picture
exports.updateUser = catchAsync(async (req, res, next) => {
	const id = req.user._id;
	const { username, email } = req.body;

	const data = {};
	if (username) data.username = username;
	if (email) data.email = email;

	if (!username && !email)
		return next(new ErrorApi('Provide username to update or email', 400));

	const user = await User.findByIdAndUpdate(id, data, {
		returnOriginal: false,
		runValidators: true,
	});

	//create and send token here

	sendResponse(res, 'success', 200, user);
});

//update password
exports.updatePassword = catchAsync(async (req, res, next) => {
	const id = req.user._id;
	const { password, oldPassword, confirmPassword } = req.body;

	//check if password exist
	if (!password || !oldPassword || !confirmPassword)
		return next(
			new ErrorApi(
				'Provide old and new password with confirmation to update',
				400
			)
		);

	//Get current user and check if old and new passwords match
	const curUser = await User.findById(`${id}`).select('+password');

	const isPasswordSame = await curUser.checkPasswordLogin(
		curUser.password,
		oldPassword
	);

	if (!isPasswordSame)
		return next(new ErrorApi('Your new password do not match the old'));

	curUser.password = password;
	curUser.confirmPassword = confirmPassword;
	
	const user = await curUser.save();
	sendResponse(res, 'success', 200, user);
});

//UPLOADING PROFILE PICTURE
//creating disk storage information
const multerStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		const dirName = `uploads/Yoochat Users/${req.user._id}/profile`;

		const createDirName = async () => {
			await fs.mkdir(dirName, { recursive: true }, (err) => {
				if (err) console.log(err);

				callback(null, dirName);
			});
		};

		createDirName();
	},
	filename: (req, file, callback) => {
		const fileName = `${req.user.username}-${Date.now()}-profile_pic.png`;
		req.filename = fileName;

		callback(null, fileName);
	},
});

//creating file filter
const multerFilter = (req, file, callback) => {
	console.log(file, 'UPLOADING');

	callback(null, true);
};

//upload middleware
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadProfilePicMiddleware = upload.single('photo');

//update picture
exports.updateProfilePic = catchAsync(async (req, res, next) => {
	const id = req.user._id;
	const { filename } = req;

	const user = await User.findByIdAndUpdate(
		id,
		{ photo: filename },
		{
			new: true,
			runValidators: false,
		}
	);

	sendResponse(res, 'success', 200, user);
});

//Delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
	const id = req.user._id;
	const user = await User.findByIdAndUpdate(
		id,
		{ active: false },
		{
			new: true,
			runValidators: false,
		}
	);

	sendResponse(res, 'success', 204, [null]);
});

//Get specific user
exports.getUser = catchAsync(async (req, res, next) => {
	const id = req.user._id;

	const user = await User.findById(id);

	if (!user) return next(new ErrorApi('No such user found', 404));
	sendResponse(res, 'success', 200, user);
});
