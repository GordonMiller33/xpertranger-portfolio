const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');


const app = express();

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