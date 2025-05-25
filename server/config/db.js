const mongoose = require('mongoose');
const dotenv = require('dotenv');

 const connectDB = function() {

	mongoose.set('strictQuery', false);
	
	mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
	  	useUnifiedTopology: true
	}).catch(err => {
		console.log("Error connecting to database:", err);
	});
}

module.exports = connectDB;