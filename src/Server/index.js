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
      userModel.updateSocketID(function (err, res) {
         socket.user_id = postData.user_id;
      }, postData);
   });

   socket.on('new-message', (postData) => {
      console.log("Send message Details", postData);
      //insert chat message
      if (postData.file_type == "image") {
         cloudinary.uploader.upload(postData.message,
            function (error, result) {
               if (error) { console.log("Error on file upload", error); } else {
                  //console.log("Image upload=>",result);
                  postData.message_type = result.resource_type;
                  postData.message = result.secure_url;
                  sendMessage(postData);
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
                  postData.message_type = result.resource_type;
                  postData.message = result.secure_url;
                  sendMessage(postData);
               }
            });
      } else {
         postData.message_type = 'text';
         sendMessage(postData);
      }
   });

   function sendMessage(postData) {
      console.log(postData);
      if (postData.chat_id > 0) {
         userModel.updateMessage(function (err, res) {
            if(err){
               return io.emit('error-on-updating message', err);
            }else{
               userModel.getSocketID(function (err, userDetails) {
                  for (let index = 0; index < userDetails.length; index++) {
                     postData.conversation_id = userDetails[index].user_id;
                     userModel.getChatMessages(function (err, chatList) {
                        if (err) {
                           return io.emit('error-on-getting-chat message', err);
                        } else {
                           io.to(userDetails[index].socket_id).emit('getChatMessages', chatList);
                        }
                     }, postData);
                  }
               }, postData);
            }

         }, postData);
      } else {
         userModel.checkUserBlock(function (err, res) {
            if (err) {
               return io.emit('error-on-checking block user-chat message', err);
            } else {
               const block_user_id = res[0] ? res[0].from_user_id : 0;

               userModel.getSocketID(function (err, userDetails) {
                  for (let index = 0; index < userDetails.length; index++) {
                     postData.is_block = 'no';
                     postData.is_read = 'no';
                     postData.conversation_id = userDetails[index].user_id;
                     //postData.message_type = 'text';
                     if (block_user_id == postData.conversation_id) {
                        postData.is_block = 'yes';
                     }
                     userModel.insertChatMessage(function (err, res) {
                        if (err) {
                           return io.emit('error-on-adding-chat message', err);
                        } else {
                           postData.conversation_id = userDetails[index].user_id;
                           userModel.getChatMessages(function (err, res) {
                              if (err) {
                                 return io.emit('error-on-getting-chat message', err);
                              } else {
                                 //console.log("socketID",)
                                 io.to(userDetails[index].socket_id).emit('new-message', res);
                                 postData.conversation_id = userDetails[index].user_id;
                                 //console.log(postData.conversation_id);
                                 userModel.getAllUser(function (err, res) {
                                    if (err) {
                                       return io.emit('error-on-getting-list', err);
                                    } else {
                                       io.to(userDetails[index].socket_id).emit('users-list', res);
                                       //io.emit('users-list', res);
                                    }
                                 }, postData);
                              }
                           }, postData);
                        }
                     }, postData);
                  }
               }, postData);
            }
         }, postData);
      }
   }

   //return the private chat messages
   socket.on("getChatMessages", (postData) => {
      userModel.getSocketID(function (err, userDetails) {
         for (let index = 0; index < userDetails.length; index++) {
            postData.conversation_id = userDetails[index].user_id;
            userModel.getChatMessages(function (err, chatList) {
               if (err) {
                  return io.emit('error-on-getting-chat message', err);
               } else {
                  io.to(userDetails[index].socket_id).emit('getChatMessages', chatList);
               }
            }, postData);
         }
      }, postData);
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
      userModel.disConnectUser(function (err, res) {
         if (err) {
            throw err;
         } else {
            console.log("user disconnetd", socket.id);
         }
      }, socket.id);

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
               io.to(socket_ids[index]).emit('error-on-getting-list', err);
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

   //delete single message
   socket.on("deleteMessage", (postData) => {
      userModel.deleteMessage(function (err, res) {
         if (err) {
            //io.to().emit("Error-on-deleting messages");
         } else {
            //io.to().emit("deleteMessage",res);
         }
      }, postData)

   });



});

server.listen(port, () => {
   console.log(`started on port: ${port}`);
});