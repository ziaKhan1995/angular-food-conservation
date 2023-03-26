import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgModel, FormGroup, FormControl, Validators } from '@angular/forms';
import { onInputKeyDown, ERROR_MESSAGE, PURCHASER_FEEDBACK_STATUS } from 'src/app/constants/constants';
import { ErrorsService } from '../../services/errors.service';
import { FeebBackService } from '../../services/feedback.service';
import { DatePipe, formatDate } from '@angular/common';

@Component({
	selector: 'bid-feedback-dialog',
	templateUrl: 'bid-feedback-dialog.component.html',
	styleUrls: ['bid-feedback-dialog.component.css']
})
export class BidFeebbackComponent implements OnInit, AfterViewInit {
	@ViewChild('customerBidPrice') customerBidPrice: NgModel;
	@ViewChild('commentRef') commentRef: NgModel;
	data: any;
	currency = "PKR";
	bidderName="";
	rating=3;
	isFeedbackSubmitting=false;
	isAlreaPlacedFeedbackLoading=false;
    feedBackForm:FormGroup;
	auctionIteMActualPrice=0;
	alreadyPlacedBid:any;
	shimmarStyle = {
		width: '100%',
		height: '100%',
		margin: '0px',
	};
	constructor(
		private feebBackService:FeebBackService,
		private errorsService:ErrorsService,
		private _mdr: MatDialogRef<BidFeebbackComponent>,
		private datePipe: DatePipe,
		@Inject(MAT_DIALOG_DATA) data: any) {
		if (data) {
			this.data = data;
			console.log('_mdr data passed', this.data);
			this.bidderName=data?.bidder?.userFname;
			this.getAlreadyPlacedFeedBack();
		}
	}

	ngOnInit() {
   
	}
	ngAfterViewInit() {

	}
	getAlreadyPlacedFeedBack() {
		this.isAlreaPlacedFeedbackLoading = true;
		console.log('getAlreadyPlacedFeedBack ', this.data?.bid);
		let payLoad = {
			sellerId: this.data?.bid?.Seller_ID,
			buyerId: this.data?.bidder?.id,
			aucId: this.data?.bid?.ID,
		}
		console.log('payload for fdback',payLoad);
		this.feebBackService.getFeedBack(payLoad).subscribe(
			(response) => {
				this.isAlreaPlacedFeedbackLoading = false;
				console.log('get Feedback response', response);
				if(response && response['rows'] && response['rows'][0]){
					this.alreadyPlacedBid=response['rows'][0];
					console.log('get already placed Feedback inside if', this.alreadyPlacedBid);
					this.createForm(this.alreadyPlacedBid);
				}
			},
			(error) => {
				this.isAlreaPlacedFeedbackLoading = false;
				console.log('get Feedback error', error);
				this.createForm();
			}
		);
	}
	disableSubmitBtn(){
		return ((
			this.alreadyPlacedBid?.id && 
			this.f['comments'].value==this.alreadyPlacedBid?.comments &&  
			this.f['sellerCooperation'].value==this.alreadyPlacedBid?.sellerCooperation &&  
			this.f['satisfactionRating'].value==this.alreadyPlacedBid?.satisfactionRating &&  
			this.f['overallRating'].value==this.alreadyPlacedBid?.overallRating  
			
			) ?true :false);
	}
	createForm(alreadyPlacedBid?){
		var comments="";
		var sellerCooperation:any="";
		var satisfactionRating:any="";
		var overallRating:any="";
		if(alreadyPlacedBid && alreadyPlacedBid?.id && alreadyPlacedBid?.buyerId){
			comments=alreadyPlacedBid?.comments;
			sellerCooperation=alreadyPlacedBid?.sellerCooperation;
			satisfactionRating=alreadyPlacedBid?.satisfactionRating;
			overallRating=alreadyPlacedBid?.overallRating;
		}
		this.feedBackForm=new FormGroup(
			{
				overallRating:new FormControl(overallRating,Validators.required),
				sellerCooperation:new FormControl(sellerCooperation,Validators.required),
				satisfactionRating:new FormControl(satisfactionRating,Validators.required),
				comments:new FormControl(comments),
			}
		);
	}
	onKeyDown(event: Event) {
		onInputKeyDown(event);
	}
	get f(){
		return this.feedBackForm?.controls;
	}
	submitFeedback() {
		if(!this.f['overallRating'].value || !this.f['sellerCooperation'].value || 
		!this.f['satisfactionRating'].value){
			this.errorsService.showSwalToastMessage('error','Fields marked with * are required');
			return;
		}
		var fdbStatus=PURCHASER_FEEDBACK_STATUS.FEEDBACK_INITIAL_PLACED_STATUS;
		if(this.alreadyPlacedBid && this.alreadyPlacedBid?.id){
			fdbStatus=PURCHASER_FEEDBACK_STATUS.FEEDBACK_MODIFIED_STATUS;
		}		
		var time=this.datePipe.transform(new Date(),'HH:mm:ss');
		var date=this.datePipe.transform(new Date(),'yyyy-MM-dd');
		var payLoad: any = {
			sellerId: this.data?.bid?.Seller_ID,
			buyerId: this.data?.bidder?.id,
			aucId: this.data?.bid?.ID,
			fdbTime: time,
			fdbDate: date,
			overallRating: this.f['overallRating'].value,
			shippingDelivery: null,
			sellerCooperation: this.f['sellerCooperation'].value,
			satisfactionRating: this.f['satisfactionRating'].value,
			comments: this.f['comments'].value,
			status: fdbStatus,
		}
		if(this.alreadyPlacedBid && this.alreadyPlacedBid?.id){
			payLoad.id=this.alreadyPlacedBid?.id;
		}
		this.isFeedbackSubmitting=true;
	     
		//check is if user has already bid submitted
		console.log('payLoad',payLoad);
		this.feebBackService.saveFeedback(payLoad).subscribe((response)=>{
		this.isFeedbackSubmitting=false;
		console.log('submitFeedback. response:', response);
		if(response && response['success'] && response['feedback']){
			console.log('submitFeedback response inside if:', response['bid']);
			this.data.feedback=response['bid'];
			this._mdr.close(this.data);
			this.errorsService.showSwalToastMessage('success','Your feedback has been submitted successfully','top',5000);
		}
		else{
			this._mdr.close(this.data);
			this.errorsService.showSwalToastMessage('info','Check your profile','top');
		}
		},
		
		(error)=>{
			this.isFeedbackSubmitting=false;
			console.log('submitFeedback. error:', error);
			this.errorsService.showSwalToastMessage('error',ERROR_MESSAGE,'top');
		});
	}
	closeDialogCancel() {
		this._mdr.close(false);
	}
	showSumErrors(): any {
		if (this.customerBidPrice?.control.errors['required'])
			return "required Fields";
	}
}
