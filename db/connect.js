const mongoose = require("mongoose");

const connectDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI, {
      // useUnifiedTopology: true,
    });
    console.log("Connected to the database.");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error;
  }
};

module.exports = connectDB;
