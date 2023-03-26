import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './../setting/setting.component';

@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
  SharedModule,
    SettingRoutingModule
  ],
  exports: [

  ],
  providers: [
  ],
  bootstrap: [
  ]
})
export class SettingModule { }
