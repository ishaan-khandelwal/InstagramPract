const DEFAULT_LOCAL_MONGO_URI = "mongodb://localhost:27017/auth_db";
const DEFAULT_LOCAL_JWT_SECRET = "dev-secret-change-me";

const isProduction = process.env.NODE_ENV === "production";

const MONGO_URI = (process.env.MONGO_URI || (!isProduction ? DEFAULT_LOCAL_MONGO_URI : "")).trim();
const JWT_SECRET = (process.env.JWT_SECRET || DEFAULT_LOCAL_JWT_SECRET).trim();

module.exports = {
    MONGO_URI,
    JWT_SECRET,
    isProduction
};
