import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';
import { FollowService } from '../services/follow.service';
import { Follow } from '../models/follow';
@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
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
  public following;
  public userPageId;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService, private followService: FollowService) { 
    this.title = 'Usuarios seguidos por';
    this.url = GLOBAL.url;
    this.identity = userService.getIdentity();
    this.token = userService.getToken();
  }

  ngOnInit() {
    this.actualPage()
     
  }
  actualPage() {
    this.activatedRoute.params.subscribe(params => {
      let user_id = params['id'];
      this.userPageId = user_id;
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

      this.getUser(user_id, page);
    })
  }

  getFollows(user_id, page) {
    this.followService.getFollowing(this.token, user_id, page).subscribe(response => {
      if(!response.follows) {
        this.status = 'error';
      }
      else {
        
        this.total = response.total;
        this.following = response.follows;
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
  public user: any
  getUser(user_id, page) {
    this.userService.getUser(user_id).subscribe(response => {
      if(response.user){
        this.user = response.user;
        this.getFollows(user_id, page);

      }
      else {
        this.router.navigate(['/home'])
      }
    }, err => {
      console.log(err)
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
