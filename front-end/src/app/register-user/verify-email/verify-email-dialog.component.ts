import { Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { ErrorsService } from 'src/app/services/errors.service';
//import { BusinessService } from '../services/business.service';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/shared/http.service';
import { endpoints } from 'src/app/constants/end-points';
import { ERROR_MESSAGE_TRY_LATER, USER_STATUS } from 'src/app/constants/constants';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'verify-emai-dialog',
  templateUrl: './verify-emai-dialog.component.html',
  styleUrls: ['./verify-email-dialog.component.scss']
})
export class VerifyEmailDialogComponent implements OnInit {

  @ViewChild('countdown') counter: CountdownComponent;
  errorMsg="";
  form: FormGroup;
  data:any;
  emailSent=false;
  emailEdited=false;
  isEmailSUbmitting=false;
  TimeLeft=0;
  configuration: CountdownConfig = {
    leftTime: 30,//in seconds
    format: 'mm:ss',
    prettyText: (text) => {
      return text
        .split(':')
        .map((v) => `<span class="item">${v}</span>`)
        .join('');
    },
  };
  config2: CountdownConfig = {
    leftTime:30,
    formatDate: ({ date }) => `${date / 1000}`,
  };
  constructor(
    //private businessService: BusinessService,
    private datePipe:DatePipe,
    private httpService:HttpService,
    private errorsService: ErrorsService,
    private userService: UserService,
    private dialogRef: MatDialogRef<VerifyEmailDialogComponent>,
    private router:Router,
    @Inject(MAT_DIALOG_DATA) { data }: any) {
      dialogRef.disableClose=true;
      this.data=data;
      //Validators.pattern("^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$")]),
    console.log('data:', data);
    this.form = new FormGroup({
      id: new FormControl(data?.userId),
      email: new FormControl('', [Validators.required,Validators.email]),
      emailCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    });
    console.log('form', this.form);
    if (data && data.email) {
      this.form.controls['email'].setValue(data.email);
    }
    if(data['email']){
      this.emailSent=true;
    }
   
  }

  ngOnInit() {
    console.info('counter:', this.counter);
  }
  handleEvent(event){
    console.info('Event counter:', event);
    this.TimeLeft=event?.left/1000;
  }
  verifyEmail():any {
    if(this.isEmailSUbmitting){
      return false;
    }
    //stop here if form is invalid
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return false;
    }
    var emailVerifiedDate=this.datePipe.transform(new Date(),'yyyy-MM-dd HH:mm');
    let payload = {
      id: this.f['id'].value,
      userEmail: this.f['email'].value,
      tokenCode: this.form.controls['emailCode'].value,
      emailVerifiedAt: emailVerifiedDate,
      status: USER_STATUS.USER_CREATED_AND_VERIFIED_STATUS,
    }
    console.log('verifyEmail**-- form in VE writing:', this.form);
    this.isEmailSUbmitting=true;
    this.userService.verifyUser(payload).subscribe((response)=>{
      console.log('verify email:  http success response',response);
      var heading="Email Sucesfully verified"
      this.errorsService.emitSuccessMessage(heading);
      this.isEmailSUbmitting=false;
      this.errorMsg="";
    },
    
    (error)=>{
      console.log('verifyEmail http error',error);
      var ersMsg="There is a technical with our server. Please try later";
      this.errorMsg="The code you have entered is incorrect";
      this.isEmailSUbmitting=false;
    });
  }
  goToHome(){
    var link=['/home'];
    this.close();
    this.router.navigate(link);
  }
  preventInput(e:any):any{
    return;
    // e.stopPropagation();
    // e.preventDefault();
    // return false;
  }
  resendCode():any {
    if (this.f['email'].status == 'INVALID') {
      alert('enter your email please');
      return;
    }
    this.emailSent=true;
    this.counter.restart();
    console.info('counter resend:', this.counter);
    var code=Math.floor(10000 + Math.random() * 97837896);
    let payload = {
      'source': 'FCWR-APP ',
      'name': this.data?.userName,
      'email': this.f['email'].value,
      'code': code,
      'message': "please enter this email code to verify ",
      'applicationId':'5'
      }
      this.updateUser(code);
      console.log('verifyemail.request payload:', payload);
      return this.httpService
      .postNoTokenNotification(endpoints.notification.send_code, payload).subscribe((response)=>{
        console.log('verify email, resendCode http success response',response);
        var heading="An email with verification has ben sent to "+this.f['email'].value;
        this.errorsService.emitSuccessMessage(heading);
        this.isEmailSUbmitting=false;
      },
      (error)=>{
        console.log('resendCode http error',error);
        var ersMsg="There is a technical with our server. Please try later"
        this.errorsService.emitErrorMessage(ersMsg);
        this.isEmailSUbmitting=false;
      });
  }
  updateUser(_tokenCode){
    let payLoad={
      id: this.f['id'].value,
      tokenCode:_tokenCode,
      userEmail: this.f['email'].value
    };
    console.log('verify email -> update user, payLoad',payLoad);
    this.userService.save(payLoad).subscribe(
      (response:any)=>{
        console.log('verify email -> update user, response',response);
      },
      (error:any)=>{
        console.log('resendCode http error',error);
        console.log('verify email -> update user, error',error);
        alert(ERROR_MESSAGE_TRY_LATER);
      }
    );
}
  close() {
    this.dialogRef.close();
    return true;
  }

  get f() {
    return this.form.controls;
  }
  getEmailErrorMessage() {
    if (this.f['email'].hasError('required')) {
      return 'This field must be filled out';
    }
    if (this.f['email'].hasError('email')) {
      return 'Not a valid email address';
    }
    return 'Input field has some error';
  }
  getEmailCodeErrorMessage() {
    if (this.f['emailCode'].hasError('required')) {
      return 'This field must be filled out';
    }
    if (this.f['emailCode'].hasError('pattern')) {
      return 'Wrong input. Only digits are allowed';
    }
    return 'Field has some error';
  }
  editEmail() {
    return false;
  }
}






