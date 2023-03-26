import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { endpoints } from '../constants/end-points';
import { HttpService } from "../shared/http.service";

@Injectable({
    providedIn: "root"
})
export class BidService {
    constructor(
        private httpService: HttpService
        ) { }

    save(bid) {
        return this.httpService.postWithToken(endpoints.bid_save, bid);
    }
    getAllBids(params) {
        return this.httpService.postNoToken(endpoints.bid_list_post, params);
    }

}
