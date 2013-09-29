var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	username: {type: String, required: true, unique: true},
	hashed_password: {type: String},

	facebook: {
		facebookId: {type: String},
		accessToken: {type: String}
	},

	twitter: {
		twitterId: {type: String},
		token: {type: String}
	}

	// Add extra user fields here.
});

UserSchema.virtual('password')
	.set(function(password) {
		this._password = password;
		this.hashed_password = bcrypt.hashSync(password);
	})
	.get(function() {
		return this._password;
	});

UserSchema.method('authenticate', function(password) {
	console.log("Authenticating user: " + this.username + " with password: " + password);
	return bcrypt.compareSync(password, this.hashed_password);
});

console.log("Setting up user schema model...");
var User = mongoose.model('User', UserSchema);

var test = new User({
	username: "TestUser"
});
test.save();

module.exports = {
	User: User
};