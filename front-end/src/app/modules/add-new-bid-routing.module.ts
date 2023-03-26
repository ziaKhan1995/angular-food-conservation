import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdNewBidBiddingComponent } from '../add-new-auction/add-new-bid.component';

const routes: Routes = [
  {
    path:'',
    component:AdNewBidBiddingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenBiddingRoutingModule { }
