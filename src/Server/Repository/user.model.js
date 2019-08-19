const connection = require('../Config/db'); //reference of db.js
var jwt = require('jsonwebtoken');

const User = function (task) {
};

User.createUserModel = function (p, result) {
  let profile_picture = "https://picsum.photos/id/" + Math.ceil(Math.random() * 100) + "/500/500";
  const sql = "INSERT INTO users(name,username,password,profile_picture) VALUES('" + p.name + "','" + p.username + "','" + p.password + "','" + profile_picture + "')";
  connection.query(sql, function (err, res) {
    return err ? result(err, null) : result(null, res.insertId);
  });
}

User.loginModel = function (p, result) {
  const sql = "SELECT * FROM users WHERE username='" + p.username + "' AND password='" + p.password + "'";
  connection.query(sql, function (err, res) {
    if (err) {
      return result(err, null);
    } else {
      const token = jwt.sign({ 'user_id': res[0].user_id }, 'bhushan');
      //console.log("Encoded",token);
      res[0].token = token
      var decoded = jwt.verify(token, 'bhushan');
      //console.log("Decoded",decoded); 
      return result(null, res);
    }

  });
}

User.getAllUser = function (callback, postData) {
  if (postData.conversation_id) {
    postData.from_user_id = postData.conversation_id;
  }
  const sql = "SELECT U.user_id,U.name,U.username,U.profile_picture,U.socket_id,U.is_active,U.last_login,(select COUNT(`chat_id`) FROM private_chat WHERE from_user_id=U.user_id AND to_user_id='" + postData.from_user_id + "' AND  `is_read`='no' AND is_block='no'  AND conversation_id='" + postData.from_user_id + "' GROUP by to_user_id) AS unread_msg,(SELECT block_id FROM block_user_list WHERE to_user_id='" + postData.from_user_id + "' AND from_user_id=U.user_id) AS blocked,(SELECT block_id FROM block_user_list WHERE from_user_id='" + postData.from_user_id + "' AND to_user_id=U.user_id) AS unblock FROM users U";
  //console.log("All User",sql);
  connection.query(sql, function (err, userList) {
    return err ? callback(err, null) : callback(null, userList);
  });
};

User.getChatMessages = function (callback, postData) {
  const sql = "SELECT * FROM private_chat WHERE ((to_user_id='" + postData.from_user_id + "' AND from_user_id='" + postData.to_user_id + "') OR (to_user_id='" + postData.to_user_id + "' AND from_user_id='" + postData.from_user_id + "')) AND conversation_id='" + postData.conversation_id + "' AND is_block='no'";
  // console.log("Chatting List",sql);
  connection.query(sql, function (err, chatList) {
    return err ? callback(err, null) : callback(null, chatList);
  });
}

User.insertChatMessage = function (callback, postData) {
  const sql = "INSERT INTO private_chat(from_user_id,from_user_name,to_user_id,to_user_name,message,message_type,conversation_id,is_block,is_read,is_forwarded)VALUES('" + postData.from_user_id + "','" + postData.from_user_name + "','" + postData.to_user_id + "','" + postData.to_user_name + "','" + postData.message + "','" + postData.message_type + "','" + postData.conversation_id + "','" + postData.is_block + "','" + postData.is_read + "','" + postData.is_forwarded + "')";
  console.log("Chat Insert Query=>", sql);
  connection.query(sql, function (err, chatList) {
    return err ? callback(err, null) : callback(null, chatList.chat_id);
  });

  const sql1 = "INSERT INTO messages(message_body,message_type) VALUES('" + postData.message + "','" + postData.message_type + "')";
  connection.query(sql1, function (err, message) {
    if (err) {
      throw err
    } else {
      const query1 = "INSERT INTO chat(message_id,from_user_id,to_user_id) VALUES('" + message.insertId + "','" + postData.from_user_id + "','" + postData.to_user_id + "')";
      console.log(query1);
      connection.query(query1, function (err, chatMessage) {
        // return err ? callback(err, null) : callback(null, chatList.chat_id);
      });
    }
  });
}

User.updateMessageAsRead = function (callback, postData) {
  const sql = "UPDATE private_chat SET is_read='yes' WHERE ((to_user_id='" + postData.from_user_id + "' AND from_user_id='" + postData.to_user_id + "'))";
  connection.query(sql, function (err, chatList) {
    return err ? callback(err, null) : callback(null, chatList);
  });
}

User.deleteUser = function (callback, postData) {
  const sql = "UPDATE users SET is_active ='no',socket_id='' WHERE socket_id='" + postData.user_id + "'";
  connection.query(sql, function (err, chatList) {
    return err ? callback(err, null) : callback(null, chatList);
  });
}

User.clearChat = function (callback, postData) {
  const sql = "DELETE FROM private_chat WHERE ((to_user_id='" + postData.from_user_id + "' and from_user_id='" + postData.to_user_id + "') OR (to_user_id='" + postData.to_user_id + "' AND from_user_id='" + postData.from_user_id + "')) AND conversation_id='" + postData.from_user_id + "'";
  // console.log("Clear Chat",sql);
  connection.query(sql, function (err, chatList) {
    return err ? callback(err, null) : callback(null, chatList);
  });
}

User.blockUser = function (callback, postData) {
  if (postData.blockType == 'Block') {
    const sql = "INSERT IGNORE INTO block_user_list(from_user_id,to_user_id) VALUES('" + postData.from_user_id + "','" + postData.to_user_id + "')";
    // console.log("Block User",sql);
    connection.query(sql, function (err, chatList) {
      return err ? callback(err, null) : callback(null, chatList);
    });
  } else {
    const sql = "DELETE FROM block_user_list WHERE (from_user_id='" + postData.from_user_id + "' AND to_user_id='" + postData.to_user_id + "') ";
    connection.query(sql, function (err, chatList) {
      return err ? callback(err, null) : callback(null, chatList);
    });
  }
}

User.checkUserBlock = function (callback, postData) {
  const sql = "SELECT * FROM block_user_list WHERE from_user_id='" + postData.to_user_id + "' AND to_user_id='" + postData.from_user_id + "'";
  //console.log("Check block user",sql);
  connection.query(sql, function (err, res, fields) {
    return err ? callback(err, null) : callback(null, res);
  });
}


User.getSocketID = function (callback, postData) {
  const sql = "SELECT user_id,socket_id FROM users WHERE user_id IN('" + postData.to_user_id + "','" + postData.from_user_id + "')";
  //console.log("User Details",sql);
  connection.query(sql, function (err, res, fields) {
    if (err) {
      throw err;
    } else {
      return callback(null, res);
    }
  });
}

User.getSingleSocketID = function (callback, postData) {
  const sql = "SELECT user_id,socket_id FROM users WHERE user_id IN('" + postData.from_user_id + "')";
  connection.query(sql, function (err, res, fields) {
    if (err) {
      throw err;
    } else {
      return callback(null, res);
    }
  });
}

User.updateSocketID = function (callback, postData) {
  const date = new Date();
  const last_login = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  const sql = "UPDATE users SET socket_id ='" + postData.socket_id + "',is_active='yes',last_login='" + last_login + "' WHERE user_id='" + postData.user_id + "'";
  console.log("Update SocketID", sql);
  connection.query(sql, function (err, res) {
    if (err) {
      throw err;
    } else {
      return callback(null, res);
    }
  });
}

User.addSocketIdModel = function (p, result) {
  const sql = "REPLACE INTO online_users(user_id,socket_id) VALUES('" + p.user_id + "','" + p.socket_id + "')";
  connection.query(sql, function (err, res) {
    return err ? result(err, null) : result(null, res.insertId);
  });
}

User.disConnectUser = function (callback, socket_id) {
  const sql = "UPDATE users SET is_active ='no',socket_id='' WHERE socket_id='" + socket_id + "'";
  connection.query(sql, function (err, res) {
    if (err) {
      throw err;
    } else {
      return callback(null, res);
    }
  });
}

User.updateMessage = function (callback, postData) {
  const sql = "UPDATE private_chat SET message ='" + postData.message + "' WHERE message='" + postData.edit_message + "' AND from_user_id='" + postData.from_user_id + "' AND to_user_id='" + postData.to_user_id + "'";
  //console.log("Update message",sql);
  connection.query(sql, function (err, res) {
    if (err) {
      throw err;
    } else {
      return callback(null, res);
    }
  });
}

User.deleteMessage = function (callback, postData) {
  const sql = "DELETE FROM private_chat WHERE chat_id = '" + postData.chat_id + "'";
  // console.log("Delete msg query=>",sql);
  connection.query(sql, function (err, res) {
    if (err) {
      throw err;
    } else {
      return callback(null, res);
    }
  });
}

User.createGroup = function (callback, postData) {

  const sql1 = "INSERT IGNORE INTO groups(group_name,created_by_id,group_profile_picture) VALUES('" + postData.group_name + "','" + postData.created_by_id + "','" + postData.group_profile_picture + "')";
  //console.log("sql",sql1);
  connection.query(sql1, function (err, groupData) {
    if (err) {
      throw err;
    } else {

      if (groupData.insertId <1)
          return callback(null, groupData.insertId);
          
        for (let index = 0; index < postData.groupMember.length; index++) {
          const sql2 = "INSERT IGNORE INTO group_member(group_id,user_id) VALUES('" + groupData.insertId + "','" + postData.groupMember[index] + "')";
          //console.log("sql", sql2);
          connection.query(sql2, function (err, res) {
            if (err) {
              throw err;
            } else {
              //return callback(null, res);
            }
          });
        }
      
    }
  });
}

module.exports = User;

