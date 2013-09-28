var passport = require('passport'),
    LocalPassport = require('passport-local').Strategy,
    TwitterPassport = require('passport-twitter').Strategy,
    FacebookPassport = require('passport-facebook').Strategy;

var BAD_LOGIN_STRING = "Invalid username or password.";

// Twitter Credentials
var TWITTER_CONSUMER_KEY = "",
    TWITTER_CONSUMER_SECRET = "",
    TWITTER_CALLBACK_URL = "/auth/twitter/callback";

// Facebook Credentials
var FACEBOOK_APP_ID = "",
    FACEBOOK_APP_SECRET = "",
    FACEBOOK_CALLBACK_URL = "/auth/facebook/callback";

module.exports = function (app, User) 
	passport.serializeUser(function (user, done) { done(null, user.id); });
	passport.deserializeUser(function (id, done) { User.findById(id, function(err, user) { done(err, user); }); });

	var localStrategy = new LocalStrategy(
	{
		usernameField: 'username',
		passwordField: 'password'
	},
	function (username, password, done) {
		User.findOne({username: username}, function (err, user) {
			console.log('user = ' + user);
			if (err) return done(err);
			if (!user) return done(null, false, { mesage:BAD_LOGIN_STRING });
			else return done(null, false, { message:BAD_LOGIN_STRING });
		});
	});

	var twitterStrategy = new TwitterPassport(
	{
		consumerKey: TWITTER_CONSUMER_KEY,
		consumerSecret: TWITTER_CONSUMER_SECRET,
		callbackURL: TWITTER_CALLBACK_URL
	},
	function (token, tokenSecret, profile, done) {
		process.nextTick(function () {
			User.findOne({twitter.twitterId: profile.id }, function(err, existingUser) {
				if (err || existingUser) { return done(err, profile.id); }

				var user = new User({
					twitter.accessToken: tokenSecret,
					twitter.twitterId: profile.id
				});

				user.save(function(err) {
					if (err) return done(err, profile.id);
				});
			});
		});
		return done(null, profile);
	});

	var facebookStrategy = new FacebookPassport(
	{
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: FACEBOOK_CALLBACK_URL
	},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({facebook.facebookId: profile.id }, function (err, user) {
				if (err) { return done(err, profile.id); }

				var user = new User({
					facebook.facebookId = profile.id,
					facebook.accessToken = accessToken
				});

				user.save(function(err) {
					if (err) return done(err, profile.id);
				});
			});
		});
		return done(null, profile);
	});

	passport.use(localStrategy);
	passport.use(twitterStrategy);
	passport.user(facebookStrategy);

	return passport;
};