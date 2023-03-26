import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { endpoints } from '../constants/end-points';
import { HttpService } from "../shared/http.service";

@Injectable({
    providedIn: "root"
})
export class AucctionService {
    constructor(
        private httpService: HttpService
        ) { }
    save(auction) {
        return this.httpService.postNoToken(endpoints.auction_save, auction);
    }

    getAllAuctions(data:any):any {

        return this.httpService.postNoToken(endpoints.auction_list_post, data);
    }
    auctionUpdateStatuses(param:string):any {
        return this.httpService.getNoTokenNew(endpoints.auction_updateStatuses+param);
    }
    getAllBids(data:any):any {

        return this.httpService.postNoToken(endpoints.bid_list_post, data);
    }

    getAllCategories(data:any):any {

        return this.httpService.postNoToken(endpoints.productcategory_list_post, data);
    }
    getPurchaseHisotyr(param:string):any {

        return this.httpService.getNoTokenNew(endpoints.auction_userPurchaseHistory+param);
    }
    getSaleHisoty(param:string):any {

        return this.httpService.getNoTokenNew(endpoints.auction_saleHistory+ param);
    }

    // getByPostSaleHisoty(param:string,data:any):any {

    //     return this.httpService.postNoToken(endpoints.auction_saleHistory+ param,data);
    // }
    getAllBidsAgainstAnAuction(params:string):any {

        return this.httpService.getNoTokenNew(endpoints.auction_auctionAllBids+ params);
    }
    

}
