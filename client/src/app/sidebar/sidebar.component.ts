import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { GLOBAL} from '../services/global';
import { Publication } from '../models/publication'
import { PublicationService } from '../services/publication.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public url:string
  public identity;
  public token;
  public stats;
  public status;
  public publication: Publication
  constructor(private userService: UserService, private publicationService: PublicationService) { 
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.stats = this.userService.getStats();
    this.publication = new Publication('','','','',this.identity._id)
    
  }

  ngOnInit() {
  }

  onSubmit(form) {
    this.publicationService.addPublication(this.token, this.publication).subscribe(response => {
      if(response.publication) {
        this.publication = response.publication;
        this.status = 'success'
        form.reset()
      }
      else {
        this.status = 'error'
      }
    }, err => {
      console.log(err)
      if (err != null) {
        this.status = 'error'
      }
    })
  }

}
