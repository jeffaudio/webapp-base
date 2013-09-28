var User = require('../models/User.js');

// Get the current user if there is one.
function getCurrent(req, res, next) {
	if (!req.user) {
		res.send(null);
	} else {
		User.findOne({_id: req.user.id}, function(err, result) {
			if (err) return next(err);
			if (results) {
				console.log("Logged in as " + result.username);
				res.send({username: results.username, userId: results._id});
			} else {
				res.send(400);
			}
		});
	}
}


module.exports = function () {
	return {
		getCurrent: getCurrent,
	};
};