import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Publication } from '../models/publication';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  public url:string;
  constructor(private http: HttpClient) { 
    this.url = GLOBAL.url;
  }


  addPublication(token, publication): Observable<any> {
    let params = JSON.stringify(publication);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.post(this.url+'publication', params, {headers});   
  }

  getPublications(token, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.get(this.url + 'publications/' + page, {headers});
  }

  getPublicationsUser(token, user_id, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.get(this.url + 'publications-user/'+ user_id + '/'+page, {headers});
  }

  deletePublication(token, id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.delete(this.url + 'publication/' + id, {headers})

  } 
}
