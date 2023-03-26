import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { AdminComponent } from '../admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLoginModalComponent } from '../admin/admin-login-modal/admin-login-modal.component';
import { AuctionAllBidsDisplayDialogComponent } from '../admin/show-all-bids-dialog/show-all-bids-dialog.component';


@NgModule({
  declarations: [
    AdminComponent,
    AdminLoginModalComponent,
    AuctionAllBidsDisplayDialogComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  exports: [

  ],
  providers: [
  ],
  bootstrap: [
  ]
})
export class AdminModule { }
