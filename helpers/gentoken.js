require('dotenv').config();
const jwt = require('jsonwebtoken');

const KEY = process.env.SECRET_KEY;

const genToken = (userId, res) => {
    const token = jwt.sign(
        { userId },
        KEY,
        { expiresIn: "8d" }
    );

    res.cookie("chatToken", token, {
        httpOnly: true,  
        secure: true,
        sameSite: "strict", 
    });

    return token; 
};


module.exports = { genToken };