import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ChatService} from '../chat.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signinForm : FormGroup;
  constructor(private chatService : ChatService,private route : Router) { }

  ngOnInit() {
    this.signinForm = new FormGroup({
      "username" : new FormControl(null,Validators.required),
      "password" : new FormControl(null,Validators.required)
    })
  }

  signin(data){
    this.chatService.signinService(data.value).subscribe(responce=>{
      if(responce.success==true){   
        localStorage.setItem('user_id',responce.data[0].user_id);
        localStorage.setItem('user_name',responce.data[0].name);
        localStorage.setItem('profile_picture',responce.data[0].profile_picture);
        this.route.navigate(['chat']);
      }else{

      }
    });
  }

}
