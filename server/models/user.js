const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({	//this is used to instruct the database what a "user" should look like
	id: {
		type: Number,
		required: true,
    	unique: true
  	},
  	username: {
    	type: String,
    	required: true
  	},
  	password: {
	    type: String,
	    required: true
  	},
	created_at: {
	   	type: Date,
	   	default: Date.now
	}
}, { collection: 'users' });

module.exports = mongoose.model('user', userSchema, 'users');