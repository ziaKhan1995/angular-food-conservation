import { Component, OnInit } from '@angular/core';
import { NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { STORAGE_CONSTANTS } from './constants/STORAGE-CONSTANT';
import { StorageService } from './services/storage.service';
import { environment } from 'src/environments/environment';
import { IMAGE_CONSTANTS } from 'src/app/constants/IMAGES_CONSTANTS';
import { DEFAULT_USER_IMAGE, LOADER, DEFAULT_IMAGE } from 'src/app/constants/constants';

const defaultColor = '#3f51b5';
const hightLightColor = 'cornflowerblue';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  randomNumber = Math.floor((Math.random() * 100) + 1);
  imagePart1 = environment.baseAPIUrlImage + 'imageByETP/';
  imagePart2 = '/' + IMAGE_CONSTANTS.ENTITY_TYPES.USER + '/' +
    IMAGE_CONSTANTS.MEDIA_PURPOSE_TYPES.PROFILE + '?ad=';
  imageSrc=DEFAULT_USER_IMAGE;
  defaultImage=LOADER;
  cameraIcon=DEFAULT_USER_IMAGE;
  isUserLoggedIn=false;
  loggenUserName="";
  colorHome: string = defaultColor;
  colorProfile: string = defaultColor;
  colorBidding: string = defaultColor;
  colorContactUs: string = defaultColor;
  colorAboutUs: string = defaultColor;
  colorAdmin: string = defaultColor;
  colorLogin: string = defaultColor;
  colorSetting: string = defaultColor;
  public isShowingRouteLoadIndicator: boolean=false;
  title = 'FCAndWR';  pageTitle = '';
  isSticky: boolean = true;
  selectedMenu = '';
  logedInUSerAccount:any;
  url='';
  constructor(
    private router: Router,
    private storageService: StorageService,
  ){
    router.events.subscribe((val) => {
      this.isUserLoggedIn=false;
      this.getCurrentSignedIntUser();
      this.isShowingRouteLoadIndicator=false;
      var asyncLoadCount=0;
      if (val instanceof NavigationEnd) {
        this.selectedMenu = val.url;
        this.colorHome = defaultColor;
        this.colorProfile = defaultColor;
        this.colorBidding = defaultColor;
        this.colorContactUs = defaultColor;
        this.colorAboutUs = defaultColor;
        this.colorAdmin = defaultColor;
        this.colorLogin = defaultColor;
        this.colorSetting = defaultColor;
        console.log('value....', val.url);
        this.setSelectedMenu(val.url);
        this.url=val.url;
      }
      if ( val instanceof RouteConfigLoadStart ) {
        asyncLoadCount++;
        this.isShowingRouteLoadIndicator=true;
      } 
      else if ( val instanceof RouteConfigLoadEnd ) {
        asyncLoadCount--;
        this.isShowingRouteLoadIndicator=false;
      }
      //this.isShowingRouteLoadIndicator = !! asyncLoadCount;
    });
  }
ngOnInit(){

}
newLogin(){
  this.storageService.remove(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
 this.storageService.remove(STORAGE_CONSTANTS.LOCAL_STORAGE_TOKEN_KEY);
  console.log('key1',this.storageService.remove(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY));
  console.log('key2',this.storageService.remove(STORAGE_CONSTANTS.LOCAL_STORAGE_TOKEN_KEY));
  this.router.navigate(['/login']);
}
getCurrentSignedIntUser():boolean{
  var user=this.storageService.get(STORAGE_CONSTANTS.LOCAL_STORAGE_ACCOUNT_KEY);
  if(user && user?.id){
    this.logedInUSerAccount=user;
    this.isUserLoggedIn=true;
    this.loggenUserName=user.userFname;
    this.imageSrc=this.imagePart1+user?.id+this.imagePart2+this.randomNumber;
  }
  else{
    this.loggenUserName="";
      this.isUserLoggedIn=false;
      this.imageSrc=DEFAULT_USER_IMAGE;
  }
  return true;
}
gotoHome(){
  var link=["/home"];
  this.router.navigate(link);
}
setSelectedMenu(url:string) {
  if (!url) {
      return;
  }
  if (url === '/register') {
    this.pageTitle = 'Register';
  }
  if (url === '/home' || url === '/' || url==='/home/bid-details') {
    this.colorHome = hightLightColor;
    if(url.includes('/bid-details')){
      this.pageTitle="Home / bid-details";
    }
    else{
      this.pageTitle="Home";
    }
    return;
  }

  if (url === '/profile' || url=="/profile/checkout") {
      this.colorProfile = hightLightColor;
      this.pageTitle='Profile';
      return;
  }
  if (url === '/add-new-auction') {
      this.colorBidding = hightLightColor;
      this.pageTitle='Add New Auction';
      return;
  }
  if (url === '/contact' || url==='/contact-us') {
      this.colorContactUs = hightLightColor;
      this.pageTitle='Contact us';
      return;
  }
  if (url === '/about' || url==='/about-us'){
      this.colorAboutUs = hightLightColor;
      this.pageTitle='About us';
      return;
  }
  if (url === '/admin') {
      this.colorAdmin = hightLightColor;
      this.pageTitle='Admin Site';
      return;
  }
  if (url === '/login') {
      this.colorLogin = hightLightColor;
      this.pageTitle='Login';
      return;
  }
   if (url === '/setting') {
      this.colorSetting = hightLightColor;
      this.pageTitle='Setting';
      return;
  }
}
scroll(el: HTMLElement) {
  document.body.scrollTop = 0;
}
goToTop(val:any){
  console.log('goto top',val);
  window.scroll({
      top: 0,
      left:0,
      behavior: 'smooth'
    });
}

}
