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
  messages: any;
  selectedUser = "Select contact";
  loginUser: any;
  loginUsername: string;
  chatFormDiv = false;
  chatMessageDiv = false;
  noOnlineUser = false;
  profile_picture = "";
  chat_profile_picture = false;
  showSelectedUser = 0;
  attachment: any;
  showEmojiPicker = false;
  emojiMessage = "";
  uploadedFiles: Array<File>;
  imageFile1: File = null;
  imgHideShow1: boolean = false;
  imgUrl1 = null;
  postData: any;
  fileType = "";
  blockUnblock: string;
  blockType: string;
  actionOnMessage :any;

  constructor(private chatService: ChatService, private route: Router) { }

  ngOnInit() {
    this.loginUser = localStorage.getItem('user_id');
    this.loginUsername = localStorage.getItem('user_name');
    this.profile_picture = localStorage.getItem('profile_picture');

    this.chatForm = new FormGroup({
      "message": new FormControl("", Validators.required),
      "from_user_id": new FormControl(null, Validators.required),
      "from_user_name": new FormControl(null, Validators.required),
      "to_user_id": new FormControl(null, Validators.required),
      "to_user_name": new FormControl(null, Validators.required),
      "socket_id": new FormControl(null),
      "attachment": new FormControl(null),
      "blocked": new FormControl(0),
    });

    this.chatService.getMessages().subscribe((responce: any) => {
       //this.messages.push(message);
      if (responce.length > 0) {
        if ((responce[0].from_user_id == this.loginUser && responce[0].to_user_id == this.showSelectedUser) || (responce[0].from_user_id == this.showSelectedUser && responce[0].to_user_id == this.loginUser)){
          this.messages = responce;
        }else{
          this.messages = [];
        }
      }else{
         this.messages = [];
       }
    });

    this.chatService.updateUnreadMsgCount().subscribe(responce => {
      this.userList = responce;
    });

    this.chatService.setChatMessages().subscribe((responce: any) => {
      if(responce.length>0){
         if ((responce[0].from_user_id == this.loginUser && responce[0].to_user_id == this.showSelectedUser) || (responce[0].from_user_id == this.showSelectedUser && responce[0].to_user_id == this.loginUser)){
          this.messages = responce;
         }else{
           this.messages = [];
         }
        }else{
           this.messages = [];
         }
    });

    this.chatService.updatedUsers.subscribe((res) => {
      if (res.length == 1) {
        this.chatMessageDiv = false;
        this.noOnlineUser = true;
      } else {
          this.userList = res;
        this.chatMessageDiv = true;
        this.noOnlineUser = false;
      }
    });
  }
  getUser(userData) {
    this.chatFormDiv = true;
    this.selectedUser = userData.name;
    //this.chatService.getAllUsers();
    //userData = this.userList.filter((user) => user.user_id === userData.user_id);

    this.chatForm.patchValue({
      "from_user_id": localStorage.getItem('user_id'),
      "from_user_name": localStorage.getItem('user_name'),
      "to_user_id": userData.user_id,
      "to_user_name": userData.name,
      "socket_id": userData.socket_id,
      "blocked": userData.blocked == null ? 0 : userData.blocked
    });

    if (userData.unblock == null) {
      this.blockUnblock = "Block";
    } else {
      this.blockUnblock = "Unblock";
    }

    this.chat_profile_picture = userData.profile_picture;
    this.chatService.getChatMessageService(userData.user_id, userData.socket_id);
    this.showSelectedUser = userData.user_id;
  }
  sendMessage(data) {
    if(this.blockUnblock=="Unblock"){
      alert("Unblock,to send the message");
      return false;
    }
    let sendData = {
      "to_user_id": data.value.to_user_id,
      "to_user_name": data.value.to_user_name,
      "message": data.value.message,
      "from_user_id": localStorage.getItem('user_id'),
      "from_user_name": localStorage.getItem('user_name'),
      "to_socket_id": data.value.socket_id,
      "added_date_time": new Date(),
      "is_block": data.value.blocked
    };

    this.chatService.sendMessageService(sendData);
    this.chatForm.patchValue({
      "message": "",
    });
    this.showEmojiPicker = false;
  }

  blockUser(block_user_id, blockType) {
    this.postData = {
      "from_user_id": localStorage.getItem('user_id'),
      "to_user_id": block_user_id,
      "blockType": blockType
    }
    if (blockType == 'Block') {
      let confirmRes = confirm("Block "+this.chatForm.value.to_user_name+"? Blocked contacts will no longer be able to send you messages.");
      if(confirmRes){
        this.blockUnblock = "Unblock";
        this.chatService.blockUserService(this.postData);
      }
    } else if (blockType == 'Unblock') {
      this.blockUnblock = "Block";
      this.chatService.blockUserService(this.postData);
    }
  }

  openAttchment(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.getElementById('attachment') as HTMLElement;
    element.click();
  }

  onFileChange(event: any) {
    this.imgHideShow1 = true;
    var target: HTMLInputElement = event.target as HTMLInputElement;

    this.uploadedFiles = event.target.files;
    this.attachment = this.uploadedFiles[0].name;

    let extension = this.attachment.split('.').pop();
    if (extension == 'mp4') {
      this.fileType = "video"
    } else {
      this.fileType = "image"
    }

    let sendData = {
      "to_user_id": this.chatForm.value.to_user_id,
      "to_user_name": this.chatForm.value.to_user_name,
      "message": "/home/rapidera/Pictures/" + this.attachment,
      "from_user_id": localStorage.getItem('user_id'),
      "from_user_name": localStorage.getItem('user_name'),
      "to_socket_id": this.chatForm.value.socket_id,
      "file_type": this.fileType,
      "added_date_time": new Date()
    };
    this.chatService.sendMessageService(sendData);
    console.log("File Change", event);
  }

  logout() {
    this.chatService.logoutService();
    localStorage.clear();
    this.route.navigate(['/signin']);
  }
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
  addEmoji(event) {
    this.emojiMessage = this.chatForm.value.message;
    const completeMessage = `${this.emojiMessage}${event.emoji.native}`;
    this.chatForm.patchValue({
      "message": completeMessage
    });
  }
  clearChat(to_user_id) {
    this.chatService.clearChatService(to_user_id);
    this.chatService.getChatMessageService(to_user_id, 0);
  }
  onRightClick(messageID) {
    return false;
  }
  actionOnMsg(chat_id){
    this.actionOnMessage = chat_id;
  }
  editMsg(chat_id){
    let chatArray = this.messages.filter(function( obj ) {
      return obj.chat_id ==chat_id;
  });
  console.log("chat array="+chatArray);
  //this.messages=chatArray;
  }
  copyMsg(chat_id){

  }
  forwordMsg(chat_id){

  }
  removeMsg(chat_id){
   let chatArray = this.messages.filter(function( obj ) {
      return obj.chat_id !==chat_id;
  });
  this.messages=chatArray;
    this.chatService.deleteMessageService(chat_id);
  }
}