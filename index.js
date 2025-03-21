require('dotenv').config()
const express = require('express');
const { io, app, server } = require('./SocketIo/socketserver')
const cors = require('cors')
const Routes = require('./routes/allRoutes');
const { dbConnect } = require('./utils/db');


app.use(express.json());

app.use(cors({
    origin: "https://chatapp-omega-lemon.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


app.use('/', Routes)

app.get('/', (req, res) => {
    res.send('Hello, from socket server');
});

dbConnect();

const port = process.env.PORT

server.listen(port, () => {
    console.log("Server is running at 9000");
})