import { Component, HostListener, OnDestroy, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {CONTENTS, LARGE_LOADER, LOADER, SMALL_SCREEN_SIZE } from 'src/app/constants/constants';
import { StorageService } from 'src/app/services/storage.service';
import { BiddingOrPurchaseDialogComponent } from '../bid-purchase-dialog/bidding-purchase-dialog.component';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { getUserCityByCode, STORAGE_AUCTIONS, STORAGE_CONSTANTS, STORAGE_ROUTE_HEADING } from 'src/app/constants/STORAGE-CONSTANT';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { AucctionService } from 'src/app/services/auction.service';
import { IMAGE_CONSTANTS } from 'src/app/constants/IMAGES_CONSTANTS';
import { environment } from 'src/environments/environment';
import { AuctionAllBidsDisplayDialogComponent } from '../show-all-bids-dialog/show-all-bids-dialog.component';
import { ErrorsService } from 'src/app/services/errors.service';

@Component({
  selector: 'bid-details',
  templateUrl: './detail-bid-page.component.html',
  styleUrls: ['./detail-bid-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BidDetailAndBiddingComponent implements OnInit, OnDestroy, AfterViewInit {
  randomNumber = Math.floor((Math.random() * 100) + 1);
  imagePart1 = environment.baseAPIUrlImage + 'imageByETP/';
  imagePart2 = '/' + IMAGE_CONSTANTS.ENTITY_TYPES.AUCTION + '/';
  image1Part3=IMAGE_CONSTANTS.MEDIA_PURPOSE_TYPES.PHOTO1 + '?ad=';
  image2Part3=IMAGE_CONSTANTS.MEDIA_PURPOSE_TYPES.PHOTO2 + '?ad=';
  defaultImage=LARGE_LOADER;
  loader=LOADER;
  image1Selected = true;
  isSubmitted = false;
  innerWidth = 0;
  auctionDetail = null;
  sellerUser: any;
  userBid: any;
  //bidderUser: any;
  loggedInUserAccount: any;
  differnceInHours = 0;
  userCity="";
  isLoadingData=false;
  blinker=true;
  hasBiderAlreadyBidSubmited=false;
  coverImageSrc:string;
  secondImageSrc:string;
  auctionbidSLoading=false;
  auctionAllBids=[];
  counter=0;
  @HostListener('window:resize', ['$event'])
  event(event) {
    this.innerWidth = window.innerWidth;
  }
  constructor(
    private storageService: StorageService,
    private acutionService: AucctionService,
    private errorService: ErrorsService,
    private userService: UserService,
    public dialog: MatDialog,
    public router: Router,
    private titleService: Title,
    private metaTagService: Meta,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.hasBiderAlreadyBidSubmited=false;
    this.innerWidth = window.innerWidth;
    this.auctionDetail = this.storageService.get(STORAGE_AUCTIONS.LOCAL_STORAGE_AUCTION_KEY_HOME);
    this.getCurrenLoggeddIntUser()
    if (!this.auctionDetail) {
      this.router.navigate(['/home']);
    }
    else{
      //load images streams 
      this.coverImageSrc=this.imagePart1+this.auctionDetail?.ID+this.imagePart2+this.image1Part3+this.randomNumber;
      this.secondImageSrc=this.imagePart1+this.auctionDetail?.ID+this.imagePart2+this.image2Part3+this.randomNumber;
    }
    console.log('auctionDetail', this.auctionDetail);
    this.titleService.setTitle("Bid Details");
    this.metadataTags();
    this.getSellerById();
    this.calculateRemainingHours();
    this.getUserBid();
  }

  getUserBid() {
    let payload = { "aucId": this.auctionDetail?.ID,
    "bidderId": this.loggedInUserAccount?.id  };
    this.acutionService.getAllBids(payload).subscribe((response) => {
      console.log('getUserBid. response:', response)
      if (response && response['rows'] && response['rows'].length > 0) {
        this.userBid = response['rows'][0];
        console.log('getUserBid. userBid', this.userBid);
      }

    },
      (error) => {
        ///this.isAuctionListLoading = false;
        console.log('getUserBid. error', error);
      }
    );
  }
  getAllBidsForAuction(){
    
    this.auctionbidSLoading=true;
    let params="?auctionId="+this.auctionDetail?.ID;
    this.acutionService.getAllBidsAgainstAnAuction(params).subscribe((response) => {
      console.log('getAllBidsForAuction. response in Profile', response);
      this.auctionbidSLoading=false;
      if (response && response['rows'] && response['rows']?.length>0) {
        this.auctionDetail!.bidCount= this.auctionAllBids?.length;
       this.auctionAllBids=response['rows'];
      this.showAllBidsDialog();
       console.log('getAllBidsForAuction. auctionAllBids.response in bid details', this.auctionAllBids);
      }
      if(this.auctionAllBids?.length==0){
        this.errorService.showSwalToastMessage('info','No Bids yet submitted','top',4000);
       }

    },
      (error) => {
        this.auctionbidSLoading=false;
        console.log('getAllBidsForAuction. error in profile', error);
      }
    );
  }
  getSellerById() {
    //this.isAuctionListLoading = true;
    let payload = { "id": this.auctionDetail?.Seller_ID };
    this.userService.getUsers(payload).subscribe((response) => {
      //console.log('auctionDetail.response:', response);
      //this.isAuctionListLoading = false;
      this.hasBiderAlreadyBidSubmited=false;
      if (response && response['rows'] && response['rows'].length > 0) {
        //this.auctionsList = response['rows'];
        //this.resultsLength =this.auctionsList?.length;
        this.sellerUser = response['rows'][0];
        console.log('auctionsList sellerUser', this.sellerUser);
        this.hasBiderAlreadyBidSubmited=true;
        this.userCity=getUserCityByCode(this.sellerUser?.userCity);
      }

    },
      (error) => {
        ///this.isAuctionListLoading = false;
        this.hasBiderAlreadyBidSubmited=false;
        console.log('error in home', error);
      }
    );
  }
  getCurrenLoggeddIntUser() {
    this.loggedInUserAccount = this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
    console.log('loggedInUserAccount', this.loggedInUserAccount);
  }
  calculateRemainingHours() {
    if (!this.auctionDetail) {
      console.log('calculateRemainingHours auctionDetail', this.auctionDetail);
      return;
    }
    //date1=new Date('2022-10-23 10:00 am');
    //date2=new Date('2022-10-26 4:15 pm');
    var date1 = new Date;
    var date2 = new Date(this.auctionDetail?.Auc_Close_Date);
    console.log('calculateRemainingHours date 1',date1);
    console.log('calculateRemainingHours date 2',date2);
    var differnce = date2.valueOf() - date1.valueOf();
    this.differnceInHours = +(differnce / 1000 / 60 / 60).toFixed(1);
    console.log('calculateRemainingHours difference In differnceInHours', this.differnceInHours);
  }
  showMessage(): boolean {
    if (this.isLoadingData) {
      return false;
    }
    if (!this.loggedInUserAccount?.id) {
      return false;
    }
    return (this.auctionDetail?.Seller_ID == this.loggedInUserAccount?.id);
  }
  gotoFrom(link: string) {
    //this.storageService.put(STORAGE_ROUTE_HEADING.LOCAL_STORAGE_FROM_PAGE,link);
    this.router.navigate([link]);
  }

  disableBidBtn():boolean{
    if (this.isLoadingData) {
      return true;
    }
    if (!this.loggedInUserAccount?.id) {
      return true;
    }
    
    return (this.auctionDetail?.Seller_ID==this.loggedInUserAccount?.id);
  }
  metadataTags() {
    this.metaTagService.addTags([
      { name: 'keywords', content: 'Surplus food bidding' },
      { name: 'robots', content: 'index, follow' },
      { name: 'writer', content: 'Zia Khan' },
      {
        name: 'description', content: CONTENTS
      },
      { charset: 'UTF-8' }
    ]);
  }
  ngOnDestroy(): void {
    this.storageService.remove(STORAGE_AUCTIONS.LOCAL_STORAGE_AUCTION_KEY_HOME);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.blinker=false;
    }, 2000);
  }
  toggleImage() {
    this.image1Selected = !this.image1Selected;
  }
  showAllBidsDialog(): void {
    if(this.counter>1){
      if(this.auctionAllBids?.length==0){
        this.errorService.showSwalToastMessage('info','No Bids yet submitted','top');
        return;
       }
    }
    let widthDialog = '99%';
    if (this.innerWidth >= SMALL_SCREEN_SIZE) {
      widthDialog = '500px';
    }
      const openAllBidsDialog = this.dialog.open(AuctionAllBidsDisplayDialogComponent, {
      width: widthDialog,
      data: {
        auctionAllBidsList:this.auctionAllBids, 
        sellerName:this.sellerUser?.userFname+" "+this.sellerUser?.userLname,
        loggedInUser:this.loggedInUserAccount
       },
      enterAnimationDuration: '300ms',
      exitAnimationDuration: "500ms",
      disableClose: true
    });
    openAllBidsDialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }


  openDialog(topElement?): void {
    if(this.auctionDetail?.Seller_ID == this.loggedInUserAccount?.id){
      alert("You can't bid on your own product");
      return;
    }
    this.isSubmitted = false;
    let widthDialog = '99%';
    if (this.innerWidth >= SMALL_SCREEN_SIZE) {
      widthDialog = '400px';
    }
    if(!this.loggedInUserAccount){
      alert('You must login before placing a bid against the product');
      return;
    }
    const openBidPricingDialog = this.dialog.open(BiddingOrPurchaseDialogComponent, {
      width: widthDialog,
      data: { 
        bidder:this.loggedInUserAccount,
        seller:this.sellerUser,
        auctionItem:this.auctionDetail,
        bid: this.userBid
       },
      enterAnimationDuration: '400ms',
      exitAnimationDuration: "700ms",
      disableClose: true
    });
    openBidPricingDialog.afterClosed().subscribe(result => {
      console.log('_mdr3', openBidPricingDialog);
      console.log('The dialog was closed', result);
      this.hasBiderAlreadyBidSubmited=false;
      if(result && result.bid){
        this.userBid=result.bid;
      }
      if (topElement && result) {
        this.isSubmitted = true;
        topElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  }
}