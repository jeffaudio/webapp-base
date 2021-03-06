var LOGIN_URL = "/login";

module.exports = function (app, userController, shareController, passport) {

	// Return the index to the angular project.
	function angularIndex(req, res, next) {
		console.log(req.originalUrl);
		res.sendfile(app.get('web') + '/index.html');
	}

	// Index path goes to the angular project.
	app.get('/', angularIndex);

	app.post('/share', shareController.share)

	app.get('/user', userController.getCurrent);
	app.post('/user/login', userController.authenticate);
	app.post('/user/register', userController.register);
	app.post('/user/logout', userController.logout);

	// Facebook Authentication
	app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['publish_actions']}));
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: LOGIN_URL}), 
		function(req, res) { res.redirect('/'); });
	app.post('/auth/facebook/disconnect', userController.disconnectFacebook);

	// Twitter Authenticate
	app.get('/auth/twitter', passport.authorize('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: LOGIN_URL}),
		function(req, res) { res.redirect('/'); });
	app.post('/auth/twitter/disconnect', userController.disconnectTwitter);

	// Place other routes here.

	//
	
	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  res.redirect(LOGIN_URL)
	}
	// Default action is to load the angular project.
	app.get('*', angularIndex);
};