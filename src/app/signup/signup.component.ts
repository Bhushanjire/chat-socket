import { Component, OnInit } from '@angular/core';
import {ChatService} from '../chat.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm : FormGroup;
  constructor(private chatservice : ChatService,private router : Router) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }
  signup(data){
    this.chatservice.signupService(data.value).subscribe(responce=>{
      if(responce.success==true){
          localStorage.setItem("user_id",responce.user_id);
          this.router.navigate(['/chat']);
      }else{
        this.router.navigate(['/signup']);
      }
    });
    console.log("signup",data.value);
  }
}
