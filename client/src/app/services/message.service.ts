import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../../node_modules/@angular/common/http';
import { GLOBAL } from './global';
import { Observable } from '../../../node_modules/rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public url:string

  constructor(private httpClient: HttpClient ) { 
    this.url = GLOBAL.url;
  }

  addMessage(token, message): Observable<any> {
    let params = JSON.stringify(message);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this.httpClient.post(this.url + 'message', params, {headers});
  }

  getMyMessages(token, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this.httpClient.get(this.url + 'my-messages/' + page, {headers});

  }

  getEmmitMessages(token, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this.httpClient.get(this.url + 'messages/' + page, {headers});

  }
}
