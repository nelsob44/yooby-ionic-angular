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
export class AdminGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.userIsAdmin.pipe(
      take(1),
      switchMap((isAdminUser) => {
        if (!isAdminUser) {
          this.authService.autoLogin();
          return of(isAdminUser);
        } else {
          return of(isAdminUser);
        }
      }),
      tap((isAdminUser) => {
        if (!isAdminUser) {
          return this.router.navigateByUrl('/available-products');
        } else {
          return of(isAdminUser);
        }
      })
    );
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.userIsAdmin.pipe(
      take(1),
      switchMap((isAdminUser) => {
        if (!isAdminUser) {
          return this.authService.autoLogin();
        } else {
          return of(isAdminUser);
        }
      }),
      tap((isAdminUser) => {
        if (!isAdminUser) {
          return this.router.navigateByUrl('/available-products');
        } else {
          return of(isAdminUser);
        }
      })
    );
  }
}
