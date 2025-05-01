const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// API endpoint to get stories
const Story = require('./models/Story'); // your Mongoose model
app.get('/api/stories', async (req, res) => {
  const stories = await Story.find();
  res.json(stories);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});