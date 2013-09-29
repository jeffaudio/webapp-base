var User = require('../models/User').User,
    util = require('util'),
    Twitter = require('twitter'),
    querystring = require('querystring'),
    https = require('https'),
    config = require('../config');

function share(req, res, next) {
	var message = req.body.message;
	var networks = req.body.networks;
	var twitterCred = req.user.twitter;
	var facebookCred = req.user.facebook;


	console.log("Sharing message: " + message);

	if (networks.facebook) shareFacebook(message, facebookCred);
	if (networks.twitter) shareTwitter(message, twitterCred);

	res.send(200);
}

function shareFacebook(message, cred) {
	console.log(" - Sharing to facebook.");

	var path = '/' + cred.facebookId + '/feed?access_token=' + cred.accessToken;
	var data = querystring.stringify({'message': message});

	var options = {
		host: 'graph.facebook.com',
		port: 443,
		path: path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': data.length
		}
	};

	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(data) {
			process.stdout.write(data);
		});
		res.on('end', function() {
			console.log("Posted facebook message.");
		});
	});

	req.on('error', function(err) {
		console.log("Error posting to facebook");
		console.error(err);
	});

	console.log("Posting to facebook...");
	req.write(data);
	req.end();
}

function shareTwitter(message, cred) {
	console.log(" - Sharing to twitter.");
	var twit = new Twitter({
		consumer_key: config.twitter.consumer_key,
		consumer_secret: config.twitter.consumer_secret,
		access_token_key: cred.token,
		access_token_secret: cred.tokenSecret
	});
	twit.verifyCredentials(function(data) {
			// Nothing to do here.
		})
		.updateStatus(message, function(data) {
			// Nothing to do here.
		});
}

module.exports = {
	share: share,
}