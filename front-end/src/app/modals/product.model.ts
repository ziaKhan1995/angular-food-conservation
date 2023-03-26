import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class Product {
    public id: number;
    public type: string;
    public categoryObj: any;
    public companyObj: any;
    public unitObj: any;

    public display: string;
    public taxcategoryid: string;
    public attributesetId: string;
    public iscom: boolean;
    public lastBuyPrice: number;
    public textTip: string;
    public isscale: boolean;
    public codeType: string;
    public unit: string;
    public isservice: boolean;
    public lastSalePrice: number;
    public name: string;
    public properties: string;
    public stockCost: number;
    public printkb: boolean;
    public isvprice: boolean;
    public category: string;
    public code: string;
    public supplierId: string;
    public priceSell: number;
    public priceBuy: number;
    public stockVolume: number;
    public iskitchen: boolean;
    public taxcat: string;
    public mediaId: string;
    public reference: string;
    public photoProfileId: string;
    public warranty: boolean;
    public categoryid: string;
    public isverpatrib: boolean;


    public createdByDeviceUserId: number;
    public updatedByDeviceUserId: number;
    public serverCreatedTimestamp: Date;
    public serverUpdatedTimestamp: Date;
    public businessId: number;
    public applicationId: number;
    public updatedByDeviceId: number;
    public syncLastChanges: string;
    public syncStatus: string;
    public syncHasConflict: boolean;
    public syncConflicts: string;
    public status: string;

    public companyId: number;
    public companyName: string;
    public editable: boolean;
    public edited: boolean=false;
    public units:number=0;

    constructor(
    ) { }
}
