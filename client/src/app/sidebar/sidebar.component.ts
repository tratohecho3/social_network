import { Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { UserService } from '../services/user.service';
import { GLOBAL} from '../services/global';
import { Publication } from '../models/publication'
import { PublicationService } from '../services/publication.service';
import { Router, ActivatedRoute, Params } from '../../../node_modules/@angular/router';
import { UploadService } from '../services/upload.service';

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
  constructor(private userService: UserService, private publicationService: PublicationService,private router: Router, private activatedRoute: ActivatedRoute, private uploadService: UploadService) { 
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.stats = this.userService.getStats();
    this.publication = new Publication('','','','',this.identity._id)
    
  }

  ngOnInit() {
  }

  onSubmit(form, event) {
    this.publicationService.addPublication(this.token, this.publication).subscribe(response => {
      if(response.publication) {
       // this.publication = response.publication;
        if(this.filesToUpload && this.filesToUpload.length) {
          this.uploadService.makeFileRequest(this.url +'upload-image-pub/' + response.publication._id,[], this.filesToUpload, this.token, 'image')
          .then((result:any) => {
            this.publication.file = result.image;
            this.status = 'success'
            form.reset();
            this.router.navigate(['/timeline']);
            this.sended.emit({send:'true'})

          })
        }
        else {
          this.status = 'success'
          form.reset();
          this.router.navigate(['/timeline']);
          this.sended.emit({send:'true'})

        }

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

  public filesToUpload: Array<File>;

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  @Output() sended = new EventEmitter();

}
