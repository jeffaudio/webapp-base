var express = require('express'),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(express),
    http = require('http'),
    passport = require('./lib/passports')(),
    config = require('./config');

// Connect to MongoDB.
mongoose.connect(config.mongodb.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() { console.log("Connected to MongoDB"); });


var mongoStore = new MongoStore({
	url: config.mongodb.url
});

var session_middleware = express.session({
	key: config.session.key,
	secret: config.session.secret,
	store: mongoStore
});

var app = express();

app.set('port', process.env.PORT || config.port);
app.set('web', __dirname + '/web');
app.use(express.logger('dev'));

app.use(express.static(app.get('web')));
app.use(express.favicon());

app.use(express.cookieParser());
app.use(session_middleware);
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

// Routes
var userController = require('./controllers/userController')(passport);
var shareController = require('./controllers/shareController');

require('./lib/routes')(app, userController, shareController, passport);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
