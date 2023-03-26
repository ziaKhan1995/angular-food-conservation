import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { HttpService } from '../shared/http.service';
import { environment } from 'src/environments/environment';
import { Business } from "../modals/business.model";

const COMPANY = "business/get";
@Injectable({
    providedIn: "root"
})
export class BusinessService {
    constructor(
        private httpService: HttpService) { }

    getBusiness(id: number) {
        //return this.httpService.getWithToken(endpoints.business_get + '?id=' + id
        //);
        // var url = environment.apiBaseUrl + endpoints.business_get;
        // return this.httpService.getNoToken(url, 'id=' + id);
    }

    getBusinessStored(): Business {
        // const json = JSON.parse(localStorage.getItem(CONSTANTS.LOCAL_STORAGE_BUSINESS_KEY));
         var storedBusiness;
        // if (json && json.business) {
        //     storedBusiness = json.business;
        // }
        return storedBusiness;
    }

    // setBusinessStored(business: Business) {
    //     localStorage.setItem(CONSTANTS.LOCAL_STORAGE_BUSINESS_KEY, JSON.stringify({ business: business, sessionExpired: false }));
    // }
    // public _removeBusinessStored() {
    //     localStorage.setItem(CONSTANTS.LOCAL_STORAGE_BUSINESS_KEY, null);
    // }

    save(business: Business, params?) {
        if (!params) {
            params = '';
        }
        //return this.httpService.postWithToken(endpoints.business_save + params, business);

    }

    addNew(newBusinessData: any) {
        //return this.httpService.postNoToken(endpoints.business_new, newBusinessData);

    }
    verifyEmail(data: any) {
        //return this.httpService.postNoToken(endpoints.people_verify_email_code, data);
    }

    resendEmail(data: any) {
        //return this.httpService.postNoToken(endpoints.people_verify_resend_email_code, data);
    }



    changeYtoTrue(business: Business) {
        business!.isShowSaleWizardButtonBool = business?.isShowSaleWizardButton == null || business?.isShowSaleWizardButton === 'N' ? false : true;
        business!.isShowInstallmentBool = business?.isShowInstallment == null || business?.isShowInstallment === 'N' ? false : true;
        business!.isShowAdjustmentBool = business?.isShowAdjustment == null || business?.isShowAdjustment === 'N' ? false : true;

        return business;
    }
    changeTrueY(business: Business) {
        business!.isShowSaleWizardButton = business?.isShowSaleWizardButtonBool == null || business?.isShowSaleWizardButtonBool === false ? 'N' : 'Y';
        business!.isShowInstallment = business?.isShowInstallmentBool == null || business?.isShowInstallmentBool === false ? 'N' : 'Y';
        business!.isShowAdjustment = business?.isShowAdjustmentBool == null || business?.isShowAdjustmentBool === false ? 'N' : 'Y';

        return business;
    }
     getVistorLocation() {
        return this.httpService.getThirdPartyUrl('https://ipinfo.io/?token=3a6deb62fa6388&dontShowLoader=true&dontShowErrorDialog=true');
    }
}
