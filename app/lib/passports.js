var passport = require('passport'),
		User = require('../models/User').User,
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

module.exports = function (app) {
	console.log("Loading passports...");

	passport.serializeUser(function(user, done) {
		console.log("Serializing ID: " + user.id);
		console.log(user);
		done(null, user.id); 
	});
	passport.deserializeUser(function(id, done) {
		console.log("Deserializing ID: " + id);
  	User.findById(id, function(err, user) { done(err, user); });
	});

	var localStrategy = new LocalPassport(
	{
		usernameField: 'username',
		passwordField: 'password'
	},
	function (username, password, done) {
		console.log("Username: " + username + " | Password: " + password);
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
		console.log("Twitter: token=" + token + " | tokenSecret" + tokenSecret);
		console.log("  profile" + profile);
		process.nextTick(function () {
			User.findOne({'twitter.twitterId': profile.id}, function(err, user) {
				if (err) { 
					console.log("ERROR: " + err);
					return done(err, profile.id);
				}

				if (!user) {
					console.log("New user.");
					user = new User({
						username: profile.username,
						twitter: {
							twitterId: profile.id,
							token: token
						}
					});
				} else {
					console.log("Existing user.");
					user.twitter = {
						twitterId: profile.id,
						token: token
					};
				}

				user.save(function(err, user) {
					if (err) console.log(err);
					console.log("User saved: " + user.username);	
					return done(err, user);
				});
			});
		});
		//return done(null, profile);
	});

	var facebookStrategy = new FacebookPassport(
	{
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: FACEBOOK_CALLBACK_URL
	},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({'facebook.facebookId': profile.id}, function(err, user) {
				if (err) { 
					console.log("ERROR: " + err);
					return done(err, profile.id);
				}

				if (!user) {
					console.log("New user.");
					user = new User({
						username: profile.username,
						facebook: {
							facebookId: profile.id,
							accessToken: accessToken
						}
					});
				} else {
					console.log("Existing user.");
					user.facebook = {
						facebookId: profile.id,
						accessToken: accessToken
					};
				}

				user.save(function(err, user) {
					if (err) console.log(err);
					console.log("User saved: " + user.username);	
					return done(err, user);
				});
			});
		});
	});

	passport.use(localStrategy);
	passport.use(twitterStrategy);
	passport.use(facebookStrategy);

	return passport;
};