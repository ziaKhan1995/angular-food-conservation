import { NgModule } from '@angular/core';
import { OpenBiddingRoutingModule } from './add-new-bid-routing.module';
import { AdNewBidBiddingComponent } from '../add-new-auction/add-new-bid.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AdNewBidBiddingComponent
  ],
  imports: [
OpenBiddingRoutingModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule
  ],
  exports: [

  ],
  providers: [
  ],
  bootstrap: [
  ]
})
export class OpenBiddingModule {

 }
