const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Password field
  role: { type: String, default: 'user' },
});

// Hash the password before saving the user model
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);  // Generate salt with 10 rounds
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
