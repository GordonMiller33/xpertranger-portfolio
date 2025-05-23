const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brew = require("../models/brew");

router.get('/', async (req, res, next) => {	//must be in the order req res.
	try {
		const brews = await brew.find().catch((err) => {
			console.log("Error fetching brews:", err);
			throw err;
		});
		console.log('Successfully fetched', brews.length, 'brews');

		res.json(brews);	//res.<the actual response we want>
	} catch { next(err); }
});

router.put('/', async (req, res, next) => {
	try {
		await brew.create(req.body);
		res.status(200).send({message: "Brew created"});
	} catch { 
		console.log("Error creating brew:", err);
		next(err);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		await brew.deleteOne({id: req.params.id});
		res.status(200).send({message: "Brew created"});
	} catch { 
		console.log("Error creating brew:", err);
		next(err);
	}
});

router.post('/:id', async (req, res, next) => {
	try {
		await brew.findOne({id: req.params.id}).replaceOne(req.body);
		res.status(201).send({message: "Brew updated"});
	} catch { 
		console.log("Error updating brew:", err);
		next(err);
	}
});

module.exports = router;