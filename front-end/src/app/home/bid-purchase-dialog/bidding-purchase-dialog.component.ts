import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgModel, } from '@angular/forms';
import { onInputKeyDown, ERROR_MESSAGE } from 'src/app/constants/constants';
import { BidService } from 'src/app/services/bid.service';
import { ErrorsService } from './../../services/errors.service';
import { DatePipe} from '@angular/common';
import { PURCHASER_BID_STATUS } from './../../constants/constants';

@Component({
	selector: 'bid-purchase-dialog',
	templateUrl: 'bidding-purchase-dialog.component.html',
	styleUrls: ['bidding-purchase-dialog.component.css']
})
export class BiddingOrPurchaseDialogComponent implements OnInit, AfterViewInit {
	@ViewChild('customerBidPrice') customerBidPrice: NgModel;
	@ViewChild('commentRef') commentRef: NgModel;
	data: any
	currency = "PKR";
	bidderName="";
	isBidSubmitting=false;
	bidPrice=null;
	comments;
	auctionIteMActualPrice=0;
	constructor(
		private bidService:BidService,
		private errorsService:ErrorsService,
		private _mdr: MatDialogRef<BiddingOrPurchaseDialogComponent>,
		private datePipe:DatePipe,
		@Inject(MAT_DIALOG_DATA) data: any) {
		if (data) {
			this.data = data;
			console.log('_mdr data passed', this.data);
			this.bidderName=data?.bidder?.userFname+" "+data?.bidder?.userLname;
			if(data?.bid?.id){
				this.comments=data?.bid?.bidComment;
			}
			this.auctionIteMActualPrice=this.data?.auctionItem?.Prod_Start_Bid_Amount;
			console.log('_mdr auctionIteMActualPrice', this.auctionIteMActualPrice);
		}
	}

	ngOnInit() {

	}
	ngAfterViewInit() {

	}
	onKeyDown(event: Event) {
		onInputKeyDown(event);
	}
	submitBid() {
		this.customerBidPrice.control.markAllAsTouched();
		if (this.customerBidPrice?.invalid || this.commentRef?.invalid) {
			return;
		}
		var percent:number=(this.auctionIteMActualPrice*60)/100;
		var maxPrice:number=this.auctionIteMActualPrice+(this.auctionIteMActualPrice*50)/100;
		if(this.customerBidPrice?.value>(this.auctionIteMActualPrice+percent)){
			var message="You can't bid more than <b>"+maxPrice+"</b>";
			this.errorsService.showSwalToastMessage('warning',message,'top',4000);
			return;
		}
		var time=this.datePipe.transform(new Date(),'HH:mm');
		var date=this.datePipe.transform(new Date(),'yyyy-MM-dd');
		var payLoad:any={
			sellerId:this.data?.auctionItem?.Seller_ID,
			//bidTime:(new Date).toLocaleTimeString(),
			bidTime:time,
			aucId:this.data?.auctionItem?.ID,
			bidderId:this.data?.bidder?.id,
			bidPrice:this.customerBidPrice.value,
			bidComment:this.commentRef.value ?? "",
			bidDate:date,
			bidNumber:null,
			status:PURCHASER_BID_STATUS.BID_INITIAL_PLACED_STATUS
		}
		this.isBidSubmitting=true;
	
		//check is if user has already bid submitted
		if(this.data?.bid?.id){
			payLoad.id=this.data?.bid?.id;	
		}
		console.log('payLoad preferred',payLoad);
		this.bidService!.save(payLoad)!.subscribe((response:any)=>{
		this.isBidSubmitting=false;
		console.log('submitBid. response:', response);
		if(response && response['success'] && response['bid']){
			console.log('response.bid response inside if:', response['bid']);
			this.data.bid=response['bid'];
			this._mdr.close(this.data);
		}
		else{
			this._mdr.close(this.data);
			this.errorsService.showSwalToastMessage('info','Check your profile','top');
		}
		},
		
		(error:any)=>{
			this.isBidSubmitting=false;
			console.log('submitBid. error:', error);
			this.errorsService.showSwalToastMessage('error',ERROR_MESSAGE,'top');
		});
	}
	closeDialogCancel() {
		this._mdr.close(false);
	}
	showSumErrors(): any {
		if (this.customerBidPrice?.control?.errors['required'])
			return "You must enter bid price";
		if (this.customerBidPrice?.control?.errors['min'])
			return "Amount should be greater than 0";
		if (this.customerBidPrice?.control?.errors['max'])
			return "Amount should be less than 1000000";
		if (this.customerBidPrice?.control?.errors['pattern'])
			return "Only 3 decimal places allowed";
	}
}
