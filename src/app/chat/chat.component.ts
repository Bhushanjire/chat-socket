import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chatForm: FormGroup;
  userList = [];
  messages: string[] = [];
  selectedUser = "Select contact";
  loginUser: any;
  loginUsername: string;
  private url = 'http://localhost:3000';

  private socket;
  constructor(private chatService: ChatService, private route: Router) { }

  ngOnInit() {
    this.chatService.isLoggedIn.subscribe((res) => {
      console.log(res);
      if (res) {
        this.chatService.updateSocketIdService().subscribe(responce => {
          console.log(responce);
        });
      }

    })

    // this.httpclient.post(this.APIPATH + "addSocketId", postData).pipe(map((res: any) => res));

    this.loginUser = localStorage.getItem('user_id');
    this.loginUsername = localStorage.getItem('user_name');
    this.chatForm = new FormGroup({
      "message": new FormControl(null, Validators.required),
      "from_user_id": new FormControl(null, Validators.required),
      "from_user_name": new FormControl(null, Validators.required),
      "to_user_id": new FormControl(null, Validators.required),
      "to_user_name": new FormControl(null, Validators.required),
      "socket_id": new FormControl(null),
    });

    this.chatService.getMessages().subscribe((message: string) => {
      console.log("message~~~~~~~~~~~~~~~~~~~", message); 
      this.messages.push(message);
    });
    this.chatService.updatedUsers.subscribe((res) => {
      console.log(res);
      this.userList = res;
    })

    // this.getUserList();
  }
  // getUserList() {
  //   this.chatService.getUserService().subscribe(responce => {
  //     if (responce.success == true) {
  //       this.userList = responce.data;
  //     }
  //   });

  // }
  getUser(userData) {
    // console.log(userData);
    // this.getUserList();
    this.selectedUser = userData.name;
    this.chatService.getAllUsers();
    userData = this.userList.filter((user) => user.user_id === userData.user_id);
    
    
    this.chatForm.patchValue({
      "from_user_id": localStorage.getItem('user_id'),
      "from_user_name": localStorage.getItem('user_name'),
      "to_user_id": userData[0].user_id,
      "to_user_name": userData[0].name,
      "socket_id": userData[0].socket_id
    });
  }
  sendMessage(data) {
    console.log(data.value);
    let sendData = {
      "id": data.value.to_user_id,
      "name": data.value.to_user_name,
      "chatMsg": data.value.message,
      "user_id": localStorage.getItem('user_id'),
      "to_socket_id": data.value.socket_id
    };
    console.log("&&&&&&&&",sendData);
    
    this.chatService.sendMessageService(sendData);
    this.chatForm.patchValue({
      "message": "",
    });
    //this.chatForm.reset();
  }
  logout() {
    localStorage.clear();
    this.route.navigate(['/signin']);
  }
}
