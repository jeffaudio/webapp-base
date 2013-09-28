
var express = require('express'),
    http = require('http'),
    passport = require('passport');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('web', __dirname + '/web');
app.use(express.static(app.get('web')));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('cookie session secret'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// Routes
var userController = require('./controllers/userController.js')();

require('./lib/routes')(app, userController, passport);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
