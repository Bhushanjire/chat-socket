const userModel = require('../Repository/user.model');
const fs = require('fs');
const path = require('path');

exports.getUser = async function (req, res) {
    userModel.getUserListModel(function(err, result) {
        console.log('controller')
        if (err)
          res.send(err);
          console.log('res', result);
        res.send({'success':true,'data':result,'message':"User List"});
      });
}

exports.createUser=async function(req,res){
    //console.log("request param=>",req.body);
    if(!req.body.name){
        res.status(400).send({error:true,message:'Please enter name'});
    }else{
        userModel.createUserModel(req.body,function(err,result){
            err ? res.send(err) : res.json({'success':true,'user_id':result,'message':'User created successfully'});
        });
    }
}

exports.login=async function(req,res){
    //console.log("request param=>",req.body);
    if(!req.body.username){
        res.status(400).send({error:true,message:'Please enter username'});
    }else{
        userModel.loginModel(req.body,function(err,result){
            err ? res.send(err) : res.json({'success':true,'data':result,'message':'User login successfully'});
        });
    }
}

exports.addSocketId=async function(req,res){
    //console.log("request param=>",req.body);
    if(!req.body.socket_id){
        res.status(400).send({error:true,message:'SocketID is null'});
    }else{
        userModel.addSocketIdModel(req.body,function(err,result){
            err ? res.send(err) : res.json({'success':true,'socket_id':result,'message':'SocketID'});
        });
    }
}

