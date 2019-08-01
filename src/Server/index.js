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
   let users = [message.to_socket_id, message.user_socket_id];
   console.log(users);
   
   for (let index = 0; index < users.length; index++) {
      const user = users[index];
      console.log(user);
      
      socket.to(user).emit('new-message', message.chatMsg);
   }
    
   //  socket.broadcast.to(message.to_socket_id).emit('new-message', message.chatMsg);
         
   });

   socket.on("getAllUsers",()=>{
      console.log('getAllUsers');
      
      connection.query("SELECT U.user_id,U.name,U.username,OU.socket_id FROM users U LEFT JOIN online_users OU ON U.user_id=OU.user_id", function (err, res) {
         if(err) return io.emit('error-on-getting-list', err);
         console.log("Updated Users",res);
         
         io.emit('users-list', res)

      })
   });
   
});

server.listen(port, () => {
   console.log(`started on port: ${port}`);
});