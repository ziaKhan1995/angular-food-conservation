import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
//import { StorageService } from '../shared/storage.service';
import { StorageService } from '../services/storage.service';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';
import { AucctionService } from './../services/auction.service';
import { STORAGE_AUCTIONS } from '../constants/STORAGE-CONSTANT';
//import { format } from 'date-fns';
import { STORAGE_CONSTANTS } from 'src/app/constants/STORAGE-CONSTANT';
import { environment } from 'src/environments/environment';
import { IMAGE_CONSTANTS } from './../constants/IMAGES_CONSTANTS';
import { CONTENTS, SELLER_AUCTION_STATUS } from '../constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { AuctionAllBidsDisplayDialogComponent } from './show-all-bids-dialog/show-all-bids-dialog.component';
import { ErrorsService } from '../services/errors.service';
import { SMALL_SCREEN_SIZE } from 'src/app/constants/constants';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy} from '@angular/core';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { format } from 'date-fns';
import { Router } from '@angular/router';

const CountdownTimeUnits: Array<[string, number]> = [
  ['Y', 1000 * 60 * 60 * 24 * 365], // years
  ['M', 1000 * 60 * 60 * 24 * 30], // months
  ['D', 1000 * 60 * 60 * 24], // days
  ['H', 1000 * 60 * 60], // hours
  ['m', 1000 * 60], // minutes
  ['s', 1000], // seconds
  ['S', 1], // million seconds
];
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.card]': `true`,
    '[class.text-center]': `true`
  }
  
})
export class HomeComponent implements OnInit {
  randomNumber = Math.floor((Math.random() * 100) + 1);
  imagePart1 = environment.baseAPIUrlImage + 'imageByETP/';
  imagePart2 = '/' + IMAGE_CONSTANTS.ENTITY_TYPES.AUCTION + '/' +
    IMAGE_CONSTANTS.MEDIA_PURPOSE_TYPES.PHOTO1 + '?ad=';
  auctionbidsLoading = false;
  auctionAllBids = [];
  auctionSelected: any;
  TimeLeft = 0;
  currentLoggedInUser: any;
  configuration: CountdownConfig;
  isAuctionListLoading = false;
  showAllProductsInBidding = false;
  currentAuctionsList = [];
  finishedAuctionsList = [];
  expiredAuctionsList = [];
  resultsLength = 0;
  innerWidth = 0;
  shimmarStyle = {
    width: '100%',
    height: '100%',
    margin: '0px',
  };
  btnText = "See All currently in auction products";
  date = this.datePipe.transform( new Date(), 'yyyy-MM-dd HH:mm');
  today = new Date();
  constructor(
    private storageService: StorageService,
    private router: Router,
    private title: Title,
    private meta: Meta,
    private auctionService: AucctionService,
    private errorService: ErrorsService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
  ) {
    console.log('11... today date', this.today);
    var tom = this.today.setDate(this.today.getDate() + 1);
    var tomformatted =this.datePipe.transform(tom, 'yyyy-MM-dd HH:mm');
    console.log('11... tommorow formatted date', tomformatted);
    console.log('11... formatted date', this.date);
    this.configuration = {
      //leftTime: this.diffInMinutes,//in seconds
      format: 'HH:MM',
      prettyText: (text) => {
        return text
          .split(':')
          .map((v) => `<span class="item">${v}</span>`)
          .join('');
      },
    };
  }
  
  ngOnInit(): void {
    this.innerWidth = window.innerHeight;
    // var user=this.storageService.get('user');
    // console.log('Registred User',user);
    // this.storageService.remove('user');
    this.title.setTitle("Home");
    this.metadataTags();
    this.getAllAuctionList();
    this.currentLoggedInUser = this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
  }
  getAllAuctionList() {
    this.isAuctionListLoading = true;
    //array to brinf auctions with these statuses
    let status = [
      SELLER_AUCTION_STATUS.AUCTION_NEW_CREATED_AND_IN_BIDDING_STATUS
    ];
    //let params = "?pageSize=1&pageNumber=0"
    var todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
    let params = "?homeComp=1&status=" + status+"&dueDate="+todayDate;
    // let payload = {
    //   "pageable": {
    //     "pageNumber": 0,
    //     "pageSize": 1,
    //     "sortIndex": "id",
    //     "sortDirection": "desc"
    //   }
    // };

    console.log('prefrred params', params);
    this.auctionService.getSaleHisoty(params).subscribe((response) => {
      console.log('getCurrenSignedInUserSaleHistory. response in Profile', response);
      this.isAuctionListLoading = false;
      if (response && response['rows'] && response['rows']?.length > 0) {
        this.sliceArrays(response['rows']);
        this.resultsLength = response['rows']?.length;
      }
      else{
        this.currentAuctionsList = [];
        this.finishedAuctionsList = [];
      }

    },
      (error) => {
        this.isAuctionListLoading = false;
        console.log('getCurrenSignedInUserSaleHistory. error in Home', error);
      }
    );
  }

  sliceArrays(data: any): void {  
    var date2 = new Date(this.date);
    this.currentAuctionsList = [];
    this.finishedAuctionsList = [];
    for (const auction of data) {
      // var auctionCloseDate = this.datePipe.transform(auction?.Auc_Close_Date, 'yyyy-MM-dd HH:mm');
      // var date1 = new Date(auctionCloseDate);
      // if (date2.getTime() > date1.getTime()) {
      //   continue;
      // }
      if (auction?.status == SELLER_AUCTION_STATUS.AUCTION_NEW_CREATED_AND_IN_BIDDING_STATUS) {
        this.currentAuctionsList.push(auction);
      }
      if (auction?.status == SELLER_AUCTION_STATUS.AUCTION_SOLD_STATUS) {
        this.finishedAuctionsList.push(auction);
      }
    }
    console.log('sliceArrays. currentAuctionsList', this.currentAuctionsList);
    console.log('sliceArrays. finishedAuctionsList', this.finishedAuctionsList);
  }
  notify = '';
  getRemainingHoursCounter(Auc_Close_Date): CountdownConfig {
    var datee = new Date(Auc_Close_Date);
    var dateddde = new Date();
    var diff = datee.valueOf() - dateddde.valueOf();
    var seconds: number = diff / 1000;
    return {
      leftTime: seconds, notify: [1,5,10,20,30],
      format: "HH:mm:ss",
      formatDate: ({ date, formatStr }) => {
        let duration = Number(date || 0);

        return CountdownTimeUnits.reduce((current, [name, unit]) => {
          if (current.indexOf(name) !== -1) {
            const v = Math.floor(duration / unit);
            duration -= v * unit;
            return current.replace(new RegExp(`${name}+`, 'g'), (match: string) => {
              return v.toString().padStart(match.length, '0');
            });
          }
          return current;
        }, formatStr);
      },
    };
  }
  @HostListener('window:resize', ['$event'])
  event(event) {
    this.innerWidth = window.innerWidth;
  }
  goToAuctionDetails(auction) {
    this.storageService.put(STORAGE_AUCTIONS.LOCAL_STORAGE_AUCTION_KEY_HOME, auction);
    this.router.navigate(['/home/bid-details']);
  }
  countDownEvent(e: CountdownEvent,auction?){
    //console.info('countDownEvent event:', e);
    this.notify = e.action.toUpperCase();
    if (e.action === 'notify') {
      this.notify += ` - ${e.left} ms`;
      if(e.left<=5000){
        let index = this.currentAuctionsList.findIndex(d => d.ID === auction?.ID); //find index in your array
        console.log('index==',index);
        if (index > -1) {
          console.log('remaving at',index);
          this.currentAuctionsList.splice(index, 1);//remove element from array
        }
      }
      console.log('Notify', e);
    }
    
  }
  
  handleEvent(event) {
    console.info('Event counter:', event);
    this.TimeLeft = event?.left / 1000;
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
  showMore() {
    this.showAllProductsInBidding = !this.showAllProductsInBidding;
    if (this.showAllProductsInBidding) {
      this.btnText = "see less products...";
    }
    else {
      this.btnText = "See All the currently in Biddings products";
    }
  }
  getAllBidsForAuction(auction) {
    this.auctionSelected = auction;
    this.auctionbidsLoading = true;
    let params = "?auctionId=" + auction?.ID;
    this.auctionService.getAllBidsAgainstAnAuction(params).subscribe((response) => {
      console.log('getAllBidsForAuction. response in Home', response);
      this.auctionbidsLoading = false;
      if (response && response['rows'] && response['rows']?.length > 0) {
        this.auctionAllBids = response['rows'];
        this.showAllBidsDialog();
        auction!.bidCount= this.auctionAllBids?.length;
        console.log('getAllBidsForAuction. auctionAllBids.response in Home details', this.auctionAllBids);
      }
      else{
          this.errorService.showSwalToastMessage('info', 'No Bids yet submitted', 'top', 4000);
          return;
      }

    },
      (error) => {
        this.auctionbidsLoading = false;
        this.errorService.showSwalToastMessage('info', 'No Bids yet submitted', 'top', 4000)
        console.log('getAllBidsForAuction. error in Home', error);
      }
    );
  }
  showAllBidsDialog(): void {
    let widthDialog = '99%';
    if (this.innerWidth >= SMALL_SCREEN_SIZE) {
      widthDialog = '500px';
    }
    const openAllBidsDialog = this.dialog.open(AuctionAllBidsDisplayDialogComponent, {
      width: widthDialog,
      data: {
        auctionAllBidsList: this.auctionAllBids,
        loggedInUser:this.currentLoggedInUser
      },
      enterAnimationDuration: '400ms',
      exitAnimationDuration: "700ms",
      disableClose: true
    });
    openAllBidsDialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

}
