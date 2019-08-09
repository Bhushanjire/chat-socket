const userModel = require('../Repository/user.model');

exports.getUser = async function (req, res) {
    userModel.getUserListModel(function (err, result) {
       return  err ? res.send(err) : res.send(result);
    });
}

exports.createUser = async function (req, res) {
    if (!req.body.name) {
        res.status(400).send({ error: true, message: 'Please enter name' });
    } else {
        userModel.createUserModel(req.body, function (err, result) {
            err ? res.send(err) : res.json({ 'success': true, 'user_id': result, 'message': 'User created successfully' });
        });
    }
}

exports.login = async function (req, res) {
    if (!req.body.username) {
        res.status(400).send({ error: true, message: 'Please enter username' });
    } else {
        userModel.loginModel(req.body, function (err, result) {
            err ? res.send(err) : res.json({ 'success': true, 'data': result, 'message': 'User login successfully' });
        });
    }
}

exports.addSocketId = async function (req, res) {
    if (!req.body.socket_id) {
        res.status(400).send({ error: true, message: 'SocketID is null' });
    } else {
        userModel.addSocketIdModel(req.body, function (err, result) {
            err ? res.send(err) : res.json({ 'success': true, 'socket_id': result, 'message': 'SocketID' });
        });
    }
}

