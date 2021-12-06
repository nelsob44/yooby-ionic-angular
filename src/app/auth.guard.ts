import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { mapTo, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.userAuthenticated.pipe(
      take(1),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          return this.router.navigateByUrl('/auth');
        } else {
          return of(isAuthenticated);
        }
      })
    );
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.userAuthenticated.pipe(
      take(1),
      tap((isAuthenticated) => {
        console.log('route guard 1', isAuthenticated);
        if (!isAuthenticated) {
          console.log('route guard 2', isAuthenticated);
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          return this.router.navigateByUrl('/auth');
        } else {
          return of(isAuthenticated);
        }
      })
    );
  }
}
