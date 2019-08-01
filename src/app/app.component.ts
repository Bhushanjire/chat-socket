import { Component,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chatApp';
  constructor(private route : Router, private chatService: ChatService){}
  ngOnInit(){
    //this.route.navigate(['signin']);
    if(localStorage.getItem('user_id')){
      
      this.route.navigate(['chat']);

     // this.route.navigate(['signup']);
    }else{
      this.route.navigate(['signup']);
    }
  }
}
