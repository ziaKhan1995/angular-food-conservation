import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../shared/confirmed.validator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ErrorsService } from '../services/errors.service';
import { VerifyEmailDialogComponent } from './verify-email/verify-email-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ERROR_MESSAGE_TRY_LATER, LOADER, SMALL_SCREEN_SIZE, USER_STATUS } from '../constants/constants';
// import { ErrorsService } from '../shared/errors.service';
// import { StorageService } from '../shared/storage.service';
// import { Business } from '../modals/business.model';
import { Title, Meta } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { BusinessService } from '../services/business.service';
import * as sampleData from 'src/assets/javascript/countries.json';
import { StorageService } from '../services/storage.service';
import { STORAGE_CONSTANTS } from '../constants/STORAGE-CONSTANT';
import { randomInt } from 'crypto';
import { HttpService } from 'src/app/shared/http.service';
import { endpoints } from 'src/app/constants/end-points';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterUserComponent implements OnInit {
  @ViewChild('myAlert',{static: false})
  myAlert: ElementRef;
  tooltipText="Save username and password for \nnext time. Auto removed after logout";
  placeholder="8 char's,1 digit,1 capital, 3 small and one special symbol";
  alertType="";
  alertMessage="";
  alertTypeIcon="";
  userForm: FormGroup;
  keepMeLoggedIn:FormControl;
  innerWidth = 0;
  isSubmitted=false;
  isSubmitting=false;
  isEmailSUbmitting=false;
  loader=LOADER;
  currencies: any = [250];
  countriesList: any = [256];
  dial_code="";
  hasNumber:boolean;
  hasUpper:boolean;
  hasLower:boolean;
  minLength:boolean;
  maxLength:boolean;
  format:boolean;
  @HostListener('window:resize', ['$event'])
  event(event) {
    this.innerWidth = window.innerWidth;
  }
  //business:Business=new Business;
  hide = true;
  constructor(
    private fb: FormBuilder,
    private errorService:ErrorsService,
    private router:Router,
    private dialog:MatDialog,
    private titleService:Title,
    private metaService:Meta,
    private userService:UserService,
    private storageService:StorageService,
    private businessService:BusinessService,
    private httpService:HttpService,
    private datePipe:DatePipe,
  ) { }

  ngOnInit(): void {
    //this.openVerifyEmailDialog(3223,10,'ziauddin.foryou@gmail.com')
    this.getAlreadySignedIntUser()
    this.initiateForm();
    this.storageService.remove('TO_LINK');
    this.innerWidth = window.innerWidth;
    this.titleService.setTitle("register user");
    this.metadataTags();
    this.getCurrentVisitorInformation();
    for (var i = 0; i < 250; i++) {
      this.currencies[i] = sampleData[i].currencyCode;
      this.countriesList[i] = sampleData[i].countryName;
    }
    //console.log('currencies',this.currencies);
    //console.log('countriesList',this.countriesList);
  }
  metadataTags(){
    this.metaService.addTags([  
      { name: 'keywords', content: 'Surplus food bidding' },  
      { name: 'robots', content: 'index, follow' },  
      { name: 'writer', content: 'Zia Khan' }, 
      { name: 'description', content: "FC&Wr is the best place to sell and buy"+
       "surplus food on bidding to avoid" }, 
      { charset: 'UTF-8' }  
    ]);  
  }
  showPasswordHints(openSweetAlert) {
    let password=this.ff['password']!.value;
    this.minLength=this.ff['password']!.value?.length>7?true:false;
    this.maxLength=this.ff['password']!.value?.length<17?true:false;
    var numUpper = password.length - password.replace(/[A-Z]/g, '').length;  
    var numLowers = password.length - password.replace(/[a-z]/g, '').length;
    var hasFormat = /[`,_!@#$%^&*()+=]/;
    this.format=hasFormat.test(password);
    console.log('showPasswordHints format',this.format);    
    this.hasUpper = numUpper > 0 ? true : false;
    this.hasLower = numLowers > 2 ? true : false;
    this.hasNumber =password?.match(/\d+/g)?true:false;
    console.log('showPasswordHints hasNumber',this.hasNumber);
    console.log('showPasswordHints numUpper',numUpper);
    console.log('showPasswordHints numLowers',numLowers);
    console.log('showPasswordHints hasUpper',this.hasUpper);
    if(!openSweetAlert){
      return;
    }
    Swal.fire({
      html: this.myAlert.nativeElement,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      confirmButtonText: 'Got it',
      confirmButtonColor: '#3f51b5',
    });
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
      if (this.userForm.dirty) {
          $event.returnValue =true;
      }
  }
  submit(top) {
    console.log('user form',this.userForm);
    this.userForm?.markAsTouched();
    if (this.userForm?.invalid) {
      console.log('user form is invalid?',this.userForm);
      return;
    }
    var localTimestampCreated=this.datePipe.transform(new Date(),'yyyy-MM-dd HH:mm');
    this.ff['localTimestampCreated'].setValue(localTimestampCreated);
    this.ff['tokenCode'].setValue(Math.floor(10000 + Math.random() * 97837896));
    //call user saving service
    if(this.keepMeLoggedIn.value){
      this.storageService.put('user',this.userForm.value);
    }
    this.isSubmitting=true;
    console.log('form Valid',this.userForm);
    this.userService.save(this.userForm.value).subscribe((response:any)=>{
      this.isSubmitting=false;
      this.isSubmitted=true;
      if(top){
        top.scrollIntoView({
          behavior: 'smooth'
        });
      }
      var message=" Success! you have registered successfully";
      this.setAlert("alert_success",message,"fas fa-check-circle");
      console.log('response in user  registration',response);
      if(this.keepMeLoggedIn.value){
          this.storeLocalUser(response);
      }
        //  call email verifying saving service
        // var verificationCode=response?.users?.verificationCode;//this is response id not static
        // var email=response?.users?.userEmail;//email entered by user
        // var userId=response?.users?.id;//euser ID
      if (response && response.users)
        this.emailCodeToUser(response.users);
      else
        alert(ERROR_MESSAGE_TRY_LATER);
    },
    (error:any)=>{
      console.log('error in user  registration',error);
      var errorStr=ERROR_MESSAGE_TRY_LATER;
      if(error?.error?.error){
        errorStr=error?.error?.error;
      }
      console.log('errorStr',errorStr);
      this.isSubmitting=false;
      this.isSubmitted=true;
      if(top){
      top.scrollIntoView({
        behavior: 'smooth'
      });
    }
      this.setAlert('alert_danger',errorStr,'fa-times-circle');
    }

    );
    return;
  }
  emailCodeToUser(user){
    var userName=user?.userFname+" "+user?.userLname;
    let payload = {
      'source': 'FCWR-APP ',
      'name': userName,
      'email': user?.userEmail,
      'code': user?.tokenCode,
      'message': "please enter this email code to verify ",
      'applicationId':'5'
      }
      console.log('verifyemail.request payload:', payload);
      return this.httpService
      .postNoTokenNotification(endpoints.notification.send_code, payload).subscribe((response)=>{
        console.log('register user http success response',response);
        this.isEmailSUbmitting=false;
        this.openVerifyEmailDialog(user?.id,userName,user?.tokenCode,user?.userEmail);
      },
      (error)=>{
        console.log('register user http error',error);
        var ersMsg="There is a technical with our server. Please try later";
        alert(ersMsg);
        this.isEmailSUbmitting=false;
      });
  }
  openVerifyEmailDialog(userId,userName,tokenCode, email) {
    console.log('openVerifyEmailDialog verificationCode',tokenCode);
    console.log('openVerifyEmailDialog email',email);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    let widthDialog='99%';
    if(this.innerWidth>=SMALL_SCREEN_SIZE){
      widthDialog='800px';
    }
    dialogConfig.width=widthDialog;
    dialogConfig.disableClose=true;
    dialogConfig.enterAnimationDuration='1000ms',
    dialogConfig.exitAnimationDuration="700ms"
    dialogConfig.data = {
      data: {
        userName,
        email,
        userId
      }
    } 
    ;

    const dialogRef = this.dialog.open(
      VerifyEmailDialogComponent,
      dialogConfig,
      
    );

    dialogRef.afterClosed()
      .subscribe((val) => {
        console.log('Dialog output:', val);
        if(val==true){
          let link = ['/login'];
        this.router.navigate(link).then(() => {
        });
        }
      });
  }
  setAlert(type,message,icon){
    this.alertType=type;
    this.alertTypeIcon=icon;
    this.alertMessage=message;
    return;
  }
  clear(){
    this.isSubmitted=!this.isSubmitted;
    this.setAlert('','','');
  }
  getAlreadySignedIntUser(){
    var storedValue=this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
    if(storedValue && storedValue?.id){
      this.router.navigate(['/home']);
      console.log('storedValue',storedValue);
       this.errorService.emitWariningMessage('Info!. You are already logged In'),setTimeout(() => {
        Swal.close();
       }, 3000);
    }
    
  }
  storeLocalUser(response){
    this.storageService.put(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY,response.users);
  
    //now lets display the object stored
    let storedValue=this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
    console.log('storedValue',storedValue);
  }
  
  reset() {
    this.isSubmitted=false;
    if (this.userForm.pristine) {
      this.userForm.markAsUntouched();
      this.userForm?.markAsPristine();
      this.userForm?.reset();
      return;
    }
    Swal.fire('Clear all inputs', 'Are you sure to reset form ?'
    ).then((clearForm)=>{
        if(clearForm.value){
          this.userForm?.markAsUntouched();
          this.userForm?.markAsPristine();
          this.userForm?.reset();
          return;
        }
        else{
          //user canceled inputs
          return;
        }
    });
    Swal.update({
      icon: 'question',
      confirmButtonText: 'Yes, clear all',
      showCancelButton:true,
      cancelButtonText:"No, Cancel",
      confirmButtonColor: '#4caf50',
    });
  }

  get ff(){
    return this.userForm?.controls;
  }
  initiateForm() {
    this.keepMeLoggedIn=new FormControl(false);
    var pattern='^(?=(.*[a-z]){3,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[`,_!@#$%^&*()+=]){1,}).{8,16}$';
    this.userForm = this.fb.group({
      userFname: new FormControl('Zia', [Validators.required,  Validators.maxLength(30)]),
      userLname : new FormControl('Khan', [Validators.required, Validators.maxLength(30)]),
      userStreetno  : new FormControl('4324', [Validators.required,Validators.maxLength(30)]),
      userStreetname  : new FormControl('Mansha Yad Road', [Validators.required,Validators.maxLength(30)]),
      address: new FormControl('G-7/3-4', [Validators.maxLength(100)]),
      userEmail : new FormControl('ziauddin.foryou@gmail.com', [Validators.required,
        //^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$
      Validators.email, Validators.maxLength(60)]),
      userPhoneno : new FormControl('03198381', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      password: new FormControl('', [Validators.required, Validators.minLength(8),
      Validators.maxLength(16),Validators.pattern(pattern)]),
      confirmPassword: new FormControl('', [Validators.required]),
      tokenCode: new FormControl(''),
      emailVerifiedAt: new FormControl(''),
      userCountry  : new FormControl('Pakistan', [Validators.required, Validators.maxLength(60)]),
      userCurrency  : new FormControl('PKR', [Validators.required, Validators.maxLength(60)]),
      userCity : new FormControl('1', [Validators.required, Validators.maxLength(60)]),
      userState : new FormControl(54, [Validators.required, Validators.maxLength(60)]),
      zipCode : new FormControl('4410', [Validators.required, Validators.maxLength(60)]),
      localTimestampCreated: new FormControl(''),
      status: new FormControl(USER_STATUS.USER_CREATED_BUT_NOT_VERIFIED_STATUS),
    },
      {
        validators: ConfirmedValidator('password', 'confirmPassword'),
      });

  }
  getCurrentVisitorInformation():any {
    this.businessService.getVistorLocation().subscribe(
      (response: any) => {
        console.log('current user info',response);
        if (response == null) {
          return -1;
        }
        if (response.country == null) {
          return -1;
        }
        for (var i = 0; i < 250; i++) {
          if (this.countriesList[i]?.countryCode == null) {
            continue;
          }
          if (
            this.countriesList[i]?.countryCode?.toUpperCase() ===
            response.country.toUpperCase()) {
            this.ff['userCountry']?.setValue(
              this.countriesList[i]?.countryName
            );
            this.ff['userCurrency']?.setValue(
              this.countriesList[i]?.currencyCode
            );
            this.dial_code = this.countriesList[i]?.dialCode;
            return 1;
          }
        }
     
        return 2;
      },
      (error) => {
        alert('No internet Connection');
        return -1;
      }
    );
  }
  //Form fields Error messages  functions 
  getFNameErrorMessage() {
    if (this.ff['userFname'].errors['required']) {
      return 'Required field';
    }
    if (this.ff['userFname']?.hasError('maxlength')) {
      return 'Length should not exceed 30';
    }
    return '';
  }
  getLNameErrorMessage() {
    if (this.ff['userLname'].errors['required']) {
      return 'Required field';
    }
    if (this.ff['userLname']?.hasError('maxlength')) {
      return 'Length should not exceed 30';
    }
    return '';
  } 
   getUserStreetNoErrorMessage() {
    if (this.ff['userStreetno'].errors['required']) {
      return 'Required field';
    }
    if (this.ff['userStreetno']?.hasError('maxlength')) {
      return 'Length should not exceed 30';
    }
    return '';
  } 
   getUserStreetNameErrorMessage() {
    if (this.ff['userStreetname'].errors['required']) {
      return 'Required field';
    }
    if (this.ff['userStreetname']?.hasError('maxlength')) {
      return 'Length should not exceed 30';
    }
    return '';
  }
  getAddressErrorMessage() {
    return this.ff['address']?.hasError("maxlength") ? 'Length exceeded...' : '';
  }
  getEmailErrorMessage() {
    if (this.ff['userEmail']?.hasError("required")) {
      return 'Email Required';
    }
    if (this.ff['userEmail']?.hasError("email")) {
      return 'Not a valid email';
    }
    if (this.ff['userEmail']?.hasError("maxlength")) {
      return 'Too lengthy ?';
    }
    return '';
  }
  getPhoneErrorMessage() {
    if (this.ff['userPhoneno']?.hasError('required')) {
      return 'Required field';
    }
    if (this.ff['userPhoneno']?.hasError('pattern')) {
      return 'Wrong input';
    }
    return '';
  }

  getpasswordErrorMessage() {
    if (this.ff['password']?.hasError('required')) {
      return 'Required field';
    }
    if (this.ff['password']?.hasError('minlength')) {
      return 'Minimum length should be 8';
    }
    if (this.ff['password']?.hasError('maxlength')) {
      return 'Length should not exceed 16';
    }
    if (this.ff['password']?.hasError('pattern')) {
      return 'Click button at the end to know the required pattern';
    }
    return '';
  }
  getConfirmPasswordErrorMessage() {
    if (this.ff['confirmPassword']?.hasError('required')) {
      return 'Required field';
    }
    if (this.ff['confirmPassword']?.hasError('confirmedValidator')) {
      return 'Passwords does not match';
    }
    return '';
  }
  getCityErrorMessage() {
    if (this.ff['userCity']?.hasError('required')) {
      return 'Required field';
    }
    return '';
  }

  showPassword() {
    this.hide = !this.hide;
    return false;
  }
}
