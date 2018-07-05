import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  public title:string;
  public identity;

  constructor(private userService: UserService) {
    this.title = 'My social Network';
  }

  ngOnInit() {
    this.identity = this.userService.getIdentity();

  }

  ngDoCheck() {
    this.identity = this.userService.getIdentity();
  }
}
