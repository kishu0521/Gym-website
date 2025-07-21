const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  phone: String,
  weight: Number,
  height: Number,
  occupation: String,
  address: String,
  profilePicture: String
});

module.exports = mongoose.model('User', userSchema);
