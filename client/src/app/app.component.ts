import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { GLOBAL} from './services/global'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  public title:string;
  public identity;
  public url:string;

  constructor(private userService: UserService,private activatedRoute: ActivatedRoute, private router: Router) {
    this.title = 'My social Network';
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.identity = this.userService.getIdentity();

  }

  ngDoCheck() {
    this.identity = this.userService.getIdentity();
  }

  logout() {
    localStorage.clear();
    this.identity = null;
    this.router.navigate(['/'])
  }
}
