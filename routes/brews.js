const express = require('express');
const router = express.Router();
const Brew = require('../models/brew');
const  mongoose = require('mongoose');

router.get('/', async (req, res) => {
  try {
    // Log database connection status
    console.log('Database connection state:', mongoose.connection.readyState);
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    
    console.log('Attempting to access database:', mongoose.connection.db.databaseName);
    console.log('Attempting to access collection:', Brew.collection.name);
    
    // First check if we can query the collection at all
    try {
      const count = await Brew.countDocuments();
      console.log(`Found ${count} documents in collection`);
    } catch (countErr) {
      console.error('Error counting documents:', countErr);
    }
    
    // Try to find all brews with error catching
    const brews = await Brew.find().catch(findErr => {
      console.error('Mongoose find() error details:', findErr);
      throw findErr; // Re-throw to be caught by the outer try/catch
    });
    
    console.log(`Successfully fetched ${brews.length} brews from database`);
    
    // Return the results
    res.json(brews);
  } catch (err) {
    console.error('Error in /brews GET route:', err);
    
    // Provide more detailed error response
    res.status(500).json({ 
      message: 'Error fetching brews',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const brew = await Brew.findOne({ id: req.params.id });
    if (!brew) {
      return res.status(404).json({ message: 'Brew not found' });
    }
    res.json(brew);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req,res) => {
	try {
		await Brew.create(req.body);
		res.status(201).json(brews);
	} catch (err) {
		console.error("Error inserting brew:", err);
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;