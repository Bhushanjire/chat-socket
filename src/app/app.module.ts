import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from "@angular/common/http";
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ChatComponent } from './chat/chat.component';

import { PickerModule } from '@ctrl/ngx-emoji-mart'
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji'



import { ChatService } from './chat.service';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PickerModule,
    EmojiModule
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
