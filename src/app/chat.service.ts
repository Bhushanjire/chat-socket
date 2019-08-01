import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';



const url = 'http://localhost:3000';

//import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  APIPATH = "http://localhost:3000/";
  isLoggedIn = new BehaviorSubject(false);
  updatedUsers = new BehaviorSubject([]);
  socket = io(url);
  socketID;

  constructor(private httpclient: HttpClient) {
    this.initConnection();
    this.getAllUsers();
    this.getUpdatedUsers();
    

  }

  getAllUsers(){
    this.socket.emit("getAllUsers");
  }
getUpdatedUsers(){
  this.socket.on('users-list', (message) => {
    this.updatedUsers.next(message);
  });
}
  

  initConnection(){
    this.socket.on('connect', () => {
      console.log("socketID", this.socket.id); // 'G5p5...'
      this.socketID = this.socket.id;
      // updateSocketIdService();
      console.log(this.socket.connected); // true
      console.log(this.socket.disconnected); // false
      this.isLoggedIn.next(true);
      
    });
  }

  // public getUpdatedUsers(): Observable<any> {
  //     return this.socket.on('users-list', (message) => {
  //        this.updatedUsers.next(message);
  //     });

  // }


  public signupService(data) {
    return this.httpclient.post(this.APIPATH + "createUser", data).pipe(map((res: any) => res));
  }
  public signinService(data) {
    return this.httpclient.post(this.APIPATH + "login", data).pipe(map((res: any) => res));
  }
  public getUserService() {
    return this.httpclient.get(this.APIPATH + "userList").pipe(map((res: any) => res));
  }
  public sendMessageService(message) {
    console.log("senddata", message);
    message.user_socket_id=this.socketID;
    
    
    this.socket.emit('new-message', message);
  }

  public getMessages() {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        console.log(message);

        observer.next(message);
      });
    });
  }

  updateSocketIdService() {
    let postData = {
      "user_id": localStorage.getItem('user_id'),
      "socket_id": this.socketID
    }
    console.log("############", postData);

    return this.httpclient.post(this.APIPATH + "addSocketId", postData).pipe(map((res: any) => res));
  }

}
