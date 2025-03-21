const express = require('express');
const { SignUp, Login, getChatUsers, SendMsg, GetMsg } = require('../controllers/allcontroller');
const router = express()

router.post('/signup', SignUp);
router.post('/login', Login);
router.get('/getallusers', getChatUsers);
router.post('/sendmsg/:id', SendMsg)
router.get('/getmsg/:id', GetMsg)

module.exports = router;