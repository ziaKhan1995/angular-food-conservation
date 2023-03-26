import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SharedModule } from './modules/shared.module';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ForgottPasswordComponent } from './forgott-password/forgott-password.component';
import { DatePipe} from '@angular/common';
import { WebcameraComponent } from './shared/webcamera/webcamera.component';
import { UserService } from './services/user.service';
import { BusinessService } from './services/business.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AdminService } from './services/admin-service.service';
import { AucctionService } from './services/auction.service';
import { BidService } from './services/bid.service';
import { FeebBackService } from './services/feedback.service';
import { YesNoDialogComponent } from './shared/yes-no-dialog/yes-no-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterComponent,
    HeaderComponent,
    PageNotFoundComponent,
    TermsAndConditionsComponent,
    ForgottPasswordComponent,
    WebcameraComponent,
 YesNoDialogComponent 
  ],
  imports: [
BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,    
    SharedModule
  ],
  exports: [FlexLayoutModule,

  ],
  providers: [
    DatePipe,
    UserService,
    BusinessService,
    JwtHelperService,
    AdminService,
    AucctionService,
    BidService,
    FeebBackService
  ],
  bootstrap: 
  [
    AppComponent, 
  ]
})
export class AppModule { }
