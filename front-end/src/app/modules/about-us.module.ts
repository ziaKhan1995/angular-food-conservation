import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from '../about-us/about-us.component';


@NgModule({
  declarations: [
    AboutUsComponent
  ],
  imports: [
  SharedModule,
    AboutUsRoutingModule
  ],
  exports: [

  ],
  providers: [
  ],
  bootstrap: [
  ]
})
export class AboutUsModule { }
