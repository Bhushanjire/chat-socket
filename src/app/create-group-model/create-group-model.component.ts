import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-create-group-model',
  templateUrl: './create-group-model.component.html',
  styleUrls: ['./create-group-model.component.scss']
})
export class CreateGroupModelComponent implements OnInit {
  @Input() userList;
  createGroupForm :FormGroup;
  addedUser=[];
  constructor(public activeModal: NgbActiveModal) { }

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

  }

  addUser(data){
    this.addedUser.push(data);
  }

}
