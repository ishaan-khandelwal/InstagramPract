const mongoose = require("mongoose");
const { MONGO_URI, isProduction } = require("./config");

async function connectDB() {
    if (!MONGO_URI) {
        console.error("Missing MONGO_URI. Set it in the environment before starting the server.");
        if (isProduction) {
            process.exit(1);
        }

        return;
    }

    try {
        await mongoose.connect(MONGO_URI);
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
