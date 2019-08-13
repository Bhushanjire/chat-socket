import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ChatService } from './chat.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  APIPATH = "http://localhost:3000/";
  constructor(private myRoute: Router,private httpclient: HttpClient,private chatService: ChatService) { }

  public signupService(data) {
    return this.httpclient.post(this.APIPATH + "createUser", data).pipe(map((res: any) => res));
  }
  public signinService(data) {
    return this.httpclient.post(this.APIPATH + "login", data).pipe(map((res: any) => res));
  }

  public initSocket(user_id){
     //this.chatService.initConnection(user_id); 
  }
}
