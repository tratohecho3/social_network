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
  public status: string;


  constructor(private activatedRoute: ActivatedRoute, private router: Router, private userService: UserService) { 
    this.title = 'Registrate';
    this.user = new User("","","","","","","ROLE_USER","")
  }

  ngOnInit() {
    console.log('Componente de register cargado')
  }

  onSubmit(form) {
    this.userService.register(this.user).subscribe(
      response => {
        console.log(response)
        if(response.user && response.user._id){
          console.log(response.user)
          this.status = 'success'
          form.reset()
        }
        else {
          this.status = 'error'
        }
      },
      error => {
        console.log(error)
      }
    );
  }
}
