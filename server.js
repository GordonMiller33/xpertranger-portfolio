const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const brewSchema = new mongoose.Schema({
  id: int,
  title: String,
  category: String,
  summary: String,
  content: String
});

const Brew = new mongoose.model('Brew', brewSchema);

app.get('/brews', async(req,res) => {
  try {
    const brews = await Brew.find();
    res.json(brews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
