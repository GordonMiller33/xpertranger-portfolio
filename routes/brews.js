const express = require('express');
const router = express.Router();
const Brew = require('../models/brew');

router.get('/', async (req, res) => {
  try {
    console.log('Attempting to fetch brews from database');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Collection:', Brew.collection.name);
    
    const brews = await Brew.find();
    console.log(`Found ${brews.length} brews`);
    
    res.json(brews);
  } catch (err) {
    console.error('Error fetching brews:', err);
    res.status(500).json({ message: err.message });
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

module.exports = router;