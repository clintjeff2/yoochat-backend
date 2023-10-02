const Group = require('./../models/group.model');
const ErrorApi = require('./../utilities/ErrorApi');
const catchAsync = require('./../utilities/catchAsync');
const sendResponse = require('./../utilities/sendResponse');

const groupContact = async (groupID) => {
	const group = await Group.findById(groupID);

	if (!group) return next(new ErrorApi('No such group found', 404));
	const { users, admins } = group;

	let groupData = { users, admins };

	return groupData;
};

//protect a group route only by creator
exports.groupProtectCreator = catchAsync(async (req, res, next) => {
	//get group ID
	const { groupID } = req.params;
	const group = await Group.findById(groupID);

	if (!group)
		return next(
			new ErrorApi('Group not found, this group does not exist', 404)
		);
	if (`${group.creator}` !== `${req.user._id}`)
		return next(
			new ErrorApi('You do not have permission to carry out this action', 403)
		);

	next();
});

//protect a group route by admin or creator
exports.groupProtectAdmin = catchAsync(async (req, res, next) => {
	//get group ID
	const { groupID } = req.params;
	const group = await Group.findById(groupID);

	if (!group)
		return next(
			new ErrorApi('Group not found, this group does not exist', 404)
		);
	//check if user is creator or admin
	const isCreator = `${req.user._id}` === `${group.creator}`;
	const isAdmin = group.admins.includes(req.user._id);
	console.log(isCreator, isAdmin);
	console.log(group.admins, req.user._id, 'GROUP PROTECT ADMIN');

	if (!isCreator || !isAdmin) return next();

	return next(
		new ErrorApi(
			'You are not the group ADMIN. You do not have permission to carry out this action',
			403
		)
	);
});

exports.createGroup = catchAsync(async (req, res, next) => {
	//Get group information
	const { name, photo, description, users } = req.body;
	const data = {
		name,
		creator: req.user._id,
		users,
	};
	if (photo) data.photo = photo;
	if (description) data.description = description;

	//Check if users have been choosen while creating the group
	if (users.length)
		return next(
			new ErrorApi('You must add atleast a user while creating the group', 400)
		);
	const group = await Group.create(data);

	sendResponse(res, 'success', 201, group);
});

exports.deleteGroup = catchAsync(async (req, res, next) => {
	//get group ID
	const { groupID } = req.params;
	const group = await Group.findByIdAndDelete(groupID);

	//Return error if no group is found
	if (!group) return next(new ErrorApi('Group not found', 404));

	//send response
	sendResponse(res, 'success', 204, {});
});

exports.updateGroup = catchAsync(async (req, res, next) => {
	//get groupID and data to be updated
	const { groupID } = req.params;
	const { name, photo, description } = req.body;
	console.log(req.body);
	let data;
	if (name) data = { name };
	if (photo) data = { ...data, photo };
	if (description) data = { ...data, description };

	if (!name && !photo && !description)
		return next(
			new ErrorApi('Provide name, photo or description to be updated', 400)
		);

	//Update data
	const group = await Group.findByIdAndUpdate(groupID, data, {
		new: true,
		runValidators: true,
	});

	//Send data
	sendResponse(res, 'success', 200, group);
});

exports.getGroup = catchAsync(async (req, res, next) => {
	//get group ID
	const { groupID } = req.params;
	const group = await Group.findById(groupID);

	//Return error if no group is found
	if (!group) return next(new ErrorApi('Group not found', 404));

	//send response
	sendResponse(res, 'success', 200, group);
});
exports.getAllGroups = catchAsync(async (req, res, next) => {
	//Get all groups
	const groups = await Group.find({});

	//Return error if no group is found
	if (!groups) return next(new ErrorApi('Group not found', 404));

	//send response
	sendResponse(res, 'success', 200, groups);
});

//Add an admin (also change from regular user to admin) to group protected by ONLY GROUP CREATOR
exports.addGroupAdmin = catchAsync(async (req, res, next) => {
	//Get groupID, and admin to add to a group
	const { groupID } = req.params;
	const { admin } = req.body; //expects array

	//select previous admins, and normal users in that group
	let { admins, users } = await groupContact(groupID);

	//Add new admin if provided
	if (admin.length === 0)
		return next(new ErrorApi('Provide admin to be added', 400));
	// admins.push(admin);
	admins = admins.concat(admin);

	//check if new admin was a regular user and remove as regular user
	users = users.filter((user) => `${user}` !== `${admin}`);

	//Update admins with the new admin added
	const groupAdmins = await Group.findByIdAndUpdate(
		groupID,
		{ admins, users },
		{
			returnOriginal: false,
			runValidators: true,
		}
	);

	sendResponse(res, 'success', 200, groupAdmins);
});

//Delete an admin from group protected by ONLY GROUP CREATOR
exports.removeGroupAdmin = catchAsync(async (req, res, next) => {
	//Get groupID, and admin to add to a group
	const { groupID } = req.params;
	const { admin } = req.body;

	//select previous admins in that group
	let { admins } = await groupContact(groupID);
	admins = admins.filter((adm) => `${adm}` !== `${admin}`);

	//Update admins with the new admin added
	const groupAdmins = await Group.findByIdAndUpdate(
		groupID,
		{ admins },
		{
			returnOriginal: false,
			runValidators: true,
		}
	);

	sendResponse(res, 'success', 200, groupAdmins);
});

//Add a user performed by ADMIN or CREATOR
exports.addGroupUser = catchAsync(async (req, res, next) => {
	//Get groupID, and user to add to a group
	const { groupID } = req.params;
	const { user } = req.body; //expects an array

	//select previous users in that group
	let { users, admins } = await groupContact(groupID);

	//Add new user to group if exist
	if (user.length === 0)
		return next(new ErrorApi('Provide user to be added to group', 400));
	// users.push(user);
	users = users.concat(user);

	//check if new user was an admin and remove as admin
	admins = admins.filter((admin) => `${admin}` !== `${user}`);

	//update group
	const group = await Group.findByIdAndUpdate(
		groupID,
		{ users, admins },
		{
			runValidators: true,
			new: true,
		}
	);

	sendResponse(res, 'success', 200, group);
});

//Delete a user performed by ADMIN or CREATOR
exports.removeGroupUser = catchAsync(async (req, res, next) => {
	//Get groupID, and user to remove from group
	const { groupID } = req.params;
	const { user } = req.body;

	//select previous users in that group
	let { users } = await groupContact(groupID);

	//Remove user from group
	users = users.filter((usr) => `${usr}` !== `${user}`);

	//update group
	const group = await Group.findByIdAndUpdate(
		groupID,
		{ users },
		{
			runValidators: true,
			new: true,
		}
	);

	sendResponse(res, 'success', 200, group); //204 later
});

//Update group creator and make current creator an admin performed by CREATOR ONLY
exports.updateGroupCreator = catchAsync(async (req, res, next) => {});

//Add multiple admins -- addGroupAdmin does this
//Remove multiple admins -- NOT YET
//Remove Admin title from groupAdmin --NOT YET

//Add multiple users ---addGroupUser Does this
