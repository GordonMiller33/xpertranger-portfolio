const express = require('express');
const router = express.Router();
const Brew = require('../models/brew');

router.get('/', async (req, res) => {
  try {
    const brews = await Brew.find();
    res.json(brews);
  } catch (err) {
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = router;