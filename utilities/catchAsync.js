//Function to catch asynchronous function errors, helping us to write less try catch

module.exports = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
};
