import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from '../auth.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signinForm : FormGroup;
  constructor(private route : Router,private auth: AuthService) { }

  ngOnInit() {
    this.signinForm = new FormGroup({
      "username" : new FormControl(null,Validators.required),
      "password" : new FormControl(null,Validators.required)
    })
  }

  signin(data){
    this.auth.signinService(data.value).subscribe(responce=>{
     // console.log("SignIn Responce",responce);

      if(responce.success==true){   
        localStorage.setItem('user_id',responce.data[0].user_id);
        localStorage.setItem('user_name',responce.data[0].name);
        localStorage.setItem('profile_picture',responce.data[0].profile_picture);
        this.auth.initSocket(responce.data[0].user_id);
       // this.chatService.initConnection();
        this.route.navigate(['chat']);
      }else{

      }
    });
  }

}
