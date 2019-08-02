import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chatForm: FormGroup;
  userList = [];
  messages:any;
  selectedUser = "Select contact";
  loginUser: any;
  loginUsername: string;
  chatFormDiv=false;
  chatMessageDiv =false;
  noOnlineUser =false;
  profile_picture = "";
  chat_profile_picture=false;

  constructor(private chatService: ChatService, private route: Router) { }

  ngOnInit() {
    this.chatService.isLoggedIn.subscribe((res) => {
      console.log(res);
      if (res) {
        this.chatService.updateSocketIdService().subscribe(responce => {
          console.log(responce);
          this.chatService.getAllUsers();
        });
      }
    })
    this.loginUser = localStorage.getItem('user_id');
    this.loginUsername = localStorage.getItem('user_name');
    this.profile_picture = localStorage.getItem('profile_picture');
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
      //this.messages.push(message);
    });
    this.chatService.setChatMessages().subscribe((responce : any)=>{
      this.messages = responce;
    });

    this.chatService.updatedUsers.subscribe((res) => {
      console.log("Total User=>",res);
      if(res.length>1){
        this.userList = res;
        this.chatMessageDiv=true;
        this.noOnlineUser=false;
      }else{
        this.chatMessageDiv=false;
        this.noOnlineUser=true;
      }
    })
  }

  getUser(userData) {
    // console.log(userData);
    // this.getUserList();
    //userData.active=true;
    this.chatFormDiv=true;
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
    this.chat_profile_picture=userData[0].profile_picture;
    this.chatService.getChatMessageService(userData[0].user_id);
  }
  sendMessage(data) {
    console.log(data.value);
    let sendData = {
      "to_user_id": data.value.to_user_id,
      "to_user_name": data.value.to_user_name,
      "message": data.value.message,
      "from_user_id": localStorage.getItem('user_id'),
      "from_user_name": localStorage.getItem('user_name'),
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
    this.chatService.logoutService();
    localStorage.clear();
    this.route.navigate(['/signin']);
  }
}
