const  mongoose = require('mongoose');

const brewSchema = new mongoose.Schema({
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
	summary: String,
	content: String,
	created_at: {
	   	type: Date,
	   	default: Date.now
	}, { collection: 'brews' });

module.exports = mongoose.model('Brew', brewSchema, 'brews');