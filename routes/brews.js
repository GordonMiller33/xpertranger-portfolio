const express = require('express');
const router = express.Router();
const Brew = require('../models/brew');

// Get all brews
router.get('/', async (req, res) => {
  try {
    const brews = await Brew.find();
    res.json(brews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single brew
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