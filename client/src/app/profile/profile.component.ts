import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '../../../node_modules/@angular/router';
import { User } from '../models/user';
import { Follow } from '../models/follow';
import { UserService } from '../services/user.service';
import { FollowService } from '../services/follow.service';
import { GLOBAL } from '../services/global';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public url;
  public title;
  public user: any;
  public status:string;
  public identity;
  public token;
  public stats;
  public followed;
  public following;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService, private followService: FollowService) {
    this.url = GLOBAL.url;
    this.title = "Perfil";
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.followed, this.following = false;

   }

  ngOnInit() {
    this.loadPage()
  }

  loadPage() {
     this.activatedRoute.params.subscribe(params => {
       let id = params['id'];
       this.getUser(id);
       this.getCounters(id);
     })
  }
  getUser(id) {
    this.userService.getUser(id).subscribe(response => {
      if(response.user) {
        this.user = response.user;
        if(response.following){
          if(response.following._id) {
            this.following = true;
          }
          else {
            this.following = false;
          }
        }

        if(response.followed) {
          if(response.followed._id) {
            this.followed = true;
          }
          else {
            this.followed = false;
          }
        }

      }
      else {
        this.status = 'error';
      }
    }, err => {
      console.log(err)
      this.router.navigate(['/perfil', this.identity._id])
    })
  }

  getCounters(id) {
    this.userService.getCounters(id).subscribe(response => {
      this.stats = response;
    },err => {
      console.log(err)
    })
  }

  followUser(followed) {
    let follow = new Follow('', this.identity._id,followed);
    this.followService.addFollow(this.token, follow).subscribe(response => {
      this.following = true;
    }, err => {
      console.log(err)
    })
  }

  unfollowUser(followed) {
    this.followService.deleteFollow(this.token, followed).subscribe(response => {
      this.following = false;
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
}
