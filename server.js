const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const brewsRoute = require('./routes/brews');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected')
  startServer();
})
  .catch(err => console.error(err));

app.use('/brews', brewsRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/checkdb', async (req, res) => {
  try {
    // Check if we're connected to MongoDB
    const dbState = mongoose.connection.readyState;
    const dbStateText = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState];
    
    // Prepare response
    const response = {
      serverStatus: 'ok',
      node_env: process.env.NODE_ENV || 'not set',
      databaseConnection: {
        state: dbStateText,
        stateCode: dbState
      }
    };
    
    // If connected, add more database info
    if (dbState === 1) {
      try {
        response.database = {
          name: mongoose.connection.db.databaseName,
          host: mongoose.connection.host,
          port: mongoose.connection.port
        };
        
        // Get collection info
        const collections = await mongoose.connection.db.listCollections().toArray();
        response.collections = collections.map(c => c.name);
        
        // Check brew collection specifically
        if (collections.some(c => c.name === 'brews')) {
          try {
            const Brew = mongoose.model('Brew');
            const count = await Brew.countDocuments();
            response.brewCollection = {
              exists: true,
              documentCount: count
            };
            
            // Add a sample document if any exist
            if (count > 0) {
              const sample = await Brew.findOne();
              response.brewSample = sample;
            }
          } catch (modelErr) {
            response.brewModelError = modelErr.message;
          }
        } else {
          response.brewCollection = {
            exists: false,
            message: 'brews collection not found in database'
          };
        }
      } catch (dbInfoErr) {
        response.databaseInfoError = dbInfoErr.message;
      }
    }
    
    res.json(response);
  } catch (err) {
    res.status(500).json({
      serverStatus: 'error',
      error: err.message
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
