const connection=require('../Config/db'); //reference of db.js

const User = function(task){
};

User.createUserModel=function(p,result){
  let profile_picture = "https://picsum.photos/id/"+Math.ceil(Math.random()*100)+"/500/500";
   const sql = "INSERT INTO users(name,username,password,profile_picture) VALUES('"+p.name+"','"+p.username+"','"+p.password+"','"+profile_picture+"')";
    connection.query(sql,function(err,res){
     return  err ? result(err, null) :  result(null, res.insertId);  
    });
}

User.getUserListModel = function(result){
    connection.query("SELECT U.user_id,U.name,U.username,OU.socket_id FROM users U LEFT JOIN online_users OU ON U.user_id=OU.user_id", function (err, res) {
      return  err ? result(err, null) : result(null, res);  
    });
};

User.loginModel=function(p,result){
  const sql = "SELECT * FROM users WHERE username='"+p.username+"' AND password='"+p.password+"'";
  connection.query(sql, function (err, res) {
    return  err ? result(err, null) : result(null, res);  
  });
}

User.addSocketIdModel=function(p,result){
  const sql = "REPLACE INTO online_users(user_id,socket_id) VALUES('"+p.user_id+"','"+p.socket_id+"')";
    connection.query(sql,function(err,res){
     return  err ? result(err, null) :  result(null, res.insertId);  
    });
}
module.exports= User;

