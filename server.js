const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const brewsRoute = require('./routes/brews');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(connectLivereload());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected')
  startServer();
}).catch(err => console.error(err));

app.use('/brews', brewsRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
