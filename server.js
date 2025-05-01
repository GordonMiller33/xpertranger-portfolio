const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let storiesCollection;

async function startServer() {
  try {
    await client.connect();
    const db = client.db("xpertranger-portfolio");
    storiesCollection = db.collection("brews");

    // Start the server *after* connecting to DB
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });

  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

startServer();

// API route: get all stories
app.get('/api/stories', async (req, res) => {
  try {
    const genreFilter = req.query.genre;
    const query = genreFilter ? { genre: genreFilter } : {};

    const stories = await storiesCollection.find(query).toArray();
    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving stories' });
  }
});

// API route: get a single story by ID
const { ObjectId } = require('mongodb');
app.get('/api/stories/:id', async (req, res) => {
  try {
    const story = await storiesCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving story' });
  }
});