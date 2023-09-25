class ErrorApi extends Error {
	constructor(message, statusCode) {
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'Failed' : 'Internal Error';
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}
