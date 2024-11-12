require('dotenv').config(); 
const mongoose = require('mongoose');


const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;  // Get URI from .env

    // Log the MongoDB URI to check if it's being loaded correctly
    console.log('Mongo URI:', mongoURI);  // This will show the URI in the terminal

    if (!mongoURI) {
      throw new Error('MongoDB URI is undefined. Please check your .env file.');
    }

    // Connect to the database
    await mongoose.connect(mongoURI);

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit if connection fails
  }
};

module.exports = connectToDatabase;
