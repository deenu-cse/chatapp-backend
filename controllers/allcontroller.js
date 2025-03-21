const { genToken } = require("../helpers/gentoken");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const { io } = require('../SocketIo/socketserver')

const SignUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ msg: "Please fill in all fields." });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists." });
        }
        console.log("code is here ....");

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const chatToken = genToken(newUser._id, res);

        console.log(chatToken)

        await newUser.save();

        return res.status(201).json({
            msg: "User registered successfully.",
            chatToken,
            userId: newUser._id
        });

    } catch (error) {
        return res.status(500).json({ msg: error.message });
        console.log(error);
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Please fill in all fields." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials." });
        }

        const chatToken = genToken(user._id, res);
        console.log("login code is here ....", chatToken);

        return res.status(201).json({
            msg: "User registered successfully.",
            chatToken,
            userId: user._id
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: error.message });
    }
}

const getChatUsers = async (req, res) => {
    try {
        const loggedInUser = req.query.userId;

        const users = await User.find({ _id: { $ne: loggedInUser } }).select("-password");

        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: error.message });
    }
};

const SendMsg = async (req, res) => {
    try {
        const { message, userId: senderId } = req.body;
        const { id: receiverId } = req.params;

        let conversation = await Conversation.findOneAndUpdate(
            { participants: { $all: [senderId, receiverId] } },
            {
                $push: { messages: { senderId, text: message } },
                $setOnInsert: { participants: [senderId, receiverId] }
            },
            { new: true, upsert: true }
        );

        res.status(200).json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
};

const GetMsg = async (req, res) => {
    try {
        const senderId = req.query.userId;
        const { id: receiverId } = req.params;

        const conversation = await Conversation.findOne({
            participants: {
                $all: [receiverId, senderId]
            }
        })
        if (!conversation) {
            return res.status(201).json('no message found for this chat')
        }
        const allmessages = conversation.messages
        res.status(200).json(allmessages)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = { SignUp, Login, getChatUsers, SendMsg, GetMsg }