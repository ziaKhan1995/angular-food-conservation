import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { STORAGE_AUCTIONS, STORAGE_CONSTANTS } from './../../constants/STORAGE-CONSTANT';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { getImage } from 'src/app/constants/IMAGES_CONSTANTS';
import { ErrorsService } from './../../services/errors.service';
import { BidService } from './../../services/bid.service';
import { ERROR_MESSAGE, LOADER } from 'src/app/constants/constants';
import { AucctionService } from 'src/app/services/auction.service';
import { PURCHASER_BID_STATUS } from './../../constants/constants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'checkout-now',
  templateUrl: './checkout-now.component.html',
  styleUrls: ['./checkout-now.component.css']
})
export class CheckoutNowComponent implements OnInit, OnDestroy, AfterViewInit {
  checkOutForm: FormGroup;
  //form: FormGroup;
  isSubmitted = false;
  loader=LOADER;
  userAccount:any;
  bid: any;
  valid = require('card-validator');
  creditCardType = require("credit-card-type");
  isFocused=false;
  imgSrc="assets/ic-blank.png";
  counter=0;
  isBidSubmitting=false;
  updateUActionPayLoad:any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private bidService:BidService,
		private errorsService:ErrorsService,
		private auctionService:AucctionService,
		private datePipe:DatePipe,
  ) { }
/**
 *   //To add days to date
    var today = new Date('2022-12-23 14:50');
    console.log('kkkkk',today);
var datea = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()+2)+" "+today.getHours()+":"+today.getMinutes();
console.log(';;;;;',datea);
 */
  ngOnInit(): void {
    this.getCurrenSignedInUser();    
  }
  getCurrenSignedInUser(){
    var storedValue=this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
    if(storedValue && storedValue?.id){
      this.userAccount=storedValue;
      this.bid = this.storageService.get(STORAGE_AUCTIONS.LOCAL_STORAGE_AUCTION_KEY_PROFILE);
      console.log('profile/checkout bid', this.bid);
      if (this.bid?.status==PURCHASER_BID_STATUS.BID_CHECKOUT_CONFIRMED_BY_PURCHASER_STATUS) {
        this.router.navigate(['/profile']);
        alert('already done');
      }
      if (!this.bid) {
        this.router.navigate(['/profile']);
        alert('Invalid attempts');
      }
      console.log('profile page: storedValue',storedValue);
      this.initiateForm();
    }
    else{
     this.errorsService.showSwalToastMessage('error','You are not logged In','top');
     this.router.navigate(['/home']);
    }
  }
  updateStatusOfAuction(topElement){
    var dateNow=new Date();
    var dateModidied= dateNow.setDate(dateNow.getDate()+2);
    var aucFinishDate=this.datePipe.transform(dateModidied,'yyyy-MM-dd HH:mm');
    this.updateUActionPayLoad={
      id:this?.bid?.ID,
      prodName: this.bid?.Prod_Name,
      prodStartBidAmount:this.bid?.Prod_Start_Bid_Amount,
      aucReservePrice: this.bid?.Auc_Reserve_Price,
      prodCatId: this.bid?.Prod_Cat_ID,
      aucStartDate: this.bid?.Auc_Start_Date,
      auctionFinishDate: aucFinishDate,
      aucCloseDate: this.bid?.Auc_Close_Date,
      aucPaymentDate: new Date(),
      aucWinnerFname: this.userAccount?.userFname,
      aucWinnerLname: this.userAccount?.userLname,
      aucPaymentAmount: this.bid?.bid_price,
      minBidIncrement: null,
      sellerId: this.bid?.Seller_ID,      
      status:PURCHASER_BID_STATUS.BID_CHECKOUT_CONFIRMED_BY_PURCHASER_STATUS
    }
    console.log('updateUActionPayLoad prepared',this.updateUActionPayLoad);
    this.auctionService.save(this.updateUActionPayLoad).subscribe((response) => {
      this.isSubmitted=true;
      this.isBidSubmitting=false;
      console.log('submit. response in profile/checkout', response);
      this.storageService.remove(STORAGE_AUCTIONS.LOCAL_STORAGE_AUCTION_KEY_PROFILE);
      if (topElement) {
        topElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    },
      (error) => {
        this.isBidSubmitting=false;
        console.log('error in add-new-auction', error);
        var errorMsg = ERROR_MESSAGE;
        if (error?.error?.error) {
          errorMsg = error?.error?.error;
        }
        this.errorsService.showSwalToastMessage('error',errorMsg,'top',4000)
      });
  }
  get f() {
    return this.checkOutForm.controls;
  }
  showCardErrors(number): any {
    if (!this.valid.number(number).isValid) {
      return "Card number is not valid";
    }
    return "";
  }
  showDateErrors(number): any {
    if (!this.valid.expirationDate(number).isValid) {
      return "Expiration date is not valid";
    }
    return "";
  }
  showCVVErrors(number): any {
    if (!this.valid.cvv(number).isValid) {
      return "Security code is not valid";
    }
    return "";
  }
  initiateForm() {
    if(!this.userAccount){
      return;
    }
    var address="street No "+this.userAccount?.userStreetno+" "+this.userAccount?.userStreetname+
    " "+this.userAccount?.userCity;
    this.checkOutForm = this.fb.group({
      name: new FormControl(this.bid?.Prod_Name, [Validators.required]),
      auctionProductPrice: new FormControl(this.bid?.bid_price, [Validators.required]),
      address: new FormControl(address, [Validators.required]),//shipping Address
      creditCard: new FormControl('', [Validators.required]),
      creditCardDate: new FormControl('', [Validators.required]),
      creditCardCvv: new FormControl('', [Validators.required]),
    });
    console.log('form created: ',this.checkOutForm);
  }
  
  confirmPaymentDialog(topElement):any {
    if(!this.f['name'].value){
      alert('Your Name is must');
      return;
    }
    if(!this.f['auctionProductPrice'].value){
      alert('Bid Price Fields is required');
      return;
    }
    if(!this.f['address'].value){
      alert('Your address is empty');
      return;
    }
    var creditCardCvv = this.f['creditCardCvv'].value;
    var creditCardDate = this.f['creditCardDate'].value;
    var creditCard = this.f['creditCard'].value;
    this.checkOutForm.markAllAsTouched();
    if (this.showCVVErrors(creditCardCvv) || this.showDateErrors(creditCardDate) ||
      this.showCardErrors(creditCard)) {
      return;
    }
    var message = 'Are you sure to pay <b>' + this.bid?.bid_price + '</b>' +
      " for auction " + this.bid?.Prod_Name + "?";
    Swal.fire({
      html: message,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      icon: 'question',
      showCloseButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#4caf50',
      showCancelButton: true,
      cancelButtonText: 'No',
      cancelButtonColor: '#dc3545'
      }).then((hasPaid) => {
        if (hasPaid.value) {
          this.updateStatusOfBid(topElement);
        }
        else {
        }
      });
    // Swal.fire('', message
    // )
    //   .then((hasPaid) => {
    //     if (hasPaid.value) {
    //       this.updateStatusOfBid(topElement);
    //     }
    //     else {
    //     }
    //   });
    // Swal.update({
    //   icon: 'question',
    //   showCloseButton: true,
    //   confirmButtonText: 'Yes',
    //   confirmButtonColor: '#4caf50',
    //   showCancelButton: true,
    //   cancelButtonText: 'No',
    //   cancelButtonColor: '#dc3545',
    // });
  }
  //submit function
  updateStatusOfBid(topElement) {
    this.isBidSubmitting=true;
    this.bid.status=PURCHASER_BID_STATUS.BID_CHECKOUT_CONFIRMED_BY_PURCHASER_STATUS;
    var payLoad:any={
      id:this.bid?.bidId,//bid id
			aucId:this.bid?.ID,//auction id			
      bidderId:this.userAccount?.id,//bidder on auction item
      sellerId:this.bid?.Seller_ID,//auction seller
			status:PURCHASER_BID_STATUS.BID_CHECKOUT_CONFIRMED_BY_PURCHASER_STATUS,
      updateOtherBidStatuses:true,
      //the folloowing parameter is to set the status for those users bids are not approved
      updateOtherBidStatusesTo:PURCHASER_BID_STATUS.BID_NOT_APPROVED_BY_SELLER_STATUS,

		}
    
    this.bidService.save(payLoad).subscribe((response)=>{
      console.log('submitBid. response:', response);
      if(response && response['success'] && response['bid']){
        console.log('response.bid response inside if:', response['bid']);
        this.updateStatusOfAuction(topElement);
      }
      else{
        this.errorsService.showSwalToastMessage('info',ERROR_MESSAGE,'top');
      }
      },
      
      (error)=>{
        this.isBidSubmitting=false;
        console.log('submitBid. error:', error);
        this.errorsService.showSwalToastMessage('error',ERROR_MESSAGE,'top');
      });
  }
  onInputIcon(){
    var value:string=this.f['creditCard'].value+"";
    if(!value){
      this.imgSrc="assets/ic-blank.png";
      return;
    }
     var visaCards = this.creditCardType(value);
     console.log('creditCardType',visaCards);
     console.log('creditCardType[0].type',visaCards[0].niceType);
     if(getImage(visaCards[0].niceType)){
      this.imgSrc=getImage(visaCards[0].niceType);
     }
      else{
        this.imgSrc="assets/ic-blank.png";
      }
   
  }
  onInput() {
   
    if (this.f['creditCard'].value?.length==4) {
      this.f['creditCard'].setValue(this.f['creditCard'].value + " "); 
      this.counter=2;
    }
    else if(this.f['creditCard'].value?.length==9){
      this.f['creditCard'].setValue(this.f['creditCard'].value + " "); 
      this.counter=3;
    }
    else if(this.f['creditCard'].value?.length==14){
      this.f['creditCard'].setValue(this.f['creditCard'].value + " "); 
      this.counter=5;
    }
    else if(this.f['creditCard'].value?.length==19){
      this.f['creditCard'].setValue(this.f['creditCard'].value + " "); 
    }
    this.counter=0;
  }
  ngAfterViewInit(): void {
    if (!this.bid) {
      this.router.navigate(['/profile']);
    }
  }
  ngOnDestroy(): void {
    this.storageService.remove(STORAGE_AUCTIONS.LOCAL_STORAGE_AUCTION_KEY_PROFILE);
  }
  cancel() {
    this.f['creditCardCvv'].setValue('');
    this.f['creditCard'].setValue('');
    this.f['creditCardDate'].setValue('');
  }
  preventInput(e:any){
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
}
