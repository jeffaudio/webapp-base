var express = require('express'),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(express),
    http = require('http'),
    passport = require('./lib/passports')();

var mongoUrl = "mongodb://localhost/webapp";

// Connect to MongoDB.
mongoose.connect(mongoUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() { console.log("Connected to MongoDB"); });


var mongoStore = new MongoStore({
	url: mongoUrl
});

var session_middleware = express.session({
	key: "SessionKey",
	secret: "SessionSecret",
	store: mongoStore
});

var app = express();

app.set('port', process.env.PORT || 3000);
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
var userController = require('./controllers/userController.js')(passport);

require('./lib/routes')(app, userController, passport);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
