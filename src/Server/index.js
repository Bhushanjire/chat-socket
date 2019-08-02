const express = require('express');
const path = require('path');
const app = express();

let http = require('http');
let server = http.Server(app);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection=require('../Server/Config/db'); //reference of db.js

const routes = require('./Routes/user.routes');
app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
app.use('/', routes);

let socketIO = require('socket.io');
let io = socketIO(server);
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('user connected');  
  socket.on('new-message', (message) => {
    console.log("Send message Details",message);
   let users = [message.to_socket_id, message.from_socket_id];
   console.log(users);

   //INSERT CHAT MESSAGE
   var from_user_id = message.from_user_id;
   var from_user_name=message.from_user_name;
   var to_user_id = message.to_user_id;
   var to_user_name = message.to_user_name;
   var chat_message = message.message;
   var responceData;

   sql = "INSERT INTO private_chat(from_user_id,from_user_name,to_user_id,to_user_name,message)VALUES('"+from_user_id+"','"+from_user_name+"','"+to_user_id+"','"+to_user_name+"','"+chat_message+"')";  
   connection.query(sql, function (err, res) {
         if(err) return io.emit('error-on-adding-chat message', err);
         console.log("Chat message added",res);
      })

    
      console.log("responceData",responceData);
      for (let index = 0; index < users.length; index++) {
         const user = users[index];
         console.log(user);
         
         io.to(user).emit('new-message', message);
         //socket.to(user).emit('new-message', message.chatMsg);
          // socket.broadcast.to(user).emit('new-message', message.chatMsg);
      }

 //INSERT CHAT MESSAGE
   });

   socket.on("getChatMessages",(postData)=>{
      sql = "SELECT * FROM private_chat WHERE ((to_user_id='"+postData.from_user_id+"' and from_user_id='"+postData.to_user_id+"') OR (to_user_id='"+postData.to_user_id+"' AND from_user_id='"+postData.from_user_id+"'))";
     // console.log(sql);
      connection.query(sql, function (err, res) {
         if(err) return io.emit('error-on-adding-chat message', err);
         io.emit('getChatMessages', res)
      });
   });

   socket.on("getAllUsers",()=>{
      console.log('getAllUsers');
      connection.query("SELECT U.user_id,U.name,U.username,U.profile_picture,OU.socket_id FROM users U LEFT JOIN online_users OU ON U.user_id=OU.user_id", function (err, res) {
         if(err) return io.emit('error-on-getting-list', err);
         console.log("Updated Users",res);
         io.emit('users-list', res)
      })
   });

   socket.on("disconnectUser",(data)=>{
      connection.query("DELETE FROM online_users WHERE user_id='"+data.user_id+"'", function (err, res) {
         if(err) return io.emit('error-on-deleting-user', err);
         console.log("User Deleted",res);
         io.emit('User Deleted', res)
      })

   });

});

server.listen(port, () => {
   console.log(`started on port: ${port}`);
});