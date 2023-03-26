import { NgModule } from '@angular/core';
import { HomeComponent } from './../home/home.component';
import { BidDetailAndBiddingComponent } from '../home/detail-bid-page/detail-bid-page.component';
import { BiddingOrPurchaseDialogComponent } from '../home/bid-purchase-dialog/bidding-purchase-dialog.component';
import { AuctionAllBidsDisplayDialogComponent } from '../home/show-all-bids-dialog/show-all-bids-dialog.component';
import { HomeRoutingModule } from './home-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxShimmeringLoaderModule } from 'ngx-shimmering-loader';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CountdownModule } from 'ngx-countdown';


@NgModule({
  declarations: [
    HomeComponent,
    BidDetailAndBiddingComponent,
    BiddingOrPurchaseDialogComponent,
    AuctionAllBidsDisplayDialogComponent
  ],
  imports: [
    HomeRoutingModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTooltipModule,
    NgxShimmeringLoaderModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    LazyLoadImageModule,
    MatRippleModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinnerModule,
    CountdownModule
    ],
  exports: [

  ],
  providers: [
  ],
  bootstrap: [
  ]
})
export class HomeModule { }
