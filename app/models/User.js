var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

module.exports = function() {

	var UserSchema = mongoose.Schema({
		username: {type: String, required: true, unique: true},
		hashed_password: {type: String},

		facebook: {
			facebookId: {type: String, unique: true},
			accessToken: {type: String}
		},

		twitter: {
			twitterId: {type: String, unique: true},
			accessToken: {type: String}
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

	return mongoose.model('User', UserSchema);

};
