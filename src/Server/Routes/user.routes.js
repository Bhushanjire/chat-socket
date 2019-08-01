
const User =require('../Controller/user.controller');

const express = require('express');
const router = express.Router();


router.get('/userList', User.getUser);
router.post('/createUser', User.createUser);
router.post('/login', User.login);
router.post('/addSocketId', User.addSocketId);
module.exports=router;