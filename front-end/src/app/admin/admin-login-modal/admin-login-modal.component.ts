import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgModel, FormGroup } from '@angular/forms';
import { ERROR_MESSAGE, LOADER } from 'src/app/constants/constants';
import { FormControl } from '@angular/forms';
import { AdminService } from 'src/app/services/admin-service.service';
import { StorageService } from 'src/app/services/storage.service';
import { STORAGE_CONSTANTS } from 'src/app/constants/STORAGE-CONSTANT';

@Component({
	selector: 'admin-login-modal',
	templateUrl: 'admin-login-modal.component.html',
	styleUrls: ['admin-login-modal.component.css']
})
export class AdminLoginModalComponent implements OnInit, AfterViewInit {
	@ViewChild('adminUserName') adminUserName: NgModel;
	@ViewChild('adminPsd') adminPsd: NgModel;
	errorMsg = "";
	data: any;
	loader = LOADER;
	submitting = false;
	constructor(
		private adminService: AdminService,
		private storageService: StorageService,
		private _mdr: MatDialogRef<AdminLoginModalComponent>,
		@Inject(MAT_DIALOG_DATA) data: any) {
		if (data) {
			this.data = data;
			console.log('_mdr', _mdr);
		}
	}
	ngOnInit() {
	}
	ngAfterViewInit() {

	}
	submit() {
		//console.log('adminUserName', this.adminUserName);
		//console.log('adminPsd', this.adminPsd);
		this.adminPsd.control.markAllAsTouched();
		this.adminUserName.control.markAllAsTouched();
		if (this.adminUserName.invalid || this.adminPsd.invalid) {
			return;
		}
		this.submitting = true;
		var adminDetails: FormGroup = new FormGroup({
			adminEmail: new FormControl(this.adminUserName?.value),
			password: new FormControl(this.adminPsd?.value),
		});
		console.log('adminDetails', adminDetails);
		this.errorMsg = "";
		this.adminService.authenticateLogin(adminDetails.value).subscribe(
			(response: any) => {
				this.errorMsg = "";
				console.log('response admin lOGIN', response);
				this.submitting = false;
				if (response && response.user) { 
					this.data = response.user;
				}
				this._mdr.close(this.data);
			}
			,
			(error) => {
				this.errorMsg = ERROR_MESSAGE;
				if (error?.error?.error) {
					this.errorMsg = error?.error?.error;
				}
				this.submitting = false;
				console.log('error admin lOGIN', error);
			}
		);
	}
	showUserNameErrors(): any {
		if (this.adminUserName?.errors['required'])
			return "Input Required";
		if (this.adminUserName?.errors['pattern'])
			return "Email pattern invalid";
		if (this.adminUserName?.errors['maxlength'])
			return "Length exceeded";
	}
	showPasswordErrors(): any {
		if (this.adminPsd?.errors['required'])
			return "Input Required";
		if (this.adminPsd?.errors['maxlength'])
			return "Length exceeded";
	}
	closeDialogCancel() {
		this._mdr.close(false);
	}
}
