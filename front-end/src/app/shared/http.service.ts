import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';

import { endpoints } from '../constants/end-points';
import { HTTP_FORBIDDEN_STATUS } from '../constants/http.status.codes';
import { environment } from 'src/environments/environment';
//import { JwtHelperService } from "@auth0/angular-jwt";
import { StorageService } from '../services/storage.service';
// import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpService {
	private host: string;
	private hostImage: string;
	private hostNotification: string;
	constructor(private http: HttpClient, private storageService: StorageService,
		//private authService: AuthService,
		private router: Router,
		//private jwtHelperService: JwtHelperService
	) {
		this.host = environment.apiBaseUrl;
		this.hostImage = environment.baseAPIUrlImage;
		this.hostNotification = environment.baseAPIUrlNotification;
	}


	getToken() {
		return this.storageService.get('id_token');
	}

	isTokenExpired() {
		//return this.jwtHelperService.isTokenExpired(this.getToken());
	}

	buildHeaders(): any {
		const headers = new HttpHeaders();
		headers.set('Content-Type', 'application/json');
		headers.set('X-Origin', 'admin-portal');
		var token = this.getToken();
		if (token) {
			headers.set('Authorization', 'Bearer ' + token);
		}
		console.log('token******:', token);
		return headers;

	}


	get(url: string) {
		return this.checkTokenAndCallEndPoint('GET', this.host + url, '');
	}
	post(url: string, data: any) {
		return this.checkTokenAndCallEndPoint('POST', this.host + url, data);
	}

	signOutAndGoToLoginPage() {
		// this.globalEventsManager.showNavBar.emit(false);
		//this.authService.clearLocalStorage();
		this.storageService.isSessionExpired = true;
		this.router.navigate(['/login']);

	}

	postNoToken(url: string, data: any) {
		console.log('url:::', url,data);
		this.buildHeaders();
		return this.http.post(this.host + url, data);
	}

	postNoTokenNotification(url: string, data: any) {
		this.buildHeaders();
		return this.http.post(this.hostNotification + url, data);
	}

	// getNoToken(url: string, data: string) {
	// 	console.log('url:', url);
	// 	return this.http.get(this.host + url);
	// }
	getNoTokenNew(url: string) {
		console.log('url-----++:', this.host +url);
		return this.http.get(this.host + url);
	}

	// getNoToken(url: string, data: string) {
	// 	return this.callEndPoint('GET', this.host + url, data);
	// }

	put(url: string, data: any) {
		return this.checkTokenAndCallEndPoint('PUT', this.host + url, data);
	}

	patch(url: string, data: any) {
		return this.checkTokenAndCallEndPoint('PATCH', this.host + url, data);
	}

	delete(url: string) {
		return this.checkTokenAndCallEndPoint('DELETE', this.host + url, '');
	}

	checkTokenValidity() {
		this.buildHeaders();
		//this.authService.checkTokenValidity(this.buildHeaders());
	}

	private checkTokenAndCallEndPoint(verb: any, url: any, body: any) {
		return this.callEndPoint(verb, url, body);
		// if (!this.isTokenExpired()) {
		// 	return this.callEndPoint(verb, url, body);
		// } else {
		// 	//this.authService.clearLocalStorage();
		// 	// this.buildHeaders();

		// 	// return this.http.get<any>(this.host + endpoints.refresh, { headers: this.buildHeaders() }).subscribe({
		// 	// 	next: data => {
		// 	// 		this.storageService.put('id_token', data.access_token);
		// 	// 		this.storageService.isSessionExpired = false;
		// 	// 	},
		// 	// 	error: error => {
		// 	// 		console.error('There was an error!', error);
		// 	// 		if (error != undefined && error.status == HTTP_FORBIDDEN_STATUS) {
		// 	// 			this.signOutAndGoToLoginPage();
		// 	// 		}
		// 	// 	}
		// 	// });

		// 	return null;
		// }
	}

	getThirdPartyUrl(url: any) {
		return this.http.get(url);
		// return this.callEndPoint('GET', url, null);
	}

	postWithToken(url: any, data: any) {
		return this.checkTokenAndCallEndPoint('POST', this.host + url, data);
	}

	getWithTokenData(url: any, data: any) {
		return this.checkTokenAndCallEndPoint('GET', this.host + url, data);
	}
	getWithToken(url: string) {
		console.log('url:', url);
		return this.checkTokenAndCallEndPoint('GET', this.host + url, null);
	}

	callEndPoint(verb: any, url: any, data: any) {
		console.log('url--' +verb+ url+data);
		this.buildHeaders();
		switch (verb) {
			case 'DELETE':
				return this.http.delete(url, { headers: new HttpHeaders().set('Authorization', this.getToken()) });
			case 'POST':
				if (this.getToken()) { }
				return this.http.post(url, data, { headers: new HttpHeaders().set('Authorization', this.getToken()) });
			case 'PUT':
				return this.http.put(url, data, { headers: new HttpHeaders().set('Authorization', this.getToken()) });
			case 'PATCH':
				return this.http.patch(url, data, { headers: new HttpHeaders().set('Authorization', this.getToken()) });
			//get as default verb
			default:
				return this.http.get(url, { headers: new HttpHeaders().set('Authorization', this.getToken()) });
		}
	}
	postWithTokenFormMulitpart(url: string, data: FormData) {
		//const token = localStorage.getItem('jwtToken');
		const httpOptionsForm = {
			headers: new HttpHeaders({
			})
		};
		httpOptionsForm.headers.set('enctype', 'multipart/form-data');
		httpOptionsForm.headers.set('Accept', 'charset=utf-8');
		httpOptionsForm.headers.set('Accept-Charset', 'charset=utf-8');
		console.log('POST:' + this.hostImage + url, data);
		return this.http.post(this.hostImage + url, data, httpOptionsForm);
	}
	extractData(res: Response) {
		let body = res.json();
		return body;
	}
}
