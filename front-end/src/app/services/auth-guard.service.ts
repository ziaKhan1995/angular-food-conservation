import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuardService implements CanActivate {
	constructor(public auth: AuthService, public router: Router) { }
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		console.log('>>>>>>>>canActivate.state.url:' + state.url);
		var isAuthenticated = this.auth.isAuthenticated(state.url);
		console.log('>>>>>>>>canActivate.isAuthenticated:' + isAuthenticated);

		if (!isAuthenticated) {
			this.auth.clearDataGotoLogin();
			return false;
		}
		return true;
	}
}
