import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { endpoints } from '../constants/end-points';
import { HttpService } from "../shared/http.service";

@Injectable({
    providedIn: "root"
})
export class FeebBackService {
    constructor(
        private httpService: HttpService
        ) { }
    saveFeedback(fdb){
        return this.httpService.postWithToken(endpoints.feedback_save, fdb);
    }
    getFeedBack(params) {
        return this.httpService.postNoToken(endpoints.feedback_list_post, params);
    }

}
