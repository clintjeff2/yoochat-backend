const jwt = require('jsonwebtoken');

exports.createToken = async (_id) => {
	const token = await jwt.sign({ _id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	return token;
};

exports.verifyToken = async (token) => {
	const isLegit = await jwt.verify(token, process.env.JWT_SECRET);
	return isLegit;
};
