// Pulls Mongoose dependeny for creating schemas
var mongoose 			= require('mongoose');
var Schema 				= mongoose.Schema;

// Creates a User Schema. Will be basis of how user data is stored in db
var UserSchema = new Schema({
	username: {type: String, require: true},
	gender: {type: String, require: true},
	age: {type: Number, require: true},
	favlang: {type: String, require: true},
	location: {type: [Number], required: true},
	htmlverified: String,
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now}
});

// Sets the created_at and updated_at parameter equal to the current time
UserSchema.pre('save', function(next) {
	now = new Date();
	this.updated_at = now;
	if (!this.created_at) {
		this.created_at = now
	}
	next();
});

// Indexes this schema in 2dsphere format (for running proximity searches)
UserSchema.index({location: '2dsphere'});

// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as "scotch-users"
module.exports = mongoose.model('scotch-user', UserSchema);



