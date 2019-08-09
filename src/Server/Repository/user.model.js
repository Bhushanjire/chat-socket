const connection = require('../Config/db'); //reference of db.js

const User = function (task) {
};

User.createUserModel = function (p, result) {
  let profile_picture = "https://picsum.photos/id/" + Math.ceil(Math.random() * 100) + "/500/500";
  const sql = "INSERT INTO users(name,username,password,profile_picture) VALUES('" + p.name + "','" + p.username + "','" + p.password + "','" + profile_picture + "')";
  connection.query(sql, function (err, res) {
    return err ? result(err, null) : result(null, res.insertId);
  });
}

User.getAllUser = function (callback, postData) {

  if (postData.conversation_id) {
    postData.from_user_id = postData.conversation_id;
  }
  const sql = "SELECT U.user_id,U.name,U.username,U.profile_picture,OU.socket_id,(select COUNT(`chat_id`) FROM private_chat WHERE from_user_id=U.user_id AND to_user_id='" + postData.from_user_id + "' AND  `is_read`='no' AND conversation_id='" + postData.from_user_id + "' GROUP by to_user_id) AS unread_msg,(SELECT block_id FROM block_user_list WHERE to_user_block_id='" + postData.from_user_id + "' AND from_user_block_id=U.user_id) AS blocked,(SELECT block_id FROM block_user_list WHERE from_user_block_id='" + postData.from_user_id + "' AND to_user_block_id=U.user_id) AS unblock FROM users U LEFT JOIN online_users OU ON U.user_id=OU.user_id";
  connection.query(sql, function (err, userList) {
    return err ? callback(err, null) : callback(null, userList);
  });
};

User.getChatMessages = function (callback, postData) {
  const sql = "SELECT * FROM private_chat WHERE ((to_user_id='" + postData.from_user_id + "' AND from_user_id='" + postData.to_user_id + "') OR (to_user_id='" + postData.to_user_id + "' AND from_user_id='" + postData.from_user_id + "')) AND conversation_id='" + postData.conversation_id + "' AND is_block='no'";
  //console.log("Chatting List",sql);
  connection.query(sql, function (err, chatList) {
    return err ? callback(err, null) : callback(null, chatList);
  });
}

User.insertChatMessage = function (callback, postData) {
  const sql = "INSERT INTO private_chat(from_user_id,from_user_name,to_user_id,to_user_name,message,message_type,conversation_id,is_block,is_read)VALUES('" + postData.from_user_id + "','" + postData.from_user_name + "','" + postData.to_user_id + "','" + postData.to_user_name + "','" + postData.message + "','" + postData.message_type + "','" + postData.conversation_id + "','" + postData.is_block + "','" + postData.is_read + "')";
  //console.log("Chat Insert Query=>", sql);
  connection.query(sql, function (err, chatList) {
    return err ? callback(err, null) : callback(null, chatList);
  });
}

User.updateMessageAsRead = function (callback, postData) {
  const sql = "UPDATE private_chat SET is_read='yes' WHERE ((to_user_id='" + postData.from_user_id + "' AND from_user_id='" + postData.to_user_id + "'))";
  connection.query(sql, function (err, chatList) {
    return err ? callback(err, null) : callback(null, chatList);
  });
}

User.deleteUser = function (callback, postData) {
  const sql = "DELETE FROM online_users WHERE user_id='" + postData.user_id + "'";
  connection.query(sql, function (err, chatList) {
    return err ? callback(err, null) : callback(null, chatList);
  });
}

User.clearChat = function (callback, postData) {
  const sql = "DELETE FROM private_chat WHERE ((to_user_id='" + postData.from_user_id + "' and from_user_id='" + postData.to_user_id + "') OR (to_user_id='" + postData.to_user_id + "' AND from_user_id='" + postData.from_user_id + "')) AND conversation_id='" + postData.from_user_id + "'";
  connection.query(sql, function (err, chatList) {
    return err ? callback(err, null) : callback(null, chatList);
  });
}

User.blockUser = function (callback, postData) {
  if (postData.blockType == 'Block') {
    const sql = "INSERT IGNORE INTO block_user_list(from_user_block_id,to_user_block_id) VALUES('" + postData.from_block_user_id + "','" + postData.to_block_user_id + "')";
    connection.query(sql, function (err, chatList) {
      return err ? callback(err, null) : callback(null, chatList);
    });
  } else {
    const sql = "DELETE FROM block_user_list WHERE (from_user_block_id='" + postData.from_block_user_id + "' AND to_user_block_id='" + postData.to_block_user_id + "') ";
    connection.query(sql, function (err, chatList) {
      return err ? callback(err, null) : callback(null, chatList);
    });
  }
}

User.checkUserBlock = function(callback,postData){
  const sql = "SELECT to_user_block_id FROM block_user_list WHERE from_user_block_id='" + postData.to_user_id + "' AND to_user_block_id='" + postData.from_user_id + "'";
  console.log(sql);
  connection.query(sql, function (err, res) {
    return err ? callback(err, null) : callback(null, res);
  });
}

User.loginModel = function (p, result) {
  const sql = "SELECT * FROM users WHERE username='" + p.username + "' AND password='" + p.password + "'";
  connection.query(sql, function (err, res) {
    return err ? result(err, null) : result(null, res);
  });
}

User.addSocketIdModel = function (p, result) {
  const sql = "REPLACE INTO online_users(user_id,socket_id) VALUES('" + p.user_id + "','" + p.socket_id + "')";
  connection.query(sql, function (err, res) {
    return err ? result(err, null) : result(null, res.insertId);
  });
}
module.exports = User;

