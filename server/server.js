const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const connectDB = require(path.join(__dirname,"/config/db"));
const errorHandler = require(path.join(__dirname, "/middleware/error.middleware"));

const clientPath = path.join(__dirname, "../client");
const routesPath = path.join(__dirname, "routes");

const brewsRouter = require(path.join(routesPath, "brews-route"));	//imports a router for handling brew requests
const loginRouter = require(path.join(routesPath, "login-route"));	//imports a router for handling login requests

require("dotenv").config();	//sets up .env file config to be accessed via process.env.<value>

const app = express();		//instance of express for this application

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(clientPath));

connectDB();

app.listen(PORT, () => {
	console.log(`Server running on the port`, PORT);
});


app.use('/brews', brewsRouter);		//defines that the imported brews-router will handle url requests to /brews

app.use(errorHandler);