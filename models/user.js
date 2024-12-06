const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { createTokenForUser } = require('./../services/authentication')


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Password field
  role: { type: String, default: 'user' },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null
}
});

// // Hash the password before saving the user model
// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);  // Generate salt with 10 rounds
//     this.password = await bcrypt.hash(this.password, salt);  // Hash the password
//   }
//   next();
// });


userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next(); // Only hash the password if it's modified

  // Generate salt for bcrypt
  const salt = await bcrypt.genSalt(10); // 10 rounds of salt

  // Hash the password with the generated salt
  const hashedPassword = await bcrypt.hash(user.password, salt);

  user.password = hashedPassword; // Set the hashed password
  user.salt = salt; // Store the salt in the database

  next();
});





// Define instance method to compare password using bcrypt
userSchema.methods.comparePassword = async function (password) {
  // Compare the provided password with the stored hashed password using bcrypt
  console.log(password);
  console.log(this.password)
  return await bcrypt.compare(password, this.password);

};





// Define instance method to generate auth token
userSchema.methods.generateAuthToken = function () {
  return createTokenForUser(this);
};





// Static method to match password and generate token
userSchema.statics.matchPasswordAndGenerateToken = async function (
  email,
  password
) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  // Use the comparePassword method to check if the password is correct
  if (!await user.comparePassword(password)) throw new Error("Incorrect credentials");

  const token = createTokenForUser(user);
  console.log("token userLogin:", token);
  return { token };
};
const User = mongoose.model('User', userSchema);
module.exports = User;
