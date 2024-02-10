//Load Packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: String,
	password: String,
	phone: String,
	profile: {
		firstName: String,
        lastName: String,
		photo: String
    },
	addresses: { type: [Schema.ObjectId], ref: 'Address' },
	otp: String,
	role: { type: String, enum: ['user', 'admin'] },
	token: String,
	wishlist: { type: [Schema.ObjectId], ref: 'Product' }
}, {
  timestamps: true
});

UserSchema.pre('save', function (next) {
	var user = this

	if (!user.isModified('password')) {
		return next()
	}

	// generate the hash
	bcrypt.hash(user.password, null, null, function (err, hash) {
		if (err) return next(err)

		// change the password to the hashed version
		user.password = hash
		next()
	})
})

//return the model
module.exports = mongoose.model('User', UserSchema);