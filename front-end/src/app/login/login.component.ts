import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { Meta, Title } from "@angular/platform-browser";
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { STORAGE_CONSTANTS } from './../constants/STORAGE-CONSTANT';
import { ErrorsService } from '../services/errors.service';
import { StorageService } from '../services/storage.service';
import { CONTENTS } from '../constants/constants';



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)]),
    password: new FormControl('', Validators.required),
  });
  isSubmitted = false;
  showAlert = false;
  alertType = "";
  alertMessage = "";
  alertTypeIcon = "";
  isUserLoggedIn=false;
  constructor(
    private router: Router,
    private title: Title,
    private metaTagService: Meta,
    private userService: UserService,
    private errorService: ErrorsService,
    private storageService: StorageService,
  ) {
  }
  ngOnInit() {
    this.isUserLoggedIn=false;
    this.title.setTitle('Login');
    this.metadataTags();
    this.getCurrentSignedIntUser();
  }
  metadataTags() {
    this.metaTagService.addTags([
      { name: 'keywords', content: 'Surplus food bidding' },
      { name: 'robots', content: 'index, follow' },
      { name: 'writer', content: 'Zia Khan' },
      {
        name: 'description', content:CONTENTS
      },
      { charset: 'UTF-8' }
    ]);
  }
  get f() {
    return this.form.controls;
  }
  setAlert(type, message, icon?) {
    this.alertType = type;
    this.alertTypeIcon = icon;
    this.alertMessage = message;
    return;
  }
  getCurrentSignedIntUser(){
    var storedValue=this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
   
    if(storedValue && storedValue?.id){
      this.router.navigate(['/home']);
      console.log('storedValue',storedValue);
      this.isUserLoggedIn=true;
       this.setAlert('alert_info','Info!. You are already logged In')
      this.showAlert = true;
    }
    else{
        this.isUserLoggedIn=false;
    }
  }
  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      var message = "Info! Fields marked with * are required";
      this.setAlert('alert_info', message, 'fa-check-circle');
      this.showAlert = true;
      return;
    }
    console.log('form value', this.form);
    this.isSubmitted=true;
    //call api to gey user
    this.userService.authenticateLogin(this.form.value).subscribe((response: any) => {
      
      console.log('response in login', response);
      this.storageService.put(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY,response.user);
      this.storageService.put(STORAGE_CONSTANTS.LOCAL_STORAGE_TOKEN_KEY,  response.token);
      
      //now lets display the object stored
      let storedValue=this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
      console.log('storedValue',storedValue);

      this.isSubmitted = false;
      var link = ['/home'];
      this.router.navigate(link);
      this.errorService.showSwalToastMessage('success','Login Succesfull','top')
    }, error => {
      console.log('error in login ', error);
      var errorStr = 'Unknown Error';
      if (error?.error?.error) {
        errorStr = error?.error?.error;
      }
      console.log('errorStr', errorStr);
      this.showAlert = true;
      this.isSubmitted = false;
      this.setAlert('alert_danger', errorStr, 'fa-bell');
    });
    // if(true){
    //   setTimeout(()=>{
    //     this.isSubmitted=false;
    //     var link=['/home'];
    //     this.router.navigate(link);
    //   },3000);
    // }
    // else{
    //   Swal.fire('', 'Not registered or Invalid credentials!'
    //     );
    //     Swal.update({
    //       confirmButtonText: 'Got it',
    //       confirmButtonColor: '#4caf50',
    //     });
    //     this.isSubmitted=false;
    // }

  }
  newLogin(){
    this.isUserLoggedIn=false;
    this.showAlert=false;
    this.storageService.remove(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
    this.storageService.remove(STORAGE_CONSTANTS.LOCAL_STORAGE_TOKEN_KEY);
  }
  emailErrors(): any {
    if (this.f['userEmail']?.errors['required']) {
      return 'This field must be filled out';
    }
    if (this.f['userEmail']?.errors['email']) {
      return 'Invalid format';
    }
    if (this.f['userEmail']?.errors['maxlength']) {
      return 'Length exceeded';
    }
  }

}