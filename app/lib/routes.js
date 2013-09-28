var LOGIN_URL = "/login";

module.exports = function (app, userController, passport) {

	// Return the index to the angular project.
	function angularIndex(req, res, next) {
		console.log(req.originalUrl);
		res.sendfile(app.get('web') + '/index.html');
	}

	app.get('/', angularIndex);

	app.get('/user', userController.getCurrent)

	// Facebook Authentication
	app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res) {});
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: LOGIN_URL}), 
		function(req, res) { res.redirect('/'); });

	// Twitter Authenticate
	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: LOGIN_URL}),
		function(req, res) { res.redirect('/'); });

	// Place other routes here.


	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  res.redirect(LOGIN_URL)
	}
	// Default action is to load the angular project.
	app.get('*', angularIndex);
};