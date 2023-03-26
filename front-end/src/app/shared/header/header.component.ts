import { Component, OnInit, Input } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { Router, NavigationEnd } from '@angular/router';
import { STORAGE_CONSTANTS } from 'src/app/constants/STORAGE-CONSTANT';
import { StorageService } from 'src/app/services/storage.service';
const defaultColor = '#3f51b5';
const heighlightColor = 'cornflowerblue';
@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
    isUserLoggedIn=false;
    name="";
    colorHome: string = defaultColor;
    colorProfile: string = defaultColor;
    colorBidding: string = defaultColor;
    colorContactUs: string = defaultColor;
    colorAboutUs: string = defaultColor;
    colorAdmin: string = defaultColor;
    colorLogin: string = defaultColor;
    homeBtnText="Home";
    loggedInUser: any;
    @Input() selectedMenu = '';
    constructor(
        private router: Router,
        private title: Title,
        private meta: Meta,
        private storageService: StorageService,
    ) {
        router.events.subscribe((val) => {
            this.isUserLoggedIn=false;
            this.getCurrentSignedIntUser();
            if (val instanceof NavigationEnd) {
                this.colorHome = defaultColor;
                this.colorProfile = defaultColor;
                this.colorBidding = defaultColor;
                this.colorContactUs = defaultColor;
                this.colorAboutUs = defaultColor;
                this.colorAdmin = defaultColor;
                this.colorLogin = defaultColor;
                console.log('val......>>>>url', val.url);
                this.setSelectedMenu(val.url);

            }
        });
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
          this.isUserLoggedIn=true;
          this.name=user.userFname;
          this.loggedInUser=user;
        }
        else{
            this.isUserLoggedIn=false;
        }
        return true;
      }
    setSelectedMenu(url:string) {
        this.homeBtnText='Home';
        if (!url) {
            return;
        }
        if (url === '/home' || url==='/' || url==='/home/bid-details') {
            this.colorHome = heighlightColor;
            if(url.includes('/bid-details')){
                this.homeBtnText='Home / bid-details';
            }
            else{
                this.homeBtnText='Home';
            }
            return;
        }
        if (url === '/profile' || url=="/profile/checkout") {
            this.colorProfile = heighlightColor;
            return;
        }
        if (url === '/add-new-auction') {
            this.colorBidding = heighlightColor;
            return;
        }
        if (url === '/contact' || url==='/contact-us') {
            this.colorContactUs = heighlightColor;
            return;
        }
        if (url === '/about' || url==='/about-us'){
            this.colorAboutUs = heighlightColor;
            return;
        }
        if (url === '/admin') {
            this.colorAdmin = heighlightColor;
            return;
        }
        if (url === '/login') {
            this.colorLogin = heighlightColor;
            return;
        }
    }
    ngOnInit() {
        console.log('selectedMenu=' + this.selectedMenu);
        this.setSelectedMenu(this.selectedMenu);
        }
}
