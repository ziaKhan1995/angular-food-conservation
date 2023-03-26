import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { endpoints } from '../constants/end-points';
import { HttpService } from "../shared/http.service";

@Injectable({
    providedIn: "root"
})
export class AdminService {
    constructor(
        private httpService: HttpService
        ) { }


    // getAdmins(params?: string) {
    //     return this.httpService.getWithToken(endpoints.customer_CustomFields
    //          + params
    //     );
    // }

    save(admin) {
        return this.httpService.postWithToken(endpoints.user_save, admin);
    }
    authenticateLogin(admin) {
        return this.httpService.postNoToken(endpoints.admin_login, admin);
    }

}
