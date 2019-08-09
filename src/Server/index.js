const express = require('express');
const path = require('path');
const app = express();

//file upload 
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './uploads' });

const UserContoller = require('./Controller/user.controller');
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

   socket.on('new-message', (postData) => {
      console.log("Send message Details", postData);
      let socket_ids = [postData.to_socket_id, postData.from_socket_id];
      let user_ids = [postData.to_user_id, postData.from_user_id];

      //insert chat message
      if (postData.file_type == "image") {
         cloudinary.uploader.upload(postData.message,
            function (error, result) {
               if (error) { console.log("Error on file upload", error); } else {
                  is_read = 'no';
                  is_block = 'no';
                  for (let index = 0; index < socket_ids.length; index++) {
                     if (postData.is_block > 0) {
                        if (postData.to_user_id == user_ids[index]) {
                           is_block = 'yes';
                        } else {
                           is_block = 'no';
                        }
                        is_read = 'yes';
                     }
                     postData.is_block = is_block;
                     postData.is_read = is_read;
                     postData.conversation_id = user_ids[index];
                     postData.message_type = result.resource_type;
                     postData.message = result.secure_url;
                     userModel.insertChatMessage(function (err, res) {
                        if (err) {
                           return io.emit('error-on-adding-chat message', err);
                        } else {
                           userModel.getChatMessages(function (err, res) {
                              if (err) {
                                 return io.emit('error-on-getting-chat message', err);
                              } else {
                                 io.to(socket_ids[index]).emit('new-message', res);
                              }
                           }, postData);
                        }
                     }, postData);
                  }
               }
            });
      } else if (postData.file_type == "video") {
         cloudinary.uploader.upload(postData.message,
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
                  is_read = 'no';
                  is_block = 'no';
                  for (let index = 0; index < socket_ids.length; index++) {
                     if (postData.is_block > 0) {
                        if (postData.to_user_id == user_ids[index]) {
                           is_block = 'yes';
                        } else {
                           is_block = 'no';
                        }
                        is_read = 'yes';
                     }
                     postData.is_block = is_block;
                     postData.is_read = is_read;
                     postData.conversation_id = user_ids[index];
                     postData.message_type = result.resource_type;
                     postData.message = result.secure_url;
                     userModel.insertChatMessage(function (err, res) {
                        if (err) {
                           return io.emit('error-on-adding-chat message', err);
                        } else {
                           userModel.getChatMessages(function (err, res) {
                              if (err) {
                                 return io.emit('error-on-getting-chat message', err);
                              } else {
                                 io.to(socket_ids[index]).emit('new-message', res);
                              }
                           }, postData);
                        }
                     }, postData);
                  }
               }
            });
      } else {
         for (let index = 0; index < socket_ids.length; index++) {
            
            postData.conversation_id = user_ids[index];
            postData.message_type = 'text';

            userModel.checkUserBlock(function (err, res) {
               if (err) {
                  return io.emit('error-on-checking block user-chat message', err);
               } else {
                  console.log("block User",res);
                  if (res.to_user_block_id) {
                     if (postData.from_user_block_id == user_ids[index]) {
                        postData.is_block = 'yes';
                        postData.is_read = 'yes';
                     }else{
                        postData.is_block = 'no';
                        postData.is_read = 'no';
                     }
                  }else{
                     postData.is_block = 'no';
                     postData.is_read = 'no';
                  }
                  postData.is_block = 'no';
                     postData.is_read = 'no';
                  userModel.insertChatMessage(function (err, res) {
                     if (err) {
                        return io.emit('error-on-adding-chat message', err);
                     } else {
                        userModel.getChatMessages(function (err, res) {
                           if (err) {
                              return io.emit('error-on-getting-chat message', err);
                           } else {
                              io.to(socket_ids[index]).emit('new-message', res);
                           }
                        }, postData);
                     }
                  }, postData);
               }
            },postData);
         }
      }
   });


   //return the private chat messages
   socket.on("getChatMessages", (postData) => {
      let socket_ids = [postData.to_socket_id, postData.from_socket_id];
      let user_ids = [postData.to_user_id, postData.from_user_id];
      for (let index = 0; index < socket_ids.length; index++) {
         postData.conversation_id = user_ids[index];
         userModel.getChatMessages(function (err, res) {
            if (err) {
               return io.emit('error-on-getting-chat message', err);
            } else {
               io.to(socket_ids[index]).emit('getChatMessages', res);
            }
         }, postData);
      }
   });

   //update message status as a read
   socket.on("updateMessageAsRead", (postData) => {
      userModel.updateMessageAsRead(function (err, res) {
         if (err) {
            return io.emit('error-on-updating-message-status', err);
         } else {
         }
      }, postData);
   });

   //return the user list
   socket.on("getAllUsers", (postData) => {
      userModel.getAllUser(function (err, res) {
         if (err) {
            return io.emit('error-on-getting-list', err);
         } else {
            io.emit('users-list', res);
         }
      }, postData);
   });

   socket.on("disconnectUser", (postData) => {
      userModel.deleteUser(function (err, res) {
         if (err) {
            return io.emit('error-on-deleting-list', err);
         } else {
         }
      }, postData);

   });

   //called when user closed the browser or disconnect
   socket.on('disconnect', (reason) => {
      console.log("user disconnetd", socket.id);
   });

   //clear the chat
   socket.on('clearChat', (postData) => {
      userModel.clearChat(function (err, res) {
         if (err) {
            return io.emit('error-on-clearing-chat', err);
         } else {
         }
      }, postData);
   });

   //update the unread message count
   socket.on("updateUnreadMsgCount", (postData) => {
      let socket_ids = [postData.to_socket_id, postData.from_socket_id];
      let user_ids = [postData.to_user_id, postData.from_user_id];

      for (let index = 0; index < socket_ids.length; index++) {
         postData.conversation_id = user_ids[index];
         userModel.getAllUser(function (err, res) {
            if (err) {
               return io.emit('error-on-getting-list', err);
            } else {
               io.to(socket_ids[index]).emit('updateUnreadMsgCount', res);
            }
         }, postData);
      }
   });

   //block to user
   socket.on("blockUser", (postData) => {
      userModel.blockUser(function (err, res) {
         if (err) {
            return io.emit('error-on-bloking-user', err);
         } else {
         }
      }, postData);
   });
});

server.listen(port, () => {
   console.log(`started on port: ${port}`);
});