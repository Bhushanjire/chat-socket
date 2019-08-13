import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm : FormGroup;
  constructor(private auth: AuthService,private router : Router) { }
  ngOnInit() {
    this.signupForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }
  signup(data){
    this.auth.signupService(data.value).subscribe(responce=>{
      if(responce.success==true){
          localStorage.setItem("user_id",responce.user_id);
          this.router.navigate(['/chat']);
      }else{
        this.router.navigate(['/signup']);
      }
    });
  }
}
