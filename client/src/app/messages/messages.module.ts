import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { AddComponent } from './add/add.component';
import { ReceivedComponent } from './received/received.component';
import { SendedComponent } from './sended/sended.component';
import { MessagesRoutingModule } from './messages-routing.module';
import { FormsModule } from '../../../node_modules/@angular/forms';
import {MomentModule} from 'angular2-moment';
import { UserGuard } from '../services/user.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessagesRoutingModule,
    MomentModule
  ],
  declarations: [MainComponent, AddComponent, ReceivedComponent, SendedComponent],
  exports: [
    MainComponent, AddComponent, ReceivedComponent, SendedComponent
  ],
  providers: [UserGuard]
})
export class MessagesModule { }
