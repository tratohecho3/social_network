import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { FollowService } from '../../services/follow.service';
import { Message } from '../../models/message';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-sended',
  templateUrl: './sended.component.html',
  styleUrls: ['./sended.component.css']
})
export class SendedComponent implements OnInit {
  public title:string
  public message: any;
  public identity;
  public token;
  public url: string;
  public status: string;
  public messages: any[];
  public pages;
  public total;
  public page;
  public next_page;
  public prev_page;


  constructor(private messageService: MessageService, private followService: FollowService, private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService) {
    this.title = "Mensajes enviados";
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;

  }

  ngOnInit() {
    this.actualPage();
  }

  getMessages(token, page) {
    this.messageService.getEmmitMessages(token, page).subscribe(response => {
      if(!response.messages){
        this.messages = response.messages
      }
      else {
        this.messages = response.messages;
        this.total = response.total;
        this.pages = response.pages;

      }
    }, err => {
      console.log(err)
    })
  }
  actualPage() {
    this.activatedRoute.params.subscribe(params => {
      let page = +params['page'];
      this.page = page;
      if(!params['page']) {
        page = 1;
      }
      if(!page) {
        page = 1
      }
      else {
        this.next_page = page + 1;
        this.prev_page = page - 1;
        
        if(this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }

      this.getMessages(this.token, this.page);
    })
  }
}
