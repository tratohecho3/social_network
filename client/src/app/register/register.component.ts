import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user'
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public title:string;
  public user: User;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private userService: UserService) { 
    this.title = 'Registrate';
    this.user = new User("","","","","","","ROLE_USER","")
  }

  ngOnInit() {
    console.log('Componente de register cargado')
  }

  onSubmit() {
    this.userService.register(this.user);
  }
}
