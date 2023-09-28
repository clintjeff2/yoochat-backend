exports.getAllUsers = (req, res, next) => {
	console.log(req.originalUrl);

	res.status(200).json({
		message: 'Found user',
	});
};
