import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { GLOBAL} from './global'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FollowService {
  public url:string;
  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addFollow(token, follow): Observable<any> {
    let params = JSON.stringify(follow);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.post(this.url+'follow', params, {headers})
  }


  deleteFollow(token, id): Observable<any> {
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this.http.delete(this.url + 'follow/' + id, {headers})
  }

  getFollowing(token, userId = null, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let url = this.url + 'following/';
    if(userId != null) {
      url = this.url + 'following/' + userId + '/' + page;
    }
    return this.http.get(url, {headers})
  }

  getFollowed(token, userId = null, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let url = this.url + 'followed/';
    if(userId != null) {
      url = this.url + 'followed/' + userId + '/' + page;
    }
    return this.http.get(url, {headers})
  }
}
