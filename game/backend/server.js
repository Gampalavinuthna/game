const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Non-SRV URI (double-check spelling and format)
const uri = 'mongodb://vinuthnagampala:vinuthna07072005@ac-0qng7j4-shard-00-00.024tdsc.mongodb.net:27017,ac-0qng7j4-shard-00-01.024tdsc.mongodb.net:27017,ac-0qng7j4-shard-00-02.024tdsc.mongodb.net:27017/memorygame?ssl=true&replicaSet=atlas-6po182-shard-0&authSource=admin&retryWrites=true&w=majority';

console.log('👉 Connecting to MongoDB with URI:');
console.log(uri);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

const scoreSchema = new mongoose.Schema({
  username: String,
  score: Number,
  moves: Number,
  timestamp: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

app.post('/submit', async (req, res) => {
  const { username, score, moves } = req.body;
  try {
    await Score.create({ username, score, moves });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error saving score:', err);
    res.status(500).json({ success: false });
  }
});

app.get('/leaderboard', async (req, res) => {
  try {
    const top = await Score.find().sort({ score: -1, timestamp: 1 }).limit(5);
    res.json(top);
  } catch (err) {
    console.error('❌ Error fetching leaderboard:', err);
    res.status(500).json([]);
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('✅ Server running on http://0.0.0.0:3000');
});
