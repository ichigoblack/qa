import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { VerificacionService } from 'app/auth/service';
import { Proceso } from '../models/proceso';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _userService: VerificacionService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this._userService.userValue;
    if (user) {
      if (route.data["proceso"]) {
        const resultado = user.procesos.find((obj: Proceso) => obj.codproceso === route.data['proceso'])
        if (resultado == undefined) {
          this._router.navigate(['/dashboard/ecommerce']);
        }
        return true;
      }
      return true;
    }
    this._router.navigate(['/pages/miscellaneous/not-authorized']);
    return false;
  }
}