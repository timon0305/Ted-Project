import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import {AppState} from '../../reducers';
import {tap} from 'rxjs/operators';
import {isLoggedIn} from '../selectors/auth.selectors';
import {AuthService} from '../service/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
      // private store: Store<AppState>,
      private _router: Router,
      private authService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const currentUser = this.authService.currentUserValue;
      if (currentUser) return true;
      this._router.navigate(['pages/login'], {queryParams: {returnUrl: state.url}});
      return false;
      //const loggedIn: boolean = this.authService.isLoggedIn();

      //if (!loggedIn) {
      //    this._router.navigate(['pages/login'])
      //}
      //return loggedIn
  }
  
}
