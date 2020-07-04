import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../model/user.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

const BASE_URL = 'http://localhost:4222/api/users/';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
    returnUrl: string;
    isLoggedIn(): boolean {
        return;
    }
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;
  constructor(
      private http: HttpClient,
      private route: ActivatedRoute,
  ) {
      this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('token'));
      this.currentUser = this.currentUserSubject.asObservable();
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  public get currentUserValue() : any {
      return localStorage.getItem('token');
  }

  register(user: User): Observable<any> {
    return this.http.post(BASE_URL + 'userRegister', user)
  }

  profile(fileToUpload: File): Observable<Object> {
      const endPoint = BASE_URL + 'upload';
      const formData : FormData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      return this.http.post(endPoint, formData)
  }

  login(payload): Observable<any> {
    return this.http.post(BASE_URL + 'userLogin', payload)
        .pipe(
            map(res => {
              if (res['success'] === true) {
                localStorage.setItem('token', res['token']);
                localStorage.setItem('fullName', res['data'].username);
              }
              return res;
            }
            )
        )
  }

  getAllUser(): Observable<any> {
      return this.http.get(BASE_URL + 'getAllUser')
  }
}
