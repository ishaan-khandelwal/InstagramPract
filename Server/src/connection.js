const mongoose = require("mongoose");
const { MONGO_URL, isProduction } = require("./config");

async function connectDB() {
    if (!MONGO_URL || (!MONGO_URL.startsWith("mongodb://") && !MONGO_URL.startsWith("mongodb+srv://"))) {
        console.error("Invalid or missing MONGO_URL. Current value:", MONGO_URL ? "[REDACTED]" : "empty");
        console.error("Expected connection string to start with 'mongodb://' or 'mongodb+srv://'");
        if (isProduction) {
            process.exit(1);
        }

        return;
    }

    try {
        await mongoose.connect(MONGO_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

function isDbConnected() {
    return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isDbConnected };
