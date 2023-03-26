import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";
import { HttpService } from '../shared/http.service';
import { endpoints } from '../constants/end-points';
import { BUSINESS_MENU_ITEMS } from '../constants/BUSINESS_MENU_ITEMS';
import { StorageService } from 'src/app/services/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { STORAGE_CONSTANTS } from './../constants/STORAGE-CONSTANT';
@Injectable({ providedIn: 'root' })

@Injectable({
    providedIn: "root"
})
export class AuthService {

	error: any;
	tokenRefreshed = true;
	public menus: any[] = [];
	constructor(private httpService: HttpService,
		private storageService: StorageService,
		// private globalEventsManager: GlobalEventsManager,
		private router: Router,
		private jwtHelperService: JwtHelperService
	) {
	}

	getToken() {
		return this.storageService.get('id_token');
	}

	isTokenExpired() {
		const account = this._getAccount();
		console.log('account:', account)
		if (account == null) {
			return true;
		}
		return this.jwtHelperService.isTokenExpired(this.getToken());
	}

	public isAuthenticated(url: string): boolean {
		if (!this.isUserValid()) {
			return false;
		}
		let isUrlAllowed = this.isUrlAllowed(url);
		console.log('>>>isUrlAllowed.user:', isUrlAllowed);
		return isUrlAllowed;
	}
	public logout(): boolean {
		console.log('logout called: menus are',this.menus);
		this.goToLoginPage();
		this._removeAccount();
		this.menus = [];
		return true;
	}
	public putLogIn(response: any) {
		console.log('response:', response);
		var body: any = response;
		if (response.body) {
			body = response.body;
		}
		const token = body.token;
		localStorage.setItem(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY, JSON.stringify({ account: body.user, sessionExpired: false }));
		localStorage.setItem(STORAGE_CONSTANTS.LOCAL_STORAGE_TOKEN_KEY, body.token);
	}
	public _removeAccount() {
		if (localStorage.getItem(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY)) {
			localStorage.setItem(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY, JSON.stringify({ account: null, sessionExpired: true }));
			return true;
		}
		localStorage.removeItem(STORAGE_CONSTANTS.LOCAL_STORAGE_MENUS_KEY);
		return false;
	}
	_getAccount(): any {
		const json = JSON.parse(localStorage.getItem(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY));
		var storedAccount = json && json.account;
		console.log('_getAccount----:', storedAccount);
		return storedAccount;
	}


	checkTokenValidity(header: any) {
		if (!this.isTokenExpired()) {
			return true;
		} else {
		}
		return false;
	}

	goToLoginPage() {
		console.log('goToLoginPage');
		this.clearLocalStorage();
		this.router.navigate(['/login']);
	}

	clearLocalStorage() {
		this.storageService.remove('user');
		this.storageService.remove('id_token');
		this.storageService.remove('err_token');
	}

	private handleError(error: any) {
		return Promise.reject(error);
	}

	getHomePageUrl(business) {
		var user = this.storageService.get('user');
		var homePageUrl = '/home';
		if (!user) {
			return homePageUrl
		}

		if (user.homePageUrl != null) {
			homePageUrl = user.homePageUrl;
			return homePageUrl
		}
		if (user.showStatic) {
			return homePageUrl
		}
		if (user.menus && user.menus.length > 0) {
			homePageUrl = user.menus[0].link;
			return homePageUrl
		}
		return homePageUrl
	}

	isUrlAllowed(link: string): boolean {
		 var menus = [];
		 if(!menus || menus.length<=0){
			menus =this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_MENUS_KEY);
		 }
		 console.log('this.menus=',this.menus, ', menus=', menus);
		 if(this.menus.length!==menus.length && this.menus.length!=0){
			this.logout();
		 }
		
		console.log('menus',menus);
		if (!link) {
			return false;
		}
		if (!menus || menus.length <= 0) {
			return false;
		}

		// let isContain = menus.find(menu => menu['link'] === link);
		
		let isContain = menus.find(menu =>{ 
			console.log('input.link='+link+', menu.link='+ menu['link'])
			return link===menu['link'];
		});
	
		console.log('input.link='+link+', menu.isContain='+ isContain)
		return isContain != null;
	}

	public isUserValid(): boolean {
		const isTokenExpired = this.isTokenExpired();
		if (isTokenExpired) {
			return false;
		}
		var account = this._getAccount();
		console.log('>>>isAuthenticated.user:', account);
		if (!account) {
			return false;
		}
		return true;
	}

	loadMenus() {
		this.menus = [];
		var menuKey=STORAGE_CONSTANTS.LOCAL_STORAGE_MENUS_KEY
			this.menus = BUSINESS_MENU_ITEMS;
			this.storageService.put(menuKey,this.menus);
			console.log('loadMenus.menus:', this.menus);
			return this.menus;

	}

	clearDataGotoLogin() {
		this.clearLocalStorage();
		console.log('>>>clearDataGotoLogin:' + this.storageService.get('id_token'))
		this.router.navigate(['/login']);
	}

}


