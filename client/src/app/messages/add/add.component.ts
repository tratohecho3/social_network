import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { FollowService } from '../../services/follow.service';
import { Message } from '../../models/message';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  public title:string
  public message: Message;
  public identity;
  public token;
  public url: string;
  public status: string;
  public follows;
  constructor(private messageService: MessageService, private followService: FollowService, private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService) {
    this.title = 'Enviar mensaje'
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.message = new Message('','','','',this.identity._id,'');

   }

  ngOnInit() {
    this.getMyFollows();
  }

  getMyFollows() {
    this.followService.getMyFollows(this.token).subscribe(response  => {
      this.follows = response.follows
    }, err => {
      console.log(err)
    })
  }

  onSubmit(form) {
    this.messageService.addMessage(this.token, this.message).subscribe(response => {
      if(response.message) {
        this.status = 'success';
        form.reset()
      }
    },err => {
      this.status = 'error';
      console.log(err)
    })
  }

}
