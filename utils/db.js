require('dotenv').config();
const mongoose = require('mongoose');

const URI = process.env.MONGO_URL;

const dbConnect = async () => {
    if (!URI) {
        throw new Error("MONGO_URI is not defined. Check your .env.local file.");
    }

    if (mongoose.connection.readyState) return;

    await mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");
};

module.exports = { dbConnect };