import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path : "signup",component:SignupComponent },
  { path : "signin",component:SigninComponent },
  { path : "chat",component:ChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
