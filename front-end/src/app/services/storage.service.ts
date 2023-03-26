import { Injectable } from '@angular/core';

declare var _: any;

@Injectable({ providedIn: 'root' })
export class StorageService {

	isSessionExpired: boolean = false;

	constructor() { }

	put(key: string, value: any) {
		console.log('key=',key);
		console.log('data=',value);
		if (localStorage == null) {
			return;
		}
		localStorage.removeItem(key);

		if (value instanceof Object) {
			console.log('object=' , value);
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			console.log('Not object=' , value);
			localStorage.setItem(key, value);
		}
	}

	get(key: string) {
		try {
			return JSON.parse(localStorage.getItem(key!)!);
		} catch (e) {
			return localStorage.getItem(key);
		}

	}

	remove(key: string) {
		localStorage.removeItem(key);
	}
}
