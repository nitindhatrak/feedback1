var mongoose = require('mongoose');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

var Schema = mongoose.Schema;


var FeedbackSchema = new Schema({

	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	strength: String,
	weakness: String,
	created: { type: Date, defauly: Date.now},
	createdFor: String,
	createdBy: String

});

FeedbackSchema.pre('save', function(next) {
	var feedack = this;
	var cipher = crypto.createCipher(algorithm,password)
	var cipher1 = crypto.createCipher(algorithm,password)
  	this.strength = cipher.update(this.strength,'utf8','hex')
  	this.weakness = cipher1.update(this.weakness,'utf8','hex')
  	this.strength += cipher.final('hex');
  	console.log("before");
  	this.weakness += cipher1.final('hex');
  	console.log("after");
	next();

});

FeedbackSchema.methods.getDecryptedText = function(text) {
	var decipher = crypto.createDecipher(algorithm,password)
  	var dec = decipher.update(text,'hex','utf8')
  	dec += decipher.final('utf8');
  	return dec;
}



module.exports = mongoose.model('Feedback', FeedbackSchema);