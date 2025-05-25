const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const routesPath = path.join(__dirname, "routes")

const brewsRouter = require(path.join(routesPath, "brews-route"));	//imports a router for handling brew requests

require("dotenv").config();	//sets up .env file config to be accessed via process.env.<value>

const app = express();		//instance of express for this application

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', express.static(path.join(__dirname, 'login')));

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
  	useUnifiedTopology: true,
}).then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on the port`, PORT);
	});
}).catch(err => console.log(err));

app.use('/brews', brewsRouter);		//defines that the imported brews-router will handle url requests to /brews

app.use((err, req, res, next) => {
	console.error('Error caught:', err.message);
	res.status(500).send('Server error!');
});