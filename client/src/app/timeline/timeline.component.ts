import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import { GLOBAL } from '../services/global';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  public identity;
  public token;
  public title:string;
  public url:string;
  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { 
    this.title = 'Timeline';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
  }

}
