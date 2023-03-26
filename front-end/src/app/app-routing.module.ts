import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgottPasswordComponent } from './forgott-password/forgott-password.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: "home", pathMatch: "full"
  }
  ,
  {
    path: 'home',
    loadChildren: () => import('./modules/home.module').then(m => m.HomeModule)
  }
  ,
  {
    path: 'profile',
    loadChildren: () => import('./modules/profile.module').then(m => m.ProfileModule)
  }
  ,
  {
    path: 'add-new-auction',
    loadChildren: () => import('./modules/add-new-bid.module').then(m => m.OpenBiddingModule)
  }
  ,
  {
    path: 'contact-us',
    loadChildren: () => import('./modules/contact-us.module').then(m => m.ContactUsModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./modules/about-us.module').then(m => m.AboutUsModule)
  },
  {
    path: 'login',
    component: LoginComponent
  }
  ,
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./modules/setting.module').then(m => m.SettingModule)
  }
  ,
  {
    path: 'register',
    loadChildren: () => import('./modules/register-user.module').then(m => m.RegisterUserModule)
  },
  {
    path: 'forgot-password',
    component: ForgottPasswordComponent
  }
  ,
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent
  }
  ,
  {
    path: "**",
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
