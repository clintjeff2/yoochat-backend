exports.getAllUsers = (req, res, next) => {
	console.log(req.originalUrl);

	res.status(200).json({
		message: 'Found user',
	});
};

//Get all users

//update user without picture

//update picture

//Delete user

//Get specific user
