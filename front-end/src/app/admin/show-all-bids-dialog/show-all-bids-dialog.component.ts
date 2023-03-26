import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
	selector: 'show-all-bids-dialog',
	templateUrl: 'show-all-bids-dialog.component.html',
	styleUrls: ['show-all-bids-dialog.component.css']
})
export class AuctionAllBidsDisplayDialogComponent implements OnInit, AfterViewInit {
	auctionAllBidsList: any
	sellerName="";
	data:any;
	constructor(
		private _mdr: MatDialogRef<AuctionAllBidsDisplayDialogComponent>,
		@Inject(MAT_DIALOG_DATA) data: any) {
		if (data) {
			this.data=data;
			this.auctionAllBidsList = data?.auctionAllBidsList;
			console.log('_mdr data passed',data);
			this.sellerName=data?.sellerName;
		}
	}

	ngOnInit() {

	}
	ngAfterViewInit() {

	}
		
	closeDialogCancel() {
		this._mdr.close(false);
	}
}
