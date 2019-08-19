import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../chat.service';



@Component({
  selector: 'app-create-group-model',
  templateUrl: './create-group-model.component.html',
  styleUrls: ['./create-group-model.component.scss']
})
export class CreateGroupModelComponent implements OnInit {
  @Input() userList;
  createGroupForm :FormGroup;
  groupMember=[];
  postData;
  constructor(public activeModal: NgbActiveModal,private chatService: ChatService) { }

  ngOnInit() {
    for(let i=0;i<this.userList.length;i++){
      this.userList[i].is_send='no';
    }
    this.createGroupForm = new FormGroup({
      "group_name" : new FormControl(null,Validators.required),
      "group_profile_picture" :new FormControl(null)
    })
  }

  createGroup(data){
    this.postData ={
      "created_by_id" : localStorage.getItem('user_id'),
      "groupMember" : this.groupMember,
      "group_name" : data.value.group_name,
      "group_profile_picture" : data.value.group_profile_picture
    }
   
    this.chatService.createGroupService(this.postData);
  }
  seletGroupImage(event){
    event.preventDefault();
    let element: HTMLElement = document.getElementById('group_profile_picture') as HTMLElement;
    element.click();
  }

  addGroupMember(event,userData){
    if(event.target.checked){
      this.groupMember.push(userData.user_id);
    }else{
      var index = this.groupMember.indexOf(210);
      this.groupMember.splice(index, 1);
    }
    
    console.log("groupMember",this.groupMember);
  }

}
