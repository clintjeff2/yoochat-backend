const MessageUsers = require('./../models/messages.users.model');
const sendResponse = require('./../utilities/sendResponse');
const ErrorApi = require('./../utilities/ErrorApi');
const catchAsync = require('./../utilities/catchAsync');

//Send a message to particular person|| Create a message
exports.sendUserMessage = catchAsync(async (req, res, next) => {
	//Getting receiver info (id) etc
	const { message } = req.body;
	const receiver = req.params.receiverID;
	const sender = req.user._id;

	if (!receiver || !message) {
		return next(new ErrorApi('Receiver details or message not provided', 400));
	}

	const info = await MessageUsers.create({ sender, receiver, message });

	sendResponse(res, 'success', 201, info);
});

//Get a message (any message from anywhere)
exports.getMessage = catchAsync(async (req, res, next) => {
	const id = req.params.messageID;

	const message = await MessageUsers.findById(id);

	if (!message) return next(new ErrorApi('Message not found', 404));

	sendResponse(res, 'success', 200, message);
});

//Get all messages
exports.getAllMessages = catchAsync(async (req, res, next) => {
	let messages = await MessageUsers.find({});

	if (messages.length === 0) messages = [];

	sendResponse(res, 'success', 200, messages);
});

//Get all messages from a particular person
exports.getUserMessages = catchAsync(async (req, res, next) => {
	const userID = req.params.receiverID;

	let messages = await MessageUsers.find({ receiver: userID });

	if (messages.length === 0) messages = [];

	sendResponse(res, 'success', 200, messages);
});

//Delete a message
exports.deleteMessageTemp = catchAsync(async (req, res, next) => {
	const id = req.params.messageID;

	const message = await MessageUsers.findByIdAndUpdate(
		id,
		{ isDeleted: true },
		{ runValidators: true, new: true }
	);

	if (!message) return next(new ErrorApi('message not found', 404));

	sendResponse(res, 'success', 200, message);
});

//Discard a message
exports.discardMessage = catchAsync(async (req, res, next) => {
	const id = req.params.messageID;

	const message = await MessageUsers.findByIdAndDelete(id);

	// if (!message) return next(new ErrorApi('message not found', 404));

	sendResponse(res, 'success', 204, message);
});

//Send a message to every user
// exports.broadcastMessage = catchAsync(async (req, res, next) => {
//   const {users} = req.body;
// })
//IMPLEMENT A BROADCAST TO ALL USERS
