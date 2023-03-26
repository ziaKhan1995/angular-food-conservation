import { DatePipe} from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CONTENTS, DEFAULT_IMAGE, DESC_HINTS, onInputKeyDown, SMALL_SCREEN_SIZE } from '../constants/constants';
import { ErrorsService } from '../services/errors.service';
import { StorageService } from '../services/storage.service';
import { WebcameraComponent } from '../shared/webcamera/webcamera.component';
import { Meta, Title } from '@angular/platform-browser';
import { STORAGE_CONSTANTS } from '../constants/STORAGE-CONSTANT';
import { AucctionService } from '../services/auction.service';
import { ERROR_MESSAGE, LOADER, LARGE_LOADER } from 'src/app/constants/constants';
import { HttpService } from '../shared/http.service';
import { endpoints } from '../constants/end-points';
import { IMAGE_CONSTANTS } from '../constants/IMAGES_CONSTANTS';
import { SELLER_AUCTION_STATUS } from '../constants/constants';

@Component({
  selector: 'add-new-auction',
  templateUrl: './add-new-auction.component.html',
  styleUrls: ['./add-new-auction.component.css', '../scss/camera-img.scss'
    //,'../scss/alerts-css.css','../scss/alerts-css.min.css'
  ]
})
export class AdNewBidBiddingComponent implements OnInit, AfterViewInit {
  newAuctionForm: FormGroup;
  keepMeLoggedIn: FormControl;
  innerWidth = 0;
  currency = "PKR";
  descHints=DESC_HINTS;
  defaultImage = DEFAULT_IMAGE;
  isUserLoggedIn = false;
  isImageSubmiting=false;
  isDataSubmiting=false;
  showAlert = false;
  alertType = "";
  alertMessage = "";
  alertTypeIcon = "";
  userAccount: any;
  loader=LARGE_LOADER;
  auctionPhotoCoverSrc: any=DEFAULT_IMAGE;//show to user
  auctionPhotoCoverForServerSrc: string;//for serer submission
  auctionSecndPhotoCoverSrc: any=DEFAULT_IMAGE;
  // counter=0;//to show which image ia uploading
  auctionSecndPhotoCoverForServerSrc: string;//for server submission
	auctionPhotoCoverSrcForm = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(3)]),
		file: new FormControl('', [Validators.required]),
		fileSource: new FormControl('', [Validators.required])
	});
  auctionSecndPhotoCoverSrcForm = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(3)]),
		file: new FormControl('', [Validators.required]),
		fileSource: new FormControl('', [Validators.required])
	});
  @HostListener('window:resize', ['$event'])
  event(event) {
    this.innerWidth = window.innerWidth;
  }
  todayDate = "";
  productPhoto1Selected = false;
  productPhoto2Selected = false;
  isUploadedSecond=false;
  categories=[];
  private userMatDialogRef: MatDialogRef<WebcameraComponent> | undefined;
  //business:Business=new Business;
  constructor(
    private fb: FormBuilder,
    private errorService: ErrorsService,
    private httpService: HttpService,
    private storageService: StorageService,
    private auctionService: AucctionService,
    private router: Router,
    private dialog: MatDialog,
    private title: Title,
    private meta: Meta,
    private datePipe:DatePipe
  ) {

  }

  ngOnInit(): void {
    console.log('ngOnInit date only ',new Date().toLocaleDateString());
    console.log('ngOnInit time only ',new Date().toLocaleTimeString());
    this.isUserLoggedIn = false;
    this.showAlert = false;
    this.getCurrentSignedIntUser();
    this.newAuctionForm = this.initiateForm();
    this.innerWidth = window.innerWidth;
    this.todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm');
    this.title.setTitle("Add New Bid");
    this.metadataTags();
    this.loadCategories();
    //this.storageService.remove('TO_LINK');
  }
  loadCategories(){
    let params={}
    this.auctionService.getAllCategories(params).subscribe((res:any)=>{
      this.categories=res['rows'];
      console.log('loadCategories res', res);
      console.log('loadCategories categories', this.categories);
    },((err:any)=>{
      console.log('loadCategories err', err);
    }));
  }
  getCurrentSignedIntUser() {
    var storedValue = this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);

    if (storedValue && storedValue?.id) {
      this.userAccount = storedValue;
      console.log('storedValue', storedValue);
      this.isUserLoggedIn = true;
    }
    else {
      this.setAlert('alert_danger', 'Error!. You are not logged In');
      this.isUserLoggedIn = false;
    }
  }
  gotoFrom(link: string) {
    //this.storageService.put('TO_LINK',redirectLink);
    this.router.navigate([link]);
  }
  setAlert(type, message, icon?) {
    this.alertType = type;
    this.alertTypeIcon = icon;
    this.alertMessage = message;
    this.showAlert = true;
    return;
  }
  metadataTags() {
    this.meta.addTags([
      { name: 'keywords', content: 'Surplus food bidding' },
      { name: 'robots', content: 'index, follow' },
      { name: 'writer', content: 'Zia Khan' },
      {
        name: 'description', content: CONTENTS
      },
      { charset: 'UTF-8' }
    ]);
  }

  ngAfterViewInit(): void {
  this.getPage();
  }

  getPage(){
 
  }
  submit(topElement?) {
    console.log('user form before formatting', this.newAuctionForm);
    this.newAuctionForm?.markAsTouched();
    if (this.newAuctionForm?.invalid) {
      console.log('form is invalid');
      return;
    }
    //  if(!this.productPhoto1Selected){
    //   this.showCoverImageAlert(topElement);
    //   return;
    //  }new Date(), 
    var aucCloseDate=this.ff['aucCloseDate'].value;
    var aucCloseDateFormatted=this.datePipe.transform(aucCloseDate,'yyyy-MM-dd HH:mm');
    var aucStartDateFormatted=this.datePipe.transform(new Date(),'yyyy-MM-dd HH:mm');

    this.ff['aucCloseDate'].setValue(aucCloseDateFormatted);
    this.ff['aucStartDate'].setValue(aucStartDateFormatted);
    var message = " Success! Your product is added into auction list. Visit" +
      " home or your profile to see the auction you created";
    console.log('user form after formatting', this.newAuctionForm);
    this.isDataSubmiting = true;
    this.isDataSubmiting = true;
    this.auctionService.save(this.newAuctionForm.value).subscribe((response) => {
      this.isDataSubmiting=false;
      console.log('submit. response in add-new-auction', response);
      this.setAlert('alert_success', message, 'fa-bell');
      if (topElement) {
        topElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
      if (response && response['auction']) {
        var auctionReturned = response['auction'];
        console.log('submit. auctionReturned add-new-auction', auctionReturned);
        var mediaPurposeId=IMAGE_CONSTANTS.MEDIA_PURPOSE_TYPES.PHOTO1;
        var entityId=auctionReturned?.id;
        console.log('submit. auctionReturned id', entityId);
        if(entityId){
          // this.counter=1;
          this.submitImage(entityId,mediaPurposeId,this.auctionPhotoCoverForServerSrc,
            'Auction cover Photo',
            'Image taken and produced by web camera'
          );
        }
      }
    },
      (error) => {
        this.isDataSubmiting=false;
        console.log('error in add-new-auction', error);
        var errorMsg = ERROR_MESSAGE;
        if (error?.error?.error) {
          errorMsg = error?.error?.error;
        }
        this.setAlert('alert_danger', errorMsg, 'fa-bell')
      });

    //this.markClear();
    //this.newAuctionForm=this.initiateForm();
    return;
  }
  showCoverImageAlert(topElement){
      if (topElement) {
        topElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
      let message="Auction Cover Image Required";
      this.setAlert('alert_danger', message, 'fa-bell');
  }
  //submitImage(producId,photoType, file, title, description)
  submitImage(entityId,mediaPurposeId,file, title, description) {
    //mediaPurposeId=IMAGE_CONSTANTS.MEDIA_PURPOSE_TYPES.PHOTO1
		this.isImageSubmiting = true;
		const formData = new FormData();
    formData.append('entityTypeId', IMAGE_CONSTANTS.ENTITY_TYPES.AUCTION);
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
        console.log('image save response:' , res); 
        //now submit second image
        if(this.isUploadedSecond){
          this.isUploadedSecond=false;
          return;
        }
        this.isUploadedSecond=true;
        let mediaPurposeIdOfPhoto2=IMAGE_CONSTANTS.MEDIA_PURPOSE_TYPES.PHOTO2;
          this.submitImage(entityId,mediaPurposeIdOfPhoto2,this.auctionSecndPhotoCoverForServerSrc,
            'Auction cover Photo',
            'Image taken and produced by web camera'
          );
          //this.counter=3;
			},
			(err) => {
				this.isImageSubmiting = false;
				console.log('image save error:', err);
			}
		);
	}
  onKeyDown(event: Event) {
    onInputKeyDown(event)
  };
  initiateForm() {
    var desc = "This product is available in safe mode and its due date is guaranteed.";
    this.keepMeLoggedIn = new FormControl(false);
    return this.fb.group({
      prodName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      prodStartBidAmount: new FormControl('', [Validators.required, Validators.max(1000000), Validators.min(1)]),
      aucReservePrice: new FormControl('', [Validators.required, Validators.max(1000000), Validators.min(1)]),
      prodCatId: new FormControl(151, [Validators.required]),
      city: new FormControl('', [Validators.required]),
      aucStartDate: new FormControl(''),
      aucCloseDate: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      aucPaymentDate: new FormControl(),
      aucPaymentAmount: new FormControl(),
      minBidIncrement: new FormControl(),
      sellerId: new FormControl(this.userAccount?.id, [Validators.required]),
      prodDescription: new FormControl(desc, [Validators.required,Validators.maxLength(400)]),
      status: new FormControl(SELLER_AUCTION_STATUS.AUCTION_NEW_CREATED_AND_IN_BIDDING_STATUS),
      aucWinnerFname: new FormControl(''),
      aucWinnerLname: new FormControl(''),
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
      if (this.newAuctionForm.dirty) {
          $event.returnValue =true;
      }
  }
  displayWebCamera(num: number) {
    if(this.isImageSubmiting || this.isDataSubmiting){
      return;
    }
    this.userMatDialogRef = this.dialog.open(WebcameraComponent, {
      maxWidth: '90vw',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose:true,
      data: {
        id: '1331',//customer id
      }
    });
    //dialog will return image taken as follow
    this.userMatDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (num == 1) {
          this.productPhoto1Selected = true;
          this.auctionPhotoCoverSrc = result?.imageBase64;//to show user currently the image
          this.auctionPhotoCoverForServerSrc=result?.imageFile;
        }
        if (num == 2) {
          this.productPhoto2Selected = true;
          this.auctionSecndPhotoCoverSrc = result?.imageBase64;//to show user currently the image
          this.auctionSecndPhotoCoverForServerSrc=result?.imageFile;
        }
        console.log('WeB Camera responded to expense editable:', result);
        //Now call db save api here
      }
      this.userMatDialogRef = null;
    });
  }
  
  reset() {
    //console.log('user form',this.newAuctionForm);
    this.isDataSubmiting = false;
    if (this.newAuctionForm.touched && this.newAuctionForm.pristine) {
      this.markClear();
      return;
    }
    if (!this.newAuctionForm.value) {
      return;
    }
    Swal.fire('Clear all inputs', 'Are you sure to reset form ?'
    ).then((clearForm) => {
      if (clearForm.value) {
        this.markClear();
        return;
      }
      else {
        //user canceled inputs
        return;
      }
    });
    Swal.update({
      icon: 'question',
      confirmButtonText: 'Yes, clear all',
      showCancelButton: true,
      cancelButtonText: "No, Cancel",
      confirmButtonColor: '#4caf50',
    });
  }
  markClear() {
    this.newAuctionForm.markAsUntouched();
    this.newAuctionForm.markAsPristine();
    this.newAuctionForm.reset();
    this.newAuctionForm = this.initiateForm();
  }
  get ff() {
    return this.newAuctionForm?.controls;
  }
  //Form fields Error messages  functions 
  getNameErrorMessage() {
    if (this.newAuctionForm?.controls['prodName'].errors['required']) {
      return 'Required field';
    }
    if (this.newAuctionForm?.controls['prodName']?.hasError('minlength')) {
      return 'Minimum length should be 3';
    }
    if (this.newAuctionForm?.controls['prodName']?.hasError('maxlength')) {
      return 'Length should not exceed 30';
    }
    return '';
  }
  getAuctionProductPriceErrorMessage(): any {
    if (this.newAuctionForm?.controls['prodStartBidAmount']?.hasError('required')) {
      return 'Required Field';
    }
    if (this.newAuctionForm?.controls['prodStartBidAmount']?.hasError('min')) {
      return 'Value should not be zero';
    }
    if (this.newAuctionForm?.controls['prodStartBidAmount']?.hasError('max')) {
      return 'Maximum price 1000000';
    }
  }
  getDirectPurchasePriceErrorMessage(): any {
    if (this.newAuctionForm?.controls['aucReservePrice']?.hasError('required')) {
      return 'Required Field';
    }
    if (this.newAuctionForm?.controls['aucReservePrice']?.hasError('min')) {
      return 'Value should not be zero';
    }
    if (this.newAuctionForm?.controls['aucReservePrice']?.hasError('max')) {
      return 'Maximum price 1000000';
    }
  }
  getAddCategoryErrorMessage(): any {
    if (this.newAuctionForm?.controls['addCategory']?.hasError("required")) {
      return 'Category Required';
    }
  } 
  getAddQuantityErrorMessage(): any {
    if (this.newAuctionForm?.controls['quantity']?.hasError("required")) {
      return 'Quantity Required';
    }
  }
  getCityErrorMessage() {
    if (this.newAuctionForm?.controls['city']?.hasError('required')) {
      return 'Required field';
    }
    return '';
  }
  getAuctionClosingDateErrorMessage(): any {
    if (this.newAuctionForm?.controls['aucCloseDate']?.hasError('required')) {
      return 'Required for bidders to participate';
    }
  }
  getDetailDescriptionErrors(): any {
    if (this.newAuctionForm?.controls['prodDescription']?.hasError('required')) {
      return 'Required field';
    }
    if (this.newAuctionForm?.controls['prodDescription']?.hasError('maxlength')) {
      return 'Length exceeded';
    }
  }
  deleteProductPhoto1() {
    this.auctionPhotoCoverSrc = DEFAULT_IMAGE;
    this.productPhoto1Selected = false;
    return;
  }
  deleteProductPhoto2() {
    this.auctionSecndPhotoCoverSrc = DEFAULT_IMAGE;
    this.productPhoto2Selected = false;
    return;
  }
}
