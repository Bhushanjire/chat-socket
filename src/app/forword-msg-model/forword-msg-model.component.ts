import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from '../chat.service';



@Component({
  selector: 'app-forword-msg-model',
  templateUrl: './forword-msg-model.component.html',
  styleUrls: ['./forword-msg-model.component.scss']
})
export class ForwordMsgModelComponent implements OnInit {
  @Input() name;
  constructor(public activeModal: NgbActiveModal,private chatService: ChatService) {}

  ngOnInit() {
  }

 

  


}
