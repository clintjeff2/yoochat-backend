const { findByIdAndUpdate, create } = require('../models/user.model');
const { deleteManyFromArray } = require('../utilities/deleteManyFromArray');
const Group = require('./../models/group.model');
const ErrorApi = require('./../utilities/ErrorApi');
const catchAsync = require('./../utilities/catchAsync');
const sendResponse = require('./../utilities/sendResponse');
const multer = require('multer');
const sharpMulter = require('sharp-multer');
const fs = require('fs');

//Function to return users and admins of a group given its ID
const groupContact = async (groupID) => {
	const group = await Group.findById(groupID);

	if (!group) throw new ErrorApi('No such group found', 404);
	const { users, admins, name } = group;

	let groupData = { users, admins, name };

	return groupData;
};

// function to add element in an array whilst preventing duplicate entries into the array
const pushPreventDuplicateValue = (arr, item, type = 'user', next) => {
	arr = arr.map((el) => `${el}`);
	if (arr.includes(item))
		return next(new ErrorApi(`Already exist as ${type}`, 403));

	// arr.push(item);
	arr.push(item);

	return arr;
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

	//Get all admins as array of strings
	const admins = group.admins.map((el) => `${el}`);

	if (!group)
		return next(
			new ErrorApi('Group not found, this group does not exist', 404)
		);
	//check if user is creator or admin
	const isCreator = `${req.user._id}` === `${group.creator}`;
	const isAdmin = admins.includes(`${req.user._id}`);
	// console.log(isCreator, isAdmin);
	// console.log(group.admins, admins, req.user._id, 'GROUP PROTECT ADMIN');

	if (isCreator || isAdmin) return next();

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

// const multerStorage = sharpMulter({
// 	destination: (req, file, callback) => {
// 		const createDirDest = async () => {
// 			const { groupID } = req.params;
// 			const group = await groupContact(groupID);
// 			req.G_Name = group.name;
// 			const dirName = `uploads/${groupID}/profile`;
// 			console.log(file, 'UPLOADS IN DIRNAME', groupID);
// 			await fs.mkdir(dirName, { recursive: true }, (err) => {
// 				if (err) console.log(err, 'ERROR IN FILE UPLOAD DESTINATION SECTION');

// 				callback(null, dirName);
// 			});
// 		};
// 		createDirDest();
// 		// return callback(null, 'uploads');

// 	},
// 	filename: (oldName, options) => {
// 		console.log('INSIDE FILESTORAGE', oldName, options);
// 		// const fName = `${req.G_Name}-${req.params.groupID}-${Date.now()}`;

// 		// callback(null, fName);
// 	},
// });

// const upload = multer({ storage: multerStorage });
// const upload = multer({ storage: multerStorage });

const multerStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		const createDirDest = async () => {
			const { groupID } = req.params;
			const dirName = `uploads/${groupID}/profile`;

			await fs.mkdir(dirName, { recursive: true }, (err) => {
				if (err) console.log(err, 'ERROR IN FILE UPLOAD DESTINATION SECTION');

				callback(null, dirName);
			});
		};

		createDirDest();
	},

	filename: (req, file, callback) => {
		const createFileName = async () => {
			const { groupID } = req.params;
			const group = await groupContact(groupID);

			const fileName = `${group.name}-${groupID}-${Date.now()}.png`;
			req.body.photo = fileName;
			callback(null, fileName);
		};

		createFileName();
	},
});
const multerFilter = (req, file, callback) => {
	const fileType = file.mimetype.split('/')[0];
	if (fileType !== 'image')
		return callback(new ErrorApi('file format not support', 400));

	callback(null, true);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

//upload photo middleware
exports.uploadGroupPhotoMiddleware = upload.single('photo');

//update group photo
exports.updateGroupPhoto = catchAsync(async (req, res, next) => {
	const { photo } = req.body;
	const { groupID } = req.params;

	if (!photo)
		return next(
			new ErrorApi('Photo not provided, please ensure you provide image', 403)
		);

	const group = await Group.findByIdAndUpdate(
		groupID,
		{ photo },
		{
			new: true,
			runValidators: true,
		}
	);
	sendResponse(res, 'success', 200, group);
});

exports.updateGroup = catchAsync(async (req, res, next) => {
	//get groupID and data to be updated
	const { groupID } = req.params;
	const { name, description } = req.body;
	console.log(req.body);
	let data;
	if (name) data = { name };
	// if (photo) data = { ...data, photo };
	if (description) data = { ...data, description };

	if (!name && !description)
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

//Add an admin or multiple (also change from regular user to admin) to group protected by ONLY GROUP CREATOR
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

//Add a user or multiple users performed by ADMIN or CREATOR
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
exports.updateGroupCreator = catchAsync(async (req, res, next) => {
	//Get group Id and newCreator
	const { groupID } = req.params;
	const { newCreator } = req.body;

	//Add current creator, as an admin(current creator is the one performing action)
	let { admins, users } = await groupContact(groupID);
	admins.push(req.user._id);

	//Remove new creator from users or admins if present as any of these
	users = users.filter((user) => `${user}` !== newCreator);
	admins = admins.filter((admin) => `${admin}` !== newCreator);

	if (!`${newCreator}`)
		return next(new ErrorApi('New group creator information not given', 400));

	const creator = newCreator;

	//update information in database
	const group = await Group.findByIdAndUpdate(
		groupID,
		{ admins, creator, users },
		{
			new: true,
			runValidators: true,
		}
	);
	// console.log(req.user._id, creator, admins, group.creator);
	sendResponse(res, 'success', 200, group);
});

//Remove multiple admins from group
exports.removeManyGroupAdmins = catchAsync(async (req, res, next) => {
	//Get admins id and groupId
	const { groupID } = req.params;
	const adminsID = req.body.admins;

	//Get previous admins
	let { admins } = await groupContact(groupID);
	admins = admins.map((admin) => `${admin}`);

	//filter admins to delete out
	admins = deleteManyFromArray(admins, adminsID);
	console.log('PREV', admins, adminsID, 'NEXT');

	//update DB
	admins = await Group.findByIdAndUpdate(
		groupID,
		{ admins },
		{
			runValidators: true,
			new: true,
		}
	);

	sendResponse(res, 'success', 200, admins);
});

//Remove multiple users from grop
exports.removeManyGroupUsers = catchAsync(async (req, res, next) => {
	//Get admins id and groupId
	const { groupID } = req.params;
	const usersID = req.body.users;

	//Get previous admins
	let { users } = await groupContact(groupID);
	users = users.map((user) => `${user}`);

	//filter admins to delete out
	users = deleteManyFromArray(users, usersID);

	//update DB
	users = await Group.findByIdAndUpdate(
		groupID,
		{ users },
		{
			runValidators: true,
			new: true,
		}
	);

	sendResponse(res, 'success', 200, users);
});

//Remove Admin title as groupAdmin --NOT YET
exports.RemoveAdminTitle = catchAsync(async (req, res, next) => {
	const { groupID } = req.params;
	const { admin } = req.body;

	let { admins, users } = await groupContact(groupID);
	admins = admins.filter((adm) => `${adm}` !== admin);
	users.push(admin);

	//Update DB data
	const group = await Group.findByIdAndUpdate(
		groupID,
		{ admins, users },
		{
			returnOriginal: false,
			runValidators: true,
		}
	);

	sendResponse(res, 'success', 200, group);
});

//prevent adding element in an array if element already exit.
//prevent adding elements in an array to elements in another array.

//Update group profile
