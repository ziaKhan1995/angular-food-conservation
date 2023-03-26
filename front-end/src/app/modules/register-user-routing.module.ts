import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
  import { RegisterUserComponent } from './../register-user/register-user.component';


const routes: Routes = [
  {
    path:'',
    component:RegisterUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class RegisterUserRoutingModule { }
