import { Component, OnInit, HostListener } from '@angular/core';
import { CONTENTS, SMALL_SCREEN_SIZE, ERROR_MESSAGE, auctionStatus, ERROR_MESSAGE_TRY_LATER, LOADER } from 'src/app/constants/constants';
import { AdminLoginModalComponent } from './admin-login-modal/admin-login-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { STORAGE_CONSTANTS } from '../constants/STORAGE-CONSTANT';
import { StorageService } from '../services/storage.service';
import { AucctionService } from '../services/auction.service';
import { ErrorsService } from 'src/app/services/errors.service';
import { AuctionAllBidsDisplayDialogComponent } from './show-all-bids-dialog/show-all-bids-dialog.component';
import { SELLER_AUCTION_STATUS } from './../constants/constants';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  innerWidth = 0;
  resultsLength = 0;
  admin:any={
    "id": 1,
    "adminFname": "Zia",
    "adminLname": "Uddin",
    "adminStreetname": "Stree1",
    "adminPhoneno": 300000220,
    "aminZipcode": 44000,
    "adminState": "Islamabad",
    "adminCountry": "PK",
    "adminCity": "Islamabad",
    "adminEmail": "zia@gmail.com",
    "adminStreetno": 1,
    "password": "1234",
    "status": 1
};
  loader=LOADER;
  mode='side';
  showFiller = false;
  isAdminVerified=true;
  isUserLogged=false;
  isAuctionListLoading=false;
  auctionbidsLoading=false;
  listOfAllAuctions=[];
  auctionAllBids=[];
  auctionSelected:any;
  todayDate=new Date;
  dialogStatus=1;
  statusList=[];
  categories=[];
  inBidding=new FormControl(false);
  sold=new FormControl(false);
  expired=new FormControl(false);
  payLoad="";
  name="";
  category='';
  sortBY='';
  sortDirection='';
  form:FormGroup;
  sortColumns=[{name:"Name",value:"Prod_Name"},{name:"Category",value:"Prod_Cat_ID"},
              {name:"Expiry Date",value:"Auc_Close_Date"},{name:"Price",value:"Prod_Start_Bid_Amount"}]
  constructor(
    private dialog: MatDialog,
    private title: Title,
    private meta: Meta,
    private storageService: StorageService,
    private auctionService: AucctionService,
    private errorsService: ErrorsService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.payLoad="?status="+this.statusList+"&prodName="+this.name+"&prodCatId="+this.category
    +"&sortyBy="+this.sortBY+"&sortDirection="+this.sortDirection;
    this.innerWidth = window.innerWidth;
    this.title.setTitle("Admin Dashboard");
    this.metadataTags();
    //this.getCurrenSignedIntAdmin();
    this.getAllAuctionList();
    this.loadCategories();
    this.createForm();
  }
  getAuctionStatus(code){
    return auctionStatus(code);
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
  getCurrenSignedIntAdmin(){
    var storedValue=this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
    if(storedValue && storedValue?.id && storedValue?.userFname && storedValue?.userLname){
      console.log('storedValue',storedValue);
      this.isAdminVerified=false;
      this.isUserLogged=true;
      return;
    }
   
    else{
        this.isUserLogged=false; 
        this.openDialog();
    }
  }

  clearFilters(){
      this.category='';
      this.sortBY='';
      this.sortDirection='';
      this.statusList=[];
      this.inBidding.setValue(false);
      this.sold.setValue(false);
      this.expired.setValue(false);
      this.payLoad="";
      this.name="";
      this.getAllAuctionList();
  }
  hasFilterData():boolean{
    return (this.statusList.length>0 || this.name || this.category 
      || this.sortBY|| this.sortDirection )?true:false;
  }
  getAllBidsForAuction(auction){
    if(!auction?.ID){
      alert(ERROR_MESSAGE)
      return;
    }
    if(auction?.bidCount<1){
      this.errorsService.showSwalToastMessage('info','No Bids yet submitted','top',4000);
      return
    }
    //if repeated the selection
   if(this.auctionSelected?.ID && auction?.ID==this.auctionSelected?.ID){
    this.showAllBidsDialog(auction);
    return;
   }
   this.auctionSelected=auction;
    this.auctionbidsLoading=true;
    let params="?auctionId="+auction?.ID;
    this.auctionService.getAllBidsAgainstAnAuction(params).subscribe((response) => {
      console.log('getAllBidsForAuction. response in Home', response);
      this.auctionbidsLoading=false;
      if (response && response['rows'] && response['rows']?.length>0) {
       this.auctionAllBids=response['rows'];
       this.showAllBidsDialog(auction);
       console.log('getAllBidsForAuction. auctionAllBids.response in Home details', this.auctionAllBids);
      }

    },
      (error) => {
        this.auctionbidsLoading=false;
        this.errorsService.showSwalToastMessage('info','No Bids yet submitted','top',4000)
        console.log('getAllBidsForAuction. error in Home', error);
      }
    );
  }
  showAllBidsDialog(auc): void {
    let widthDialog = '99%';
    if (this.innerWidth >= SMALL_SCREEN_SIZE) {
      widthDialog = '500px';
    }
      const openAllBidsDialog = this.dialog.open(AuctionAllBidsDisplayDialogComponent, {
      width: widthDialog,
      data: {
        auctionAllBidsList:this.auctionAllBids,
        auction:auc 
       },
      enterAnimationDuration: '400ms',
      exitAnimationDuration: "700ms",
      disableClose: true
    });
    openAllBidsDialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
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
  updateSellerAuctionStatus(auction) {
    if(!auction || !auction.ID){
      alert('Auction details are null');
      return;
    }
     // prodName: auction?.Prod_Name,
      // sellerId: auction?.Seller_ID,
      // aucCloseDate: auction?.Auc_Close_Date,
      // aucStartDate: auction?.Auc_Start_Date,
      // aucReservePrice: auction?.Auc_Reserve_Price,
      // prodStartBidAmount: auction?.Prod_Start_Bid_Amount,
      // prodCatId: auction?.Prod_Cat_ID,
    let payLoad = {
      id: auction?.ID,
      status: SELLER_AUCTION_STATUS.AUCTION_DELETED_BY_SELLER_STATUS
    };
    auction!.status = SELLER_AUCTION_STATUS.AUCTION_DELETED_BY_SELLER_STATUS;
    console.log('updateSellerAuctionStatus admin, payload',payLoad);
    this.auctionService.save(payLoad).subscribe((response) => {
      console.log('admin: updateSellerAuctionStatus. response:', response);
      if (response && response['success']) {
        console.log('admin: updateSellerAuctionStatus inside if response ', response);
        this.errorsService.showSwalToastMessage('success',
        'Auction item deleted from list', 'top');
      }
    },
      (error) => {
        this.errorsService.showSwalToastMessage('error',
        'Error occurred while deleting the auction. Please try later', 'top');
        console.log('admin: updateSellerAuctionStatus error:', error);
      });
  }
  createForm(){
    this.form=new FormGroup({
      status:new FormControl(''),
      prodName:new FormControl(''),
      prodCatId:new FormControl(''),
      sortyBy:new FormControl(''),
      sortDirection:new FormControl(''),
    });
  }
  getAuctions(status,value){
    if(value.checked==true){
      this.statusList.push(status);
    }else{
      const index = this.statusList.indexOf(status);
      if (index > -1) { // only splice array when item is found
        this.statusList.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
    console.log('getAuctions statusList', this.statusList);
    this.getAllAuctionList();
  }
  search(value){
    console.log('search value',value);
    this.getAllAuctionList();
  }
  onSelectChange(event){
    console.log('onSelectChange event',event);
    this.getAllAuctionList();
  }
  onSelectSortChange(event){
    console.log('onSelectSortChange event',event);
    this.getAllAuctionList();
  } 
  onSelectSortDirectionChange(event){
    console.log('onSelectSortDirectionChange event',event);
    this.getAllAuctionList();
  }
  getAllAuctionList() {
    this.payLoad="?status="+this.statusList+"&prodName="+this.name+"&prodCatId="+this.category
    +"&sortyBy="+this.sortBY+"&sortDirection="+this.sortDirection;

    this.isAuctionListLoading = true;
    console.log('getAllAuctionList payLoad', this.payLoad);
    let payLoad = '?admin=treu';
    for (let key in this.form?.value) {
      payLoad = payLoad + '&' + key + '=' + this.form?.value[key];
    }
    console.log('admin createForm paramsDy: ',payLoad)
    var statusesList = [
      SELLER_AUCTION_STATUS.AUCTION_NEW_CREATED_AND_IN_BIDDING_STATUS,
      SELLER_AUCTION_STATUS.AUCTION_BID_APPROVED_AND_BUYER_HAS_NOT_PAID_STATUS];
    var todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
    var setStatus=SELLER_AUCTION_STATUS.AUCTION_EXPIRED_STATUS;
    var moreParams="&admin=1&statuses="+statusesList+ "&todayDate=" + todayDate+
    "&setStatus="+setStatus;
    this.auctionService.getSaleHisoty(this.payLoad+moreParams).subscribe((response) => {
      console.log('getAllAuctionList. response in admin', response);
      this.isAuctionListLoading = false;
        this.resultsLength = response['rows']?.length;
        this.listOfAllAuctions=response['rows'];
        console.log('getAllAuctionList. inside if', this.listOfAllAuctions);
    },
      (error) => {
        this.isAuctionListLoading = false;
        console.log('getAllAuctionList. error in Home', error);
        this.errorsService.emitErrorMessage(ERROR_MESSAGE);
      }
    );
  }
  @HostListener('window:resize', ['$event'])
	onResize(event) {
		this.innerWidth = window.innerWidth;
	}
  openDialog(): void {
    this.dialogStatus=0;
    let widthDialog = '99%';
    if (this.innerWidth >= SMALL_SCREEN_SIZE) {
      widthDialog = '300px';
    }
    const adminLoginDialog = this.dialog.open(AdminLoginModalComponent, {
      width: widthDialog,
      data: { username: "", password: "" },
      enterAnimationDuration: '300ms',
      exitAnimationDuration: "400ms",
      disableClose:true
    });
    adminLoginDialog.afterClosed().subscribe((result:any) => {
      console.log('The dialog was closed', result);
      console.log('adminLoginDialog ', adminLoginDialog);
      if(result && result.id){
          this.isAdminVerified=true;
          this.admin=result;
          console.log('rturned admin', this.admin);
          this.getAllAuctionList();
      }
      else{
        this.dialogStatus=1;
      }
    });
  }
}
