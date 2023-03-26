import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { ProfileComponent } from '../profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { CheckoutNowComponent } from '../profile/checkout-now/checkout-now.component';
import { BidFeebbackComponent } from '../profile/bid-feedback-dialog/bid-feedback-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxShimmeringLoaderModule } from 'ngx-shimmering-loader';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxStarRatingModule } from 'ngx-star-rating';

@NgModule({
  declarations: [
    ProfileComponent,
    CheckoutNowComponent,
    BidFeebbackComponent
  ],
  imports: [
  NgxStarRatingModule,
  ProfileRoutingModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTooltipModule,
    NgxShimmeringLoaderModule,
    MatInputModule,
    MatFormFieldModule,
    MatRippleModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  exports: [

  ],
  providers: [
  ],
  bootstrap: [
  ]
})
export class ProfileModule { }
