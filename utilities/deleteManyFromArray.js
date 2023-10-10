exports.deleteManyFromArray = function (bigger, smaller) {
	bigger = bigger.filter((big) => !smaller.includes(big));
	return bigger;
};
