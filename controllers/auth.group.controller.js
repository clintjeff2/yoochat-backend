const Group = require('./../models/group.model');
const MessageGroups = require('./../models/messages.groups.model');
const catchAsync = require('./../utilities/catchAsync');
const ErrorApi = require('./../utilities/ErrorApi');

exports.protect = catchAsync(async (req, res, next) => {
	const { groupID } = req.params;

	const group = await Group.findById(groupID);
	//Assume user does not belong to group;
	let isUserGroupMember = false;

	//Check if current member is part of group's...
	//USERS
	const users = group.users.map((el) => `${el}`);
	if (users.includes(`${req.user._id}`)) {
		//Error indicator
		isUserGroupMember = true;
	}

	//ADMINS
	const admins = group.admins.map((el) => `${el}`);
	if (admins.includes(`${req.user._id}`)) {
		//Error
		isUserGroupMember = true;
	}

	//CREATOR
	if (`${group.creator}` === `${req.user._id}`) {
		//Error indicator
		isUserGroupMember = true;
	}

	if (!isUserGroupMember)
		return next(new ErrorApi('You are not a member of this group', 401)); //403 probably

	next();
});

exports.protectDeleteMessage = catchAsync(async (req, res, next) => {
	const { messageID } = req.params;
	const message = await MessageGroups.findById(messageID);

	if (!message) return next(new ErrorApi('Message already deleted', 400));
	if (`${message.sender}` !== `${req.user._id}`)
		return next(
			new ErrorApi('Cannot delete message, you are not the sender', 403)
		);

	next();
});
