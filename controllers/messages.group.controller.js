const MessageGroups = require('./../models/messages.groups.model');
const ErrorApi = require('./../utilities/ErrorApi');
const sendResponse = require('./../utilities/sendResponse');
const catchAsync = require('./../utilities/catchAsync');

//Send message to a group
exports.sendGroupMessage = catchAsync(async (req, res, next) => {
	const { message } = req.body;
	const { groupID } = req.params;

	const data = {
		sender: req.user._id,
		group: groupID,
		message,
	};

	const groupMessage = await MessageGroups.create(data);

	sendResponse(res, 'success', 201, groupMessage);
});

//Read messages from a group
exports.getGroupMessages = catchAsync(async (req, res, next) => {
	const { groupID } = req.params;

	const messages = await MessageGroups.find({ group: groupID });

	sendResponse(res, 'success', 200, messages);
});

//Delete messages from a group
exports.deleteGroupMessage = catchAsync(async (req, res, next) => {
	const { messageID } = req.params;

	const updateMessage = await MessageGroups.findByIdAndUpdate(
		messageID,
		{ isDeleted: true },
		{ returnOriginal: false, runValidators: true }
	);

	sendResponse(res, 'success', 200, updateMessage);
});

//Permanently deletion of messages from group || Groups
exports.discardGroupMessage = catchAsync(async (req, res, next) => {
	const { messageID } = req.params;

	const updateMessage = await MessageGroups.findByIdAndDelete(messageID);

	sendResponse(res, 'success', 204, updateMessage);
});

//Get messages from all groups || Admins
exports.getAllGroupMessages = catchAsync(async (req, res, next) => {
	const messages = await MessageGroups.find({});

	sendResponse(res, 'success', 200, messages);
});
