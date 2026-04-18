const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/auth_db";

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;
