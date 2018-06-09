import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './../services/user.service';
import { Global } from '../services/global';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private router: Router,
    private userService: UserService,
    private global: Global) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRole = route.data.expectedRole;
    if (this.global.user) {
      return this.global.user.role_id === expectedRole;
    } else {
      return new Promise((resolve) => {
        this.userService.auth()
          .then((res) => {
            if (res.status && res.data.id && res.data.role_id === expectedRole) {
              return resolve(true);
            }
            this.router.navigate(['login']);
            return resolve(false);
          })
          .catch(err => {
            this.router.navigate(['login']);
            return resolve(false);
          });
      });
    }
  }
}