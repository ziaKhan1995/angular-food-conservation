import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { CONTENTS } from '../constants/constants';
import { StorageService } from '../services/storage.service';
import { STORAGE_CONSTANTS } from './../constants/STORAGE-CONSTANT';
import { getUserCityByCode } from 'src/app/constants/STORAGE-CONSTANT';
import { endpoints } from '../constants/end-points';
import { HttpService } from '../shared/http.service';
import { ErrorsService } from 'src/app/services/errors.service';
import { ERROR_MESSAGE, LOADER } from 'src/app/constants/constants';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactUsForm:FormGroup;
  currentLoggedInUser:any;
  isEmailSending=false;
  loader=LOADER;
  constructor(private fb:FormBuilder,
    private storageService:StorageService,
    private httpService:HttpService,
    private errorsService:ErrorsService,
    private title:Title,
    private meta:Meta) { }
  ngOnInit(): void { 
   this.currentLoggedInUser = this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
   console.log('contatc us currentLoggedInUser',this.currentLoggedInUser);
   this.createForm();
   this.title.setTitle("Contact Us");
   this.metadataTags();

}
metadataTags(){
 
  this.meta.addTags([  
    { name: 'keywords', content: 'Contact Us' },  
    { name: 'robots', content: 'index, follow' },  
    { name: 'writer', content: 'Zia Khan' }, 
    { name: 'description', content:CONTENTS }, 
    { charset: 'UTF-8' }  
  ]);  
}
  submit(){
    console.log('contactUsForm',this.contactUsForm);
    this.contactUsForm.markAllAsTouched();
   if(this.contactUsForm.invalid){
    return;
   }
   //call contact us api us
   this.isEmailSending=true;
   var info="Address="+this.form['address'].value+", Gender="+this.form['gender'].value
   let payload = {
    'source': 'FCWR-PORTAL-APP',
    'name': this.form['name'].value,
    'email': this.form['email'].value,
    'phone': this.form['phone'].value,
    'message': info+", Query="+ this.form['comments'].value,
    'applicationId':'5'
    }

    this.contactus(payload);
  }
  contactus(payload: any) {
    console.log(endpoints.notification.contactUs + '.request:', payload);
    return this.httpService
        .postNoTokenNotification(endpoints.notification.contactUs, payload).subscribe((response)=>{
          console.log('contact-us http success response',response);
          var heading="Thank you for reaching out. We will get back to you within 24 hours."
          this.errorsService.emitSuccessMessage(heading);
          this.isEmailSending=false;
        },
        
        (error)=>{
          console.log('contact-us http error',error);
          var ersMsg="There is a technical with our server. Please try later"
          this.errorsService.emitErrorMessage(ersMsg);
          this.isEmailSending=false;
        });
}
  clear(){
    this.contactUsForm.reset();
    return false;
  }
  createForm(){
    var fullname="";
    var address="";
    var email="";
    var phone="";
    if(this.currentLoggedInUser && this.currentLoggedInUser?.id){
      fullname=this.currentLoggedInUser?.userFname+" "+this.currentLoggedInUser?.userLname;
      address=getUserCityByCode(this.currentLoggedInUser?.userCity);
      email=this.currentLoggedInUser?.userEmail;
      phone=this.currentLoggedInUser?.userPhoneno;
    }
    this.contactUsForm=this.fb.group({
      name:new FormControl(fullname,Validators.required),
      address:new FormControl(address,Validators.required),
      phone:new FormControl(phone,[Validators.required,Validators.pattern('[- +()0-9]+')]),
      gender:new FormControl('',Validators.required),
      email:new FormControl(email,[Validators.required,Validators.email]),
      comments:new FormControl('',[Validators.required,Validators.minLength(20)]),
      acceptTermsAndConditions:new FormControl(false,Validators.required),
    });
  }
  get form(){
    return this.contactUsForm?.controls;
  }
  commentsErrors():any{
    if(this.form['comments']?.hasError('required')){
      return "This field is required";
    }
    if(this.form['comments']?.hasError('minlength')){
      return "Write at least 20 characters.";
    }
  }
 PhoneErrors():any{
    if(this.form['phone']?.hasError('required')){
      return "This field is required";
    }
    if(this.form['phone']?.hasError('pattern')){
      return "Invalid Patern. digits only";
    }
  }
}
