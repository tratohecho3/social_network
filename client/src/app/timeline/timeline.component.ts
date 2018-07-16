import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import { GLOBAL } from '../services/global';
import { PublicationService } from '../services/publication.service';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  public identity;
  public token;
  public title:string;
  public url:string;
  public status:string;
  public page;
  public publications: any[];
  public total;
  public pages;
  public itemsPerPage;
  public noMore;
  public showImage;
  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute, private publicationService: PublicationService) { 
    this.title = 'Timeline';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;
  }

  ngOnInit() {
    this.getPublications(1)
  }

  getPublications(page, adding = false) {
    this.publicationService.getPublications(this.token, page).subscribe(response => {
      if(response.publications) {
        this.total = response.total_items;
        this.pages = response.pages; 
        this.itemsPerPage = response.items_per_page;
        if(!adding) {
          this.publications = response.publications;
        }
        else {
          let arrayA = this.publications;
          let arrayB = response.publications;
          this.publications = arrayA.concat(arrayB);
        }


      }
      else {
        this.status = 'error';
      }
    }, err => {
      console.log(err);
      if( err != null) {
        this.status = 'error';
      }
    })
  }
/*
  viewMore() {
    this.page += 1;

    if(this.publications.length + this.itemsPerPage >= (this.total)) {
      
      this.noMore = true;
    }

    this.getPublications(this.page, true)

  }*/
  
  viewMore() {
    this.page += 1;
    if(this.page == this.pages) {
      
      this.noMore = true;
    }

    this.getPublications(this.page, true)

  }

  refresh(event= null) {
    this.getPublications(1);
    
  }

  showThisImage(id) {
    this.showImage = id;
  }

  hideThisImage() {
    this.showImage = 0;
  } 
  deletePublication(id) {
    this.publicationService.deletePublication(this.token, id).subscribe(response => {
      this.refresh()
    }, err => {
      console.log(err)
    })
  }

}
