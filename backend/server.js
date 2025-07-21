const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Register Route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();
    res.status(200).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({
      message: 'Login successful',
      userId: user._id,            // ✅ SEND THIS
      email: user.email,           // (optional)
      name: user.name              // (optional)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Dashboard Form Submission Route
app.post('/profile/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  await User.findByIdAndUpdate(userId, updatedData);
  res.json({ message: 'Profile updated' });
});

// Get user profile
app.get('/user', async (req, res) => {
  const email = req.query.email;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
