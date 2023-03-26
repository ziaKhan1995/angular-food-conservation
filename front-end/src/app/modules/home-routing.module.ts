import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BidDetailAndBiddingComponent } from '../home/detail-bid-page/detail-bid-page.component';
import { HomeComponent } from '../home/home.component';


const routes: Routes = [
  {
    path:'',
    component:HomeComponent
  },
  {
    path:'bid-details',
    component:BidDetailAndBiddingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
