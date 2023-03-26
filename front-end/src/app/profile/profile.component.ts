import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ErrorsService } from 'src/app/services/errors.service';
import { StorageService } from 'src/app/services/storage.service';
import { STORAGE_AUCTIONS, STORAGE_CONSTANTS } from '../constants/STORAGE-CONSTANT';
import { Router } from '@angular/router';
import { AucctionService } from '../services/auction.service';
import {
  CONTENTS, ERROR_MESSAGE, getBidActionTextByStatus, getBidColorByCode,
  getBidEmojirByCode, getBidTextByCode, LOADER, auctionStatus, PURCHASER_BID_STATUS, 
  SELLER_AUCTION_BID_STATUS, SELLER_AUCTION_STATUS, ERROR_MESSAGE_TRY_LATER
} from '../constants/constants';
import { BidService } from '../services/bid.service';
import { MatDialog } from '@angular/material/dialog';
import { BidFeebbackComponent } from './bid-feedback-dialog/bid-feedback-dialog.component';
import { SMALL_SCREEN_SIZE } from 'src/app/constants/constants';
import { YesNoDialogComponent } from '../shared/yes-no-dialog/yes-no-dialog.component';
import { DatePipe } from '@angular/common';
//import { zip } from 'rxjs';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  loader = LOADER;
  isApproved = false;
  isSubmitted = false;
  showAlert = false;
  alertType = "";
  alertMessage = "";
  alertTypeIcon = "";
  userAccount: any;
  isUserLoggedIn = false;
  isUserPurchaseHistoryLoading = false;
  isUserSaleHistoryLoading = false;
  auctionbidSLoading = false;
  auctionSelectd: any;//to select an auction for all bids to display
  bidSelectd: any;//to select a bid to approve from all bids
  showBlinker = true;
  purchaseHistory = [];
  saleHistory = [];
  auctionAllBids = [];
  aucStatus=null;
  ExpiredAuctionsList = [];
  resultsLength = 0;
  innerWidth = 0;
  shimmarStyle = {
		width: '100%',
		height: '100%',
		margin: '0px',
	};
  msg = "This tell you about the auction is sold, unsold or still currently in bidding"
  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    private errorService: ErrorsService,
    private router: Router,
    private dialog: MatDialog,
    private storageService: StorageService,
    private auctionService: AucctionService,
    private bidService: BidService,
    private datePipe: DatePipe,
    //private http: HttpService,
  ) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.getCurrenSignedInUser();
    this.titleService.setTitle("User Profile");
    this.metadataTags();
    //angular call multiple APIs
    // zip(this.http.getNoTokenNew('auction/userPurchaseHistory?bidderId=2'),
    // this.http.getNoTokenNew('auction/saleHistory?bidderId=2') 
    // ).subscribe(([response1, response2]) => {
    //       console.log('111response1',response1);
    //       console.log('111response2',response2);
    // });
   console.log('tConvert : ',this.tConvert('18:00:00'));

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showBlinker = false;
    }, 3500);
  }
  editAuction(auction) {
    if (!auction) {
      alert(ERROR_MESSAGE);
      return;
    }
  }
  deleteAuction(auction) {
    console.log('deleteAuction auction', auction);
    if (!auction) {
      alert(ERROR_MESSAGE);
      return;
    }
    var status = auction?.status;
    if (status == SELLER_AUCTION_STATUS.AUCTION_BID_APPROVED_AND_BUYER_HAS_NOT_PAID_STATUS) {
      alert('Can not delete after accpeting a bid!. Please wait for the bidder to pay');
      return;
    }
    const yesNoDialog = this.dialog.open(YesNoDialogComponent, {
      width: "250px",
      data: {
        title: "Delete Auction",
        message: "Are you sure to delete this auction ",
        mainTopic: auction?.Prod_Name + " ?"
      },
      enterAnimationDuration: '400ms',
      exitAnimationDuration: "700ms",
    });
    yesNoDialog.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed', result);
      if (result == true) {
        auction!.status=SELLER_AUCTION_STATUS.AUCTION_DELETED_BY_SELLER_STATUS;
        this.aucStatus=SELLER_AUCTION_STATUS.AUCTION_DELETED_BY_SELLER_STATUS;
        this.updateSellerAuctionStatus(auction);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  event(event) {
    this.innerWidth = window.innerWidth;
  }
  //bidders to give feeback on bid   
  openFeedBackDialog(_bid) {
    let dialogWidth = "95%";
    if (this.innerWidth > SMALL_SCREEN_SIZE) {
      dialogWidth = "500px";
    }
    const dialog = this.dialog.open(BidFeebbackComponent, {
      maxWidth: '100vw',
      width: dialogWidth,
      panelClass: 'full-screen-modal',
      data: {
        bid: _bid,
        bidder: this.userAccount
      },
      disableClose: true
    });
    dialog.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed', result);
      if (result && result.id) {

      }
    });
  }
  //function to confirm the user action to approve the selected bid or not
  updateBidderBidStatusYesNoDialog(bid, auction, top) {
    if (!bid || !bid.status) {
      alert(ERROR_MESSAGE);
      return;
    }
    if (bid?.status != PURCHASER_BID_STATUS.BID_INITIAL_PLACED_STATUS) {
      return;
    }
    if (auction?.status != SELLER_AUCTION_STATUS.AUCTION_NEW_CREATED_AND_IN_BIDDING_STATUS ||
      this.auctionSelectd?.status != SELLER_AUCTION_STATUS.AUCTION_NEW_CREATED_AND_IN_BIDDING_STATUS) {
      alert('You have already approved a bid!');
      return;
    }
    const yesNoDialog = this.dialog.open(YesNoDialogComponent, {
      width: "250px",
      data: {
        title: "Approve Bid",
        message: "Are you sure to approve this " + bid?.userFirstName
          + " bid of ",
        mainTopic: "RS " + bid?.Bid_Price + " ?"
      },
      enterAnimationDuration: '400ms',
      exitAnimationDuration: "700ms",
    });
    yesNoDialog.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed', result);
      if (result == true) {
        this.updateBidderBidStatus(bid, auction, top);
      }
    });
  }
  //updata bidder bid status to approved by seller
  updateBidderBidStatus(bid: any, auction, topElement) {
    console.log('approvng bid: updateBidderBidStatus. bid', bid);
    console.log('approvng bid: updateBidderBidStatus. auction', auction);
    this.bidSelectd = bid;
    this.auctionSelectd.status = SELLER_AUCTION_STATUS.AUCTION_BID_APPROVED_AND_BUYER_HAS_NOT_PAID_STATUS;
    bid.status = SELLER_AUCTION_BID_STATUS.AUCTION_BID_APPROVED_AND_CHECKOUT_PENDING_STATUS;
    var payLoad:any={
      id:bid?.id,
			sellerId:bid?.Seller_ID,
			bidTime:bid?.Bid_Time,
			aucId:bid?.Auc_ID,
			bidderId:bid?.Bidder_ID,
			bidPrice:bid?.Bid_Price,
			bidComment:bid?.Bid_Comment,
			bidDate:bid?.Bid_Date,
			bidNumber:null,
			status:SELLER_AUCTION_BID_STATUS.AUCTION_BID_APPROVED_AND_CHECKOUT_PENDING_STATUS
		}

		console.log('approvng bid: updateBidderBidStatus payLoad preferred',payLoad);
    this.bidService.save(payLoad).subscribe(
      (response:any) => {
      console.log('approvng bid: updateBidderBidStatus. response:', response);
      if (response && response['success']) {
        console.log('approvng bid: updateBidderBidStatus inside if response ', response);
        this.aucStatus=SELLER_AUCTION_STATUS.AUCTION_BID_APPROVED_AND_BUYER_HAS_NOT_PAID_STATUS;
        this.updateSellerAuctionStatus(auction, topElement);
      }
    },
      (error:any) => {
        this.errorService.showSwalToastMessage('error',
        ERROR_MESSAGE_TRY_LATER, 'top');
        console.log('approvng bid: updateBidderBidStatus error:'+ error);
        console.log('approvng bid: updateBidderBidStatus error:', error);
      });
  }
   //updata seller auction status to auction approved but buyer payment pending
  updateSellerAuctionStatus(auction, topElement?) {
    let payLoad = {
      id: auction?.ID,
      prodName: auction?.Prod_Name,
      sellerId: auction?.Seller_ID,
      aucCloseDate: auction?.Auc_Close_Date,
      aucStartDate: auction?.Auc_Start_Date,
      aucReservePrice: auction?.Auc_Reserve_Price,
      prodStartBidAmount: auction?.Prod_Start_Bid_Amount,
      prodCatId: auction?.Prod_Cat_ID,
      status: this.aucStatus
    };
    auction!.status = this.aucStatus;
    this.auctionService.save(payLoad).subscribe((response) => {
      console.log('approvng bid: updateSellerAuctionStatus. response:', response);
      if (response && response['success']) {
        console.log('approvng bid: updateSellerAuctionStatus inside if response ', response);
        if (topElement) {
          topElement.scrollIntoView({
            behavior: 'smooth'
          });
           this.isApproved = true;
        }
      }
    },
      (error) => {
        this.errorService.showSwalToastMessage('error',
        ERROR_MESSAGE_TRY_LATER, 'top')
        console.log('approvng bid: updateSellerAuctionStatus error:', error);
      });
  }
  proceedBid(bid) {
    this.storageService.put(STORAGE_AUCTIONS.LOCAL_STORAGE_AUCTION_KEY_PROFILE, bid);
    console.log('proceedBid, bid passed', bid);
    this.router.navigate(['/profile/checkout']);
  }
  auctionUpdateStatusesIfDateIsOver() {
    var statusesList = [
      SELLER_AUCTION_STATUS.AUCTION_NEW_CREATED_AND_IN_BIDDING_STATUS,
      SELLER_AUCTION_STATUS.AUCTION_BID_APPROVED_AND_BUYER_HAS_NOT_PAID_STATUS];
    var todayDate = this.datePipe.transform(new Date(),'yyyy-MM-dd HH:mm');
    var payLoad = "?sellerId=" + this.userAccount?.id + "&setStatus=" +
      SELLER_AUCTION_STATUS.AUCTION_EXPIRED_STATUS + "&statuses=" + statusesList
      + "&todayDate=" + todayDate;
    console.log('auctionUpdateStatuses payLoad', payLoad);
    this.auctionService.auctionUpdateStatuses(payLoad).subscribe(
      (response) => {
        console.log('auctionUpdateStatuses. response', response);
      },
      (error) => {
        console.log('auctionUpdateStatuses. error', error);
      }
    );

  }
  getAllBidsForAuction(auction) {
    if (!this.userAccount || !auction?.ID) {
      console.log('userAccount---', this.userAccount);
      console.log('auction-----', auction);
      alert('You must login before checking your profile');
      return;
    }
    console.log('getAllBidsForAuction. AUCTION PASSED', auction);
    this.auctionSelectd = auction;
    this.auctionbidSLoading = true;
    let params = "?auctionId=" + auction?.ID;
    this.auctionService.getAllBidsAgainstAnAuction(params).subscribe((response) => {
      this.auctionbidSLoading = false;
      if (response && response['rows'] && response['rows']?.length > 0) {
        this.auctionAllBids = response['rows'];
        console.log('getAllBidsForAuction. auctionAllBids.response in Profile', this.auctionAllBids);
      }

    },
      (error) => {
        this.auctionbidSLoading = false;
        console.log('getAllBidsForAuction. error in profile', error);
      }
    );
  }
  getCurrenSignedInUserPurchaseHistory() {
    if (!this.userAccount) {
      return;
    }
    var statuesList=[
      PURCHASER_BID_STATUS.BID_INITIAL_PLACED_STATUS,
      SELLER_AUCTION_BID_STATUS.AUCTION_BID_APPROVED_AND_CHECKOUT_PENDING_STATUS,
    ];
    var setExpiredStatusOfBid=SELLER_AUCTION_BID_STATUS.AUCTION_BID_ACCEPTED_BUT_BUYER_HAS_NOT_PAID_STATUS;
    var todayDate=this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
    this.isUserPurchaseHistoryLoading = true;
    let payLoad = "?bidderId=" + this.userAccount?.id+"&statuesList="+statuesList+
    "&setExpiredStatusOfBid="+setExpiredStatusOfBid+"&todayDate="+todayDate;

    console.log('getCurrenSignedInUserPurchaseHistory. prefered payLoad in Profile',payLoad);
    this.auctionService.getPurchaseHisotyr(payLoad).subscribe((response) => {
      console.log('getCurrenSignedInUserPurchaseHistory. response in Profile', response);
      this.isUserPurchaseHistoryLoading = false;
      if (response && response['rows'] && response['rows']?.length > 0) {
        this.purchaseHistory = response['rows'];
        console.log('purchaseHistory. response in Profile', this.purchaseHistory);
      }

    },
      (error) => {
        this.isUserPurchaseHistoryLoading = false;
        console.log('getCurrenSignedInUserPurchaseHistory. error in profile', error);
      }
    );
  }
  getActionText(code) {
    return getBidActionTextByStatus(code);
  }
  getAuctionStatus(code) {
    return auctionStatus(code);
  }
  getCurrenSignedInUserSaleHistory() {
    if (!this.userAccount) {
      return;
    }
    var statusesList = [
      SELLER_AUCTION_STATUS.AUCTION_NEW_CREATED_AND_IN_BIDDING_STATUS,
      SELLER_AUCTION_STATUS.AUCTION_BID_APPROVED_AND_BUYER_HAS_NOT_PAID_STATUS];
    var todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
    var setStatus=SELLER_AUCTION_STATUS.AUCTION_EXPIRED_STATUS;
    this.isUserSaleHistoryLoading = true;
    var sortDirection="desc";
    var sortColumn="id";
    let payLoad = "?sellerId=" + this.userAccount?.id+"&sortDirection="+sortDirection
    +"&sortColumn="+sortColumn+"&statuses="+statusesList+ "&todayDate=" + todayDate+
    "&setStatus="+setStatus;
    console.log('getCurrenSignedInUserSaleHistory. prefferd payLoad ', payLoad);
    this.auctionService.getSaleHisoty(payLoad).subscribe((response) => {
      console.log('getCurrenSignedInUserSaleHistory. response in Profile', response);
      this.isUserSaleHistoryLoading = false;
      if (response && response['rows'] && response['rows']?.length > 0) {
        this.saleHistory = response['rows'];
        if (this.auctionSelectd?.ID)
          this.getAllBidsForAuction(this.auctionSelectd);
        console.log('getCurrenSignedInUserSaleHistory. profile saleHistory', this.saleHistory);
      }

    },
      (error) => {
        this.isUserSaleHistoryLoading = false;
        console.log('getCurrenSignedInUserSaleHistory. error in profile', error);
      }
    );
  }
  tConvert(time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time?.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
  
  getBidColor(code) {
    return getBidColorByCode(code);
  }
  getBidText(code) {
    return getBidTextByCode(code);
  }
  getBidEmoji(code) {
    return getBidEmojirByCode(code);
  }
  getCurrenSignedInUser() {
    var storedValue = this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
    if (storedValue && storedValue?.id) {
      this.userAccount = storedValue;
      this.isUserLoggedIn = true;
      this.getCurrenSignedInUserPurchaseHistory();
      this.getCurrenSignedInUserSaleHistory();
      //this.auctionUpdateStatusesIfDateIsOver();
      console.log('profile page: storedValue', storedValue);
    }
    else {
      this.setAlert('alert_danger',
        'Error!. You are not logged-In to see your purchase and sale history', 'fa-bell');
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
    this.metaTagService.addTags([
      { name: 'keywords', content: 'Surplus food bidding' },
      { name: 'robots', content: 'index, follow' },
      { name: 'writer', content: CONTENTS },
      { charset: 'UTF-8' }
    ]);
  }

}
