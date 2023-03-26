import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, NgModel, Validators} from '@angular/forms';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { ErrorsService } from '../services/errors.service';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';
import { STORAGE_CONSTANTS } from '../constants/STORAGE-CONSTANT';
import { Router } from '@angular/router';
import { CONTENTS, DEFAULT_IMAGE, getBuyerTextByCode, LARGE_LOADER, LOADER, NOT_FOUND_IMAGE } from 'src/app/constants/constants';
import { Meta, Title } from '@angular/platform-browser';
import { getUserCityByCode } from 'src/app/constants/STORAGE-CONSTANT';
import { IMAGE_CONSTANTS } from '../constants/IMAGES_CONSTANTS';
import { MatDialog } from '@angular/material/dialog';
import { WebcameraComponent } from '../shared/webcamera/webcamera.component';
import { endpoints } from '../constants/end-points';
import { HttpService } from '../shared/http.service';
import { environment } from 'src/environments/environment';
import { DEFAULT_USER_IMAGE } from './../constants/constants';
import  Swal  from 'sweetalert2';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'business-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss', '../scss/camera-img.scss']
})
export class SettingComponent implements OnInit {
  innerWidth=0;
  userAccount: any;
  userAccountRestore: any ;
  userForm:FormGroup;
  edit: boolean = false;
  isSubmitting=false;
  isImageSubmiting=false;
  profilePhotoSrcForServer;
  loader=LARGE_LOADER;
  errorImage=NOT_FOUND_IMAGE;
  randomNumber = Math.floor((Math.random() * 100) + 1);
  imagePart1 = environment.baseAPIUrlImage + 'imageByETP/';
  imagePart2 = '/' + IMAGE_CONSTANTS.ENTITY_TYPES.USER + '/' +
    IMAGE_CONSTANTS.MEDIA_PURPOSE_TYPES.PROFILE + '?ad=';
  imageSrc=DEFAULT_USER_IMAGE;
  defaultImage=LARGE_LOADER;
  constructor(
    private errorsService: ErrorsService,
    private userService: UserService,
    private storageService: StorageService,
    private router: Router,
    private title:Title,
    private meta:Meta,
    private fb:FormBuilder,
    private matDialog:MatDialog,
    private httpService:HttpService,
  ) {

  }

  ngOnInit() {
    this.getCurrentUser();
    this.createForm();
    if (window) {
      this.innerWidth = window.innerWidth;
    }
    this.title.setTitle("User Setting");
    this.metadataTags();
    
  }

  equals(){
    return JSON.stringify(this.userAccount) == JSON.stringify(this.userAccountRestore);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  discardChanges() {
    this.edit=false;
    return;
  }
  getCurrentUser() {
   this.userAccount=this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
   if(this.userAccount && this.userAccount?.id){
    this.userAccountRestore = JSON.parse(JSON.stringify(this.userAccount));
    console.log('currentLoggedInUser',this.userAccount);
    this.imageSrc=this.imagePart1+this.userAccount?.id+this.imagePart2+this.randomNumber;
   }
   else{
    this?.errorsService.emitErrorMessage('You are not loged in');
    console.log('Setting.getCurrentUser You are not loged in ')
    this.router.navigate(['/login']);
   }
  }
  getUserCityByCodeGiven(code){
 return getUserCityByCode(code);
  }
  metadataTags(){
        this.meta.addTags([  
          { name: 'keywords', content: 'Contact Us' },  
          { name: 'robots', content: 'index, follow' },  
          { name: 'writer', content: 'Zia Khan' }, 
          { name: 'description', content: CONTENTS }, 
          { charset: 'UTF-8' }  
        ]);  
      }

  clickEdit() {
    this.edit = !this.edit;
    if (!this.edit)
      this.getCurrentUser();
    return;
  }
  _getBuyerTextByCode(status){
    return getBuyerTextByCode(status);
  }
  onSubmitClick() {
   console.log('form',this.userForm); 
   if(this.userForm?.invalid){
    return;
   }       
   this.isSubmitting=true;
   this.userService.save(this.userForm.value).subscribe((response:any)=>{
    this.isSubmitting=false;
    this.storageService.put(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY,response.users);
    //this.storageService.put(STORAGE_CONSTANTS.LOCAL_STORAGE_TOKEN_KEY,  response.token);
    this.getCurrentUser();
    this.edit=false;
    console.log('response in user  setting',response);
    var message="Changes Saved";
     this?.errorsService.emitSuccessMessage(message);
  },
  (error)=>{
    console.log('error in user  setting',error);
    var errorStr='Unknown Error';
    if(error?.error?.error){
      errorStr=error?.error?.error;
    }
    this?.errorsService.emitErrorMessage(errorStr);
    console.log('errorStr',errorStr);
    this.isSubmitting=false;
  }
  );
  }
  displayWebCamera() {
    if(this.isImageSubmiting || this.isSubmitting){
      return;
    }
   const userMatDialogRef = this.matDialog.open(WebcameraComponent, {
      maxWidth: '90vw',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose:true,
      data: {
        id: this.userAccount?.id,
      }
    });
    //dialog will return image taken as follow
    userMatDialogRef.afterClosed().subscribe((result) => {
      if (result) {
          this.imageSrc = result?.imageBase64;//to show user currently the image
          this.profilePhotoSrcForServer=result?.imageFile;//for server submission
          var entityId=this.userAccount?.id;
          var mediaPurposeType=IMAGE_CONSTANTS.MEDIA_PURPOSE_TYPES.PROFILE;
          this.submitImage(entityId,mediaPurposeType,result?.imageFile,
            'Auction cover Photo',
            'Image taken and produced by web camera'
          );
        console.log('WeB Camera responded to expense editable:', result);
        //Now call db save api here
      }
    });
  }
    //submitImage(producId,photoType, file, title, description)
    submitImage(entityId,mediaPurposeId,file, title, description) {
      //mediaPurposeId=IMAGE_CONSTANTS.MEDIA_PURPOSE_TYPES.PHOTO1
      this.isImageSubmiting = true;
      const formData = new FormData();
      formData.append('entityTypeId', IMAGE_CONSTANTS.ENTITY_TYPES.USER);
      formData.append('mediaTypeId', IMAGE_CONSTANTS.MEDIA_TYPES.PHOTO);
      formData.append('mediaPurposeId', mediaPurposeId);
      formData.append('image', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('topicNumber', '0');
      formData.append('applicationId', IMAGE_CONSTANTS.APPLICATION_ID);
      formData.append('entityId', entityId);
      
      console.log('formData:', formData);
      this.httpService.postWithTokenFormMulitpart(endpoints.mediaSave, formData).subscribe(
        (res) => {
          this.isImageSubmiting = false;
          this.randomNumber=Math.floor((Math.random() * 100) + 1);
          console.log('image save response:' , res); 
          location.reload();
        },
        (err) => {
          this.isImageSubmiting = false;
          console.log('image save error:', err);
        }
      );
    }
  createForm(){
  this.userForm= this.fb.group({
    id:new FormControl(this.userAccount?.id),
    userFname: new FormControl(this.userAccount?.userFname, [Validators.required,  Validators.maxLength(30)]),
    userLname : new FormControl(this.userAccount?.userLname, [Validators.required, Validators.maxLength(30)]),
    userStreetno  : new FormControl(this.userAccount?.userStreetno, [Validators.required,Validators.maxLength(30)]),
    userStreetname  : new FormControl(this.userAccount?.userStreetname, [Validators.required,Validators.maxLength(30)]),
    userEmail : new FormControl(this.userAccount?.userEmail, [Validators.required,
      //^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$
    Validators.email, Validators.maxLength(60)]),
    userPhoneno : new FormControl(this.userAccount?.userPhoneno, [Validators.required, Validators.pattern('[- +()0-9]+')]),
    userCity : new FormControl(this.userAccount?.userCity, [Validators.required, Validators.maxLength(60)]),
    localUpdatedTimestamp: new FormControl(new Date),
  });
}
get f(){
  return this.userForm?.controls;
}
getCityErrorMessage() {
  if (this.userForm?.controls['userCity']?.hasError('required')) {
    return 'Required field';
  }
  return '';
}
getFNameErrorMessage() {
  if (this.userForm?.controls['userFname']?.errors['required']) {
    return 'Required field';
  }
  if (this.userForm?.controls['userFname']?.hasError('maxlength')) {
    return 'Length should not exceed 30';
  }
  return '';
}
getLNameErrorMessage() {
  if (this.userForm?.controls['userLname']?.errors['required']) {
    return 'Required field';
  }
  if (this.userForm?.controls['userLname']?.hasError('maxlength')) {
    return 'Length should not exceed 30';
  }
  return '';
} 
 getUserStreetNoErrorMessage() {
  if (this.userForm?.controls['userStreetno']?.errors['required']) {
    return 'Required field';
  }
  if (this.userForm?.controls['userStreetno']?.hasError('maxlength')) {
    return 'Length should not exceed 30';
  }
  return '';
} 
 getUserStreetNameErrorMessage() {
  if (this.userForm?.controls['userStreetname']?.errors['required']) {
    return 'Required field';
  }
  if (this.userForm?.controls['userStreetname']?.hasError('maxlength')) {
    return 'Length should not exceed 30';
  }
  return '';
}
getAddressErrorMessage() {
  return this.userForm?.controls['address']?.hasError("maxlength") ? 'Length exceeded...' : '';
}
getEmailErrorMessage() {
  if (this.userForm?.controls['userEmail']?.hasError("required")) {
    return 'Email Required';
  }
  if (this.userForm?.controls['userEmail']?.hasError("email")) {
    return 'Not a valid email';
  }
  if (this.userForm?.controls['userEmail']?.hasError("maxlength")) {
    return 'Too lengthy ?';
  }
  return '';
}
getPhoneErrorMessage() {
  if (this.userForm?.controls['userPhoneno']?.hasError('required')) {
    return 'Required field';
  }
  if (this.userForm?.controls['userPhoneno']?.hasError('pattern')) {
    return 'Wrong input';
  }
  return '';
}
}///class body end








