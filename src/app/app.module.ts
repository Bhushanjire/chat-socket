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

import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
import { EscapeCssPipe } from './pipes/keep-css.pipe';
import {SearchPipe} from '../app/pipes/search.pipe';


import { ClipboardModule } from 'ngx-clipboard';

import { ChatService } from './chat.service';
import { ForwordMsgModelComponent } from './forword-msg-model/forword-msg-model.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ZoomImageComponent } from './zoom-image/zoom-image.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    ChatComponent,
    EscapeHtmlPipe,
    EscapeCssPipe,
    SearchPipe,
    ForwordMsgModelComponent,
    ZoomImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PickerModule,
    EmojiModule,
    ClipboardModule,
    NgbModule
  ],
  providers: [ChatService,AuthService,AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [ForwordMsgModelComponent],
})
export class AppModule { }
