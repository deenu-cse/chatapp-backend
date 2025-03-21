const express = require('express');
const { io, app, server } = require('./SocketIo/socketserver')
const cors = require('cors')
const Routes = require('./routes/allRoutes');
const { dbConnect } = require('./utils/db');


app.use(express.json());
app.use(cors())

app.use('/', Routes)

app.get('/', (req, res) => {
    res.send('Hello, from socket server');
});

dbConnect();

server.listen(9000, () => {
    console.log("Server is running at 9000");
})