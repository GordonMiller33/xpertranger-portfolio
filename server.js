const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const brewsRouter = require("./routes/brews-route");	//imports a router for handling brew requests

require("dotenv").config();	//sets up .env file config to be accessed via process.env.<value>

const app = express();		//instance of express for this application

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
  	useUnifiedTopology: true,
}).then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port`, PORT);
	});
}).catch(err => console.log(err));

app.use('/brews', brewsRouter);		//defines that the imported brews-router will handle url requests to /brews

app.use((err, req, res, next) => {
	console.error('Error caught:', err.message);
	res.status(500).send('Server error!');
});