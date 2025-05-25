const mongoose = require("mongoose")

const brewSchema = new mongoose.Schema({	//this is used to instruct the API what a "brew" should look like
	id: {
		type: Number,
		required: true,
    	unique: true
  	},
  	title: {
    	type: String,
    	required: true
  	},
  	category: {
	    type: String,
	    required: true
  	},
  	edition: {
  		type: String,
  		required: true
  	},
	summary: String,
	content: String,
	created_at: {
	   	type: Date,
	   	default: Date.now
	}
}, { collection: 'brews' });

module.exports = mongoose.model('brew', brewSchema, 'brews');