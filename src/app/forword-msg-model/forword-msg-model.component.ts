import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from '../chat.service';



@Component({
  selector: 'app-forword-msg-model',
  templateUrl: './forword-msg-model.component.html',
  styleUrls: ['./forword-msg-model.component.scss']
})
export class ForwordMsgModelComponent implements OnInit {
  @Input() userList;
  @Input() chatData;
  loginUser = localStorage.getItem('user_id');
  constructor(public activeModal: NgbActiveModal,private chatService: ChatService) {}

  ngOnInit() {
    for(let i=0;i<this.userList.length;i++){
      this.userList[i].is_send='no';
    }

   // console.log("user List",)
    
  }
  sendForwordMessage(data,userData,optionalMsg){
    optionalMsg = optionalMsg!="" ? "<hr>"+optionalMsg : "";
    let sendData = {
      "to_user_id": userData.user_id,
      "to_user_name": data.to_user_name,
      "message": data.message+""+optionalMsg,
      "from_user_id": localStorage.getItem('user_id'),
      "from_user_name": localStorage.getItem('user_name'),
      "to_socket_id": data.socket_id,
      "added_date_time": new Date(),
      "is_block": 'no',
      "chat_id": 0,
      "edit_message": "",
      "is_forwarded" :"yes"
    };
    userData.is_send='yes';
   // console.log("optionalMsg",sendData);
    this.chatService.sendMessageService(sendData);
  }

 

  


}
