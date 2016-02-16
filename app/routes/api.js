var User = require('../models/user');
var Feedback = require('../models/feedback');
var config = require('../../config');
var url = require('url');
var secretKey = config.secretKey;
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {

	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expirtesInMinute: 1440
	});


	return token;

}

module.exports = function(app, express, io) {


	var api = express.Router();

	api.get('/all_feedbacks', function(req, res) {
		
		Feedback.find({}, function(err, feedbacks) {
			if(err) {
				res.send(err);
				return;
			}
			res.json(feedbacks);
		});
	});

	api.post('/signup', function(req, res) {

		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});
		var token = createToken(user);
		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: 'User has been created!',
				token: token
			});
		});
	});


	api.get('/users', function(req, res) {

		User.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}

			res.json(users);

		});
	});

	api.post('/login', function(req, res) {

		User.findOne({ 
			username: req.body.username
		}).select('name username password').exec(function(err, user) {

			if(err) throw err;

			if(!user) {

				res.send({ message: "User doenst exist"});
			} else if(user){ 

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid Password"});
				} else {

					///// token
					var token = createToken(user);

					res.json({
						success: true,
						message: "Successfuly login!",
						token: token
					});
				}
			}
		});
	});

	api.use(function(req, res, next) {


		console.log("Somebody just came to our app!");

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		// check if token exist
		if(token) {

			jsonwebtoken.verify(token, secretKey, function(err, decoded) {

				if(err) {
					res.status(403).send({ success: false, message: "Failed to authenticate user"});

				} else {

					//
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.status(403).send({ success: false, message: "No Token Provided"});
		}

	});

	

	// Destination B // provide a legitimate token

	api.route('/')

		.post(function(req, res) {
			console.log("params ", req.body);
			var feedback = new Feedback({
				creator: req.decoded.id,
				strength: req.body.strength,
				weakness: req.body.weakness,
				createdFor: req.body.createdFor,
				createdBy: req.body.createdBy,
			});

			feedback.save(function(err, newFeedback) {
				console.log("paramsasaSassSsS ", newFeedback);
				if(err) {
					res.send(err);
					return
				}
				
				io.emit('feedback', newFeedback)
				res.json({message: "New Feedback Created!"});
			});
		})


		.get(function(req, res) {
			var parts = url.parse(req.url, true);
  			var query = parts.query;
			console.log("request is ", query.userId)
			Feedback.find({ createdFor: query.userId }, function(err, feedbacks) {

				if(err) {
					console.log("err ", err);
					res.send(err);
					return;
				}
				else{
					console.log("feedbacks are ", feedbacks);
					if(feedbacks && feedbacks.length > 0){
						for(var i = 0; i < feedbacks.length; i++){
							var f = feedbacks[i];
							console.log("f are ", f.strength);
							var decipher1 = crypto.createDecipher(algorithm,password)
						  	f.strength = decipher1.update(f.strength,'hex','utf8')
						  	f.strength += decipher1.final('utf8');

						  	var decipher2= crypto.createDecipher(algorithm,password)
						  	f.weakness = decipher2.update(f.weakness,'hex','utf8')
						  	f.weakness += decipher2.final('utf8');
						}
					}
					res.send(feedbacks);
				}
			});
		});

	api.get('/me', function(req, res) {
		res.send(req.decoded);
	});




	return api;


}