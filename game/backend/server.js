const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your MongoDB URI
mongoose.connect('mongodb+srv://vinuthnagampala:Vinuthna07072005@cluster0.024tdsc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
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
  await Score.create({ username, score, moves });
  res.json({ success: true });
});

app.get('/leaderboard', async (req, res) => {
  const top = await Score.find().sort({ score: -1, timestamp: 1 }).limit(5);
  res.json(top);
});
app.listen(3000, '0.0.0.0', () => {
  console.log('✅ Server running on http://0.0.0.0:3000');
});
