// Dependencies
var mongoose 					= require('mongoose');
var User						= require('./model.js');

// Opens App Routes
module.exports = function(app) {








	// GET Routes
	// ---------------------------------
	// Retrieve records for all users in the db
	app.get('/users', function(req, res) {

		// Uses Mongoose schema to run the serach (with empty conditions)
		var query = User.find({}); // Empty conditions
		query.exec(function(err, users) {

			if (err) res.send(err);

			// If no errors found, respond with a JSON of all users
			res.json(users);
		});
	});






	// POST Routes
	// ---------------------------------
	// Provides the method for saving new users in the db
	app.post('/users', function(req, res) {

		// Creates a new User based on the Mongoose schema and the post body
		var newuser = new User(req.body);

		// New user is saved in the db
		newuser.save(function(err) {

			if (err) res.send(err);

			// If no errors found, respond with a JSON of the new user
			res.json(req.body);
		});
	});

	// Retrieves JSON records for all users who meet set of query conditions
	app.post('/query/', function(req, res) {

		// Grab all of the query parameters from body
		var lat 					= req.body.latitude;
		var long 					= req.body.longitude;
		var distance 			= req.body.distance;
		var male 					= req.body.male;
		var female          = req.body.female;
    var other           = req.body.other;
    var minAge          = req.body.minAge;
    var maxAge          = req.body.maxAge;
    var favLang         = req.body.favlang;
    var reqVerified     = req.body.reqVerified;

		// Opens a generic mongoose query. Depending on post body we will...
		var query = User.find({});

		// ... include filter by max distance 
		if (distance) {
			// Use MongoDB's geospatial querying features. 
			query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]}, 

				// Converting meter to mile. Specify spherical geometry
				maxDistance: distance * 1609.34, spherical: true});
		}

		// ... include filter by Gender (all options)
		if (male || female || other) {
			query.or([{ 'gender': male }, {'gender': female }, {'gender': other}]);
		}

		// ... include filter by Min Age
		if (minAge) {
			query = query.where('age').gte(minAge);
		}

		// ... include filter by Max Age
		if (maxAge) {
			query = query.where('age').lte(maxAge);
		}

		// ... include filter by Favorite language
		if (favLang) {
			query = query.where('favlang').equals(favLang);
		}

		if (reqVerified) {
			query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
		}

		// Execute query and return query results
		query.exec(function(err, users) {
			if (err) res.send(err);

			// If no errors, respond with a JSON that meets criteria
			res.json(users);
		});
	});




};
