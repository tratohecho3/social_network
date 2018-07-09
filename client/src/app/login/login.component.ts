import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user'
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public title:string;
  public user: User;
  public status: string;
  public identity;
  public token;

  constructor(private userService: UserService, private router:Router, private activatedRoute: ActivatedRoute) {
    this.title = 'identificate';
    this.user = new User("","","","","","","ROLE_USER","")

   }

  ngOnInit() {
    console.log("componente login cargado")
  }

  onSubmit() {
    this.userService.signUp(this.user).subscribe(
      response => {
        this.identity = response.user;
        console.log(this.identity)
        if (!this.identity || !this.identity._id){
          this.status = 'error';
        }
        else {
          this.status = 'success'
          localStorage.setItem('identity', JSON.stringify(this.identity));
          this.getToken();


        }
      },

      err => {
        console.log(err)
        if(err != null) {
          this.status = 'error'
        }
      }
    )
  }

  getToken() {
    this.userService.signUp(this.user, 'true').subscribe(
      response => {
        this.token = response.token;
        console.log(this.token)
        if (this.token.length <= 0){
          this.status = 'error';
        }
        else {
          localStorage.setItem('token', JSON.stringify(this.token));
          this.getCounters();
          this.router.navigate(['/'])
        }
      },

      err => {
        console.log(err)
        if(err != null) {
          this.status = 'error'
        }
      }
    )
  }

  getCounters() {
    this.userService.getCounters().subscribe(
      response => {
        localStorage.setItem('stats', JSON.stringify(response))
      },

      err => {
        console.log(err)
      }
    )
  }


}
