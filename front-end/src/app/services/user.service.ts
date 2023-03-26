import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { endpoints } from '../constants/end-points';
import { HttpService } from "../shared/http.service";

@Injectable({
    providedIn: "root"
})
export class UserService {
    constructor(
        private httpService: HttpService
        ) { }


    // getUsers(params?: string) {
    //     return this.httpService.getWithToken(endpoints.customer_CustomFields
    //          + params
    //     );
    // }
    getUsers(data:any):any {

        return this.httpService.postNoToken(endpoints.users_list_post, data);
    }

    save(user) {
        return this.httpService.postNoToken(endpoints.user_save, user);
    }
    authenticateLogin(user) {
        return this.httpService.postNoToken(endpoints.users_login, user);
    }
    verifyUser(user) {
        return this.httpService.postNoToken(endpoints.users_verify, user);
    }

}
