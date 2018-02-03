import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service';

@Injectable()
export class RoleGuardService implements CanActivate{

  constructor(
    public auth: AuthService,
    public router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    //const roles = (route.data as any).expectedRoles;

    if(!this.auth.isAuthenticated() || !this.auth.userHasRole()){
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }

}
