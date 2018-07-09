import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user'
import { UploadService } from '../services/upload.service';
import { GLOBAL} from  '../services/global'

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  public title: string;
  public user: User;
  public identity;
  public token;
  public status: string;
  public url: string;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private userService: UserService, private uploadService: UploadService ) { 
    this.title = 'Actualizar mis datos';
    this.user = this.userService.getIdentity();
    this.identity = this.user;
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;

  }

  ngOnInit() {
  
  }

  onSubmit(form) {
    this.userService.updateUser(this.user).subscribe(
      response => {
        if(!response.user) {
          this.status = 'error'
        }
        else {
          this.status = 'success'
          localStorage.setItem('identity', JSON.stringify(this.user))
          this.identity = this.user;

          this.uploadService.makeFileRequest(this.url+'upload-image-user/'+this.user._id,[], this.filesToUpload, this.token, 'image')
            .then((result:any) => {
              this.user.image = result.user.image;
              localStorage.setItem('identity', JSON.stringify(this.user))
            })
        }
      },

      err => {
        console.log(err);
        if(err != null) {
          this.status  = 'error';
        }
      }
    )
  }
  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload)
  }

}
