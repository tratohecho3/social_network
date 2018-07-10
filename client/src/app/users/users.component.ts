import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';
import { FollowService } from '../services/follow.service';
import { Follow } from '../models/follow';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public url;
  public title:string;
  public identity;
  public token;
  public page;
  public next_page;
  public prev_page;
  public status:string;
  public total;
  public pages; 
  public users: User[];
  public follows;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService, private followService: FollowService) { 
    this.title = 'Gente';
    this.url = GLOBAL.url;
    this.identity = userService.getIdentity();
    this.token = userService.getToken();
  }

  ngOnInit() {
    this.actualPage()
     
  }

  actualPage() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params)
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
      this.getUsers(page);
    })
  }

  getUsers(page) {
    this.userService.getUsers(page).subscribe(response => {
      if(!response.users) {
        this.status = 'error';
      }
      else {
        this.total = response.total;
        this.users = response.users;
        this.pages = response.pages;
        this.follows = response.users_following;
        if(page > this.pages) {
          this.router.navigate(['/gente',1]);
        }
      }
    },
  err => {
    console.log(err)
    if(err != null) {
      this.status = 'error'
    }
  })
  }

  public followUserOver;
  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }

  mouseLeave(user_id) {
    this.followUserOver = 0;
  }

  followUser(followed) {
    let follow = new Follow('',this.identity._id, followed);

    this.followService.addFollow(this.token, follow).subscribe(response => {
      if(!response.follow){
        this.status = 'error'
      }
      else {
        this.status = 'success';
        this.follows.push(followed)
      }
    }, err =>{
      console.log(err);
      if (err != null) {
        this.status = 'error'
      }
    })
  }

  unfollowUser(followed) {
    this.followService.deleteFollow(this.token, followed).subscribe(response => {
      let i = this.follows.indexOf(followed);
      if( i != -1) {
        this.follows.splice(i,1)
      }
    }, err =>{
      console.log(err);
      if (err != null) {
        this.status = 'error'
      }
    })
  }
}
