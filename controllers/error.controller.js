module.exports = (err, req, res, next) => {
	let statusCode = err.statusCode ? err.statusCode : 500;
	let message = err.message ? err.message : 'Something went wrong';

	res.status(statusCode).json({
		status: err.status || 'Error',
		message: message,
		err: err,
		stack: err.stack,
	});
};
