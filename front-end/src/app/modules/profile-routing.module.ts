import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutNowComponent } from '../profile/checkout-now/checkout-now.component';
import { ProfileComponent } from '../profile/profile.component';


const routes: Routes = [
  {
    path:'',
    component:ProfileComponent
  },
  {
    path:'checkout',
    component:CheckoutNowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
