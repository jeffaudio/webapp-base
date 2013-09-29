var User = require('../models/User').User;

module.exports = function(passport) {
	// Get the current user if there is one.
	function getCurrent(req, res, next) {
		if (!req.user) {
			res.send(null);
		} else {
			User.findOne({_id: req.user.id}, function(err, user) {
				if (err) return next(err);
				if (user) {
					console.log("Logged in as " + user.username);
					res.send(user);
				} else {
					res.send(400);
				}
			});
		}
	}

	function authenticate(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) return next(err);
			if (!user) return res.send("Invalid username or password.", 400);
			req.logIn(user, function(err) {
				if (err) return next(err);
				return res.send('Ok', 200);
			});
		})(req, res, next);
	}

	function register(req, res, next) {
		var user = new User({
			username: req.body.username,
			password: req.body.password
		});
		console.log("Registering new user "  + user.username);
		User.findOne({username: user.username}, function(err, existingUser) {
			if (err) return next(err);
			if (existingUser) return res.send("User already exists.", 400);
			user.save(function (err, newUser) {
				if (err) return next(err);

				// If there is other user setup tasks to do,
				// they can be done here.

				return res.send('Ok', 200);
			});
		});
	}

	function logout(req, res, next) {
		console.log("Logging out. Goodbye!");
		if (req.session) {
			req.session.destroy(function() {
				res.send('Ok', 200);
			});
		} else {
			res.send('Ok', 200);
		}
	}

	return {
		getCurrent: getCurrent,
		authenticate: authenticate,
		register: register,
		logout: logout
	};
};