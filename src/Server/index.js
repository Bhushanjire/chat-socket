const express = require('express');
const path = require('path');
const app = express();

//file upload 
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './uploads' });

//const User =require('./Controller/user.controller');
const userModel = require('./Repository/user.model');

let http = require('http');
let server = http.Server(app);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = require('../Server/Config/db'); //reference of db.js

//var cloudinary = require('cloudinary');
var cloudinary = require('cloudinary').v2;

cloudinary.config({
   cloud_name: 'jhfghfersedtd',
   api_key: '449637416437644',
   api_secret: '8XmGGfouLXeYDTKwcElj2dnWgnQ'
});

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
   // console.log("Socket ID=>>>>",socket);
   socket.on("addSocketID", (postData) => {
      // console.log('user connected', postData);
   });
   // userModel.getUserListModel(function(err, result) {
   //    console.log('controller')
   //    if (err)
   //      res.send(err);
   //      console.log('res', result);
   //    res.send({'success':true,'data':result,'message':"User List"});
   //  });

   socket.on('new-message', (message) => {
      console.log("Send message Details", message);
      let users = [message.to_socket_id, message.from_socket_id];

      //INSERT CHAT MESSAGE
      const from_user_id = message.from_user_id;
      const from_user_name = message.from_user_name;
      const to_user_id = message.to_user_id;
      const to_user_name = message.to_user_name;
      const chat_message = message.message;

      if (message.file_type == "image") {
         cloudinary.uploader.upload(message.message,
            function (error, result) {
               if (error) { console.log("Error on file upload", error); } else {
                  console.log("File Upload Succsessfull", result);
                  var sql = "INSERT INTO private_chat(from_user_id,from_user_name,to_user_id,to_user_name,message,message_type)VALUES('" + from_user_id + "','" + from_user_name + "','" + to_user_id + "','" + to_user_name + "','" + result.secure_url + "','" + result.resource_type + "')";
                  console.log(sql);
                  connection.query(sql, function (err, res) {
                     if (err) return io.emit('error-on-adding-chat message', err);
                     sql = "SELECT * FROM private_chat WHERE ((to_user_id='" + from_user_id + "' and from_user_id='" + to_user_id + "') OR (to_user_id='" + to_user_id + "' AND from_user_id='" + from_user_id + "'))";
                     // console.log(sql);
                     connection.query(sql, function (err, res) {
                        if (err) return io.emit('error-on-getting-chat message', err);
                        for (let index = 0; index < users.length; index++) {
                           const user = users[index];
                           io.to(user).emit('new-message', res);
                           //socket.to(user).emit('new-message', message.chatMsg);
                           // socket.broadcast.to(user).emit('new-message', message.chatMsg);
                        }
                     });
                  })
               }
            });
      } else if (message.file_type == "video") {

         cloudinary.uploader.upload(message.message,
            {
               resource_type: "video",
               public_id: "my_folder/my_sub_folder/dog_closeup",
               chunk_size: 6000000,
               eager: [
                  { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                  { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }],
               eager_async: true,
               eager_notification_url: "https://mysite.example.com/notify_endpoint"
            },
            function (error, result) { 
               if (error) { console.log("Error on file upload", error); } else {
                  console.log("File Upload Succsessfull", result);
                  var sql = "INSERT INTO private_chat(from_user_id,from_user_name,to_user_id,to_user_name,message,message_type)VALUES('" + from_user_id + "','" + from_user_name + "','" + to_user_id + "','" + to_user_name + "','" + result.secure_url + "','" + result.resource_type + "')";
                  console.log(sql);
                  connection.query(sql, function (err, res) {
                     if (err) return io.emit('error-on-adding-chat message', err);
                     sql = "SELECT * FROM private_chat WHERE ((to_user_id='" + from_user_id + "' and from_user_id='" + to_user_id + "') OR (to_user_id='" + to_user_id + "' AND from_user_id='" + from_user_id + "'))";
                     // console.log(sql);
                     connection.query(sql, function (err, res) {
                        if (err) return io.emit('error-on-getting-chat message', err);
                        for (let index = 0; index < users.length; index++) {
                           const user = users[index];
                           io.to(user).emit('new-message', res);
                           //socket.to(user).emit('new-message', message.chatMsg);
                           // socket.broadcast.to(user).emit('new-message', message.chatMsg);
                        }
                     });
                  })
               }
            
            });

      } else {
         var sql = "INSERT INTO private_chat(from_user_id,from_user_name,to_user_id,to_user_name,message)VALUES('" + from_user_id + "','" + from_user_name + "','" + to_user_id + "','" + to_user_name + "','" + chat_message + "')";
         console.log(sql);
         connection.query(sql, function (err, res) {
            if (err) return io.emit('error-on-adding-chat message', err);
            sql = "SELECT * FROM private_chat WHERE ((to_user_id='" + from_user_id + "' and from_user_id='" + to_user_id + "') OR (to_user_id='" + to_user_id + "' AND from_user_id='" + from_user_id + "'))";
            // console.log(sql);
            connection.query(sql, function (err, res) {
               if (err) return io.emit('error-on-getting-chat message', err);
               for (let index = 0; index < users.length; index++) {
                  const user = users[index];
                  io.to(user).emit('new-message', res);
                  //socket.to(user).emit('new-message', message.chatMsg);
                  // socket.broadcast.to(user).emit('new-message', message.chatMsg);
               }
            });
         })
      }

   });

   socket.on("getChatMessages", (postData) => {
      sql = "SELECT * FROM private_chat WHERE ((to_user_id='" + postData.from_user_id + "' and from_user_id='" + postData.to_user_id + "') OR (to_user_id='" + postData.to_user_id + "' AND from_user_id='" + postData.from_user_id + "'))";
      let socket_ids = [postData.to_socket_id, postData.from_socket_id];
      connection.query(sql, function (err, res) {
         if (err) return io.emit('error-on-getting-chat message', err);
         for (let index = 0; index < socket_ids.length; index++) {
            const socket_id = socket_ids[index];
            io.to(socket_id).emit('getChatMessages', res);
         }
      });
   });

   socket.on("updateMessageAsRead", (postData) => {
      sql = "UPDATE private_chat SET is_read='yes' WHERE ((to_user_id='" + postData.from_user_id + "' and from_user_id='" + postData.to_user_id + "'))";
      connection.query(sql, function (err, res) {
         if (err) {
            return io.emit('error-on-updating-message-status', err);
         } else {

         }
      });
   });

   socket.on("getAllUsers", (postData) => {
      const sql = "SELECT U.user_id,U.name,U.username,U.profile_picture,OU.socket_id,(select COUNT(`single_chat_id`) FROM private_chat WHERE from_user_id=U.user_id AND to_user_id='" + postData.from_user_id + "' AND  `is_read`='no' GROUP by to_user_id) AS unread_msg FROM users U LEFT JOIN online_users OU ON U.user_id=OU.user_id";
      connection.query(sql, function (err, res) {
         if (err) return io.emit('error-on-getting-list', err);
         //console.log("Updated Users", res);
         io.emit('users-list', res)
      })
   });

   socket.on("disconnectUser", (data) => {
      connection.query("DELETE FROM online_users WHERE user_id='" + data.user_id + "'", function (err, res) {
         if (err) return io.emit('error-on-deleting-user', err);
         // console.log("User Deleted", res);
         io.emit('User Deleted', res)
      })

   });

   //called when user closed the browser or disconnect
   socket.on('disconnect', (reason) => {
      console.log("user disconnetd", socket.id);
   });

   //clear the chat
   socket.on('clearChat', (postData) => {
      sql = "DELETE FROM private_chat WHERE ((to_user_id='" + postData.from_user_id + "' and from_user_id='" + postData.to_user_id + "') OR (to_user_id='" + postData.to_user_id + "' AND from_user_id='" + postData.from_user_id + "'))";
      connection.query(sql, function (err, res) {
         if (err) return io.emit('error-on-deleting-chat', err);
         //console.log("Chat Deleted", res);
         // io.emit('User Deleted', res)
      })

   });

   socket.on("updateUnreadMsgCount", (postData) => {
      let socket_ids = [postData.to_socket_id, postData.from_socket_id];
      let users_ids = [postData.to_user_id, postData.from_user_id];
      for (let index = 0; index < socket_ids.length; index++) {
         const sql = "SELECT U.user_id,U.name,U.username,U.profile_picture,OU.socket_id,(select COUNT(`single_chat_id`) FROM private_chat WHERE from_user_id=U.user_id AND to_user_id='" + users_ids[index] + "' AND  `is_read`='no' GROUP by to_user_id) AS unread_msg FROM users U LEFT JOIN online_users OU ON U.user_id=OU.user_id";
         connection.query(sql, function (err, res) {
            if (err) return io.emit('error-on-getting-list', err);
            const socket_id = socket_ids[index];
            io.to(socket_id).emit('updateUnreadMsgCount', res);

         })
      }
   });
});

server.listen(port, () => {
   console.log(`started on port: ${port}`);
});