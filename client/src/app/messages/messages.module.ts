import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { AddComponent } from './add/add.component';
import { ReceivedComponent } from './received/received.component';
import { SendedComponent } from './sended/sended.component';
import { MessagesRoutingModule } from './messages-routing.module';
import { FormsModule } from '../../../node_modules/@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessagesRoutingModule
  ],
  declarations: [MainComponent, AddComponent, ReceivedComponent, SendedComponent],
  exports: [
    MainComponent, AddComponent, ReceivedComponent, SendedComponent
  ]
})
export class MessagesModule { }
