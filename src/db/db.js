const mongoose = require("mongoose");

async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("MONGO_URI is not defined");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

module.exports = connectDB;
