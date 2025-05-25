const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brew = require("../models/user");

router.get('/', async (req, res, next) => {
	try {
		
	} catch { next(err); }
});

router.put('/', async (req, res, next) => {
	try {
		
	} catch { 
		console.log("Error creating user:", err);
		next(err);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {

	} catch { 
		console.log("Error deleting user:", err);
		next(err);
	}
});

router.post('/:id', async (req, res, next) => {
	try {

	} catch { 
		console.log("Error updating user:", err);
		next(err);
	}
});

module.exports = router;