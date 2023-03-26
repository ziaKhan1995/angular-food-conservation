import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { RegisterUserComponent } from '../register-user/register-user.component';
import { RegisterUserRoutingModule } from './register-user-routing.module';
import { ErrorsService } from '../services/errors.service';
import { VerifyEmailDialogComponent } from './../register-user/verify-email/verify-email-dialog.component';


@NgModule({
  declarations: [
    RegisterUserComponent,VerifyEmailDialogComponent
  ],
  imports: [
RegisterUserRoutingModule,
    SharedModule
  ],
  exports: [

  ],
  providers: [
    ErrorsService
  ],
  bootstrap: [
  ]
})
export class RegisterUserModule { }
