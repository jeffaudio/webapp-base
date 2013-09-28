module.exports = function (app) {

	// Return the index to the angular project.
	function angularIndex(req, res, next) {
		res.sendfile(app.get('web') + '/index.html');
	}

	app.get('/', angularIndex);

	// Place other routes here.



	// Default action is to load the angular project.
	app.get('*', angularIndex);
};




