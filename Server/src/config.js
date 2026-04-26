const DEFAULT_LOCAL_MONGO_URI = "mongodb://localhost:27017/auth_db";
const DEFAULT_LOCAL_JWT_SECRET = "81975-88402-92309-06308-88304";

const isProduction = process.env.NODE_ENV === "production";

const MONGO_URL = (process.env.MONGO_URL || (!isProduction ? DEFAULT_LOCAL_MONGO_URI : "")).trim();
const JWT_SECRET = (process.env.JWT_SECRET || DEFAULT_LOCAL_JWT_SECRET).trim();

module.exports = {
    MONGO_URL,
    JWT_SECRET,
    isProduction
};
