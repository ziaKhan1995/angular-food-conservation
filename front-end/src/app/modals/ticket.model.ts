export class Ticket {
    public id: string;
    comments: string;
    remoteId: string;
    person: string;
    customer: string;
    ticketType: number;
    ticketid: number;


    createdByDeviceUserId: number;
    updatedByDeviceUserId: number;
    serverCreatedTimestamp: Date;
    serverUpdatedTimestamp: Date;
    localUpdatedTimestamp: Date;
    businessId: number;
    applicationId: number;
    updatedByDeviceId: number;
    syncLastChanges: string;
    syncStatus: string;
    syncHasConflict: boolean
    syncConflicts: string;
    status: string;
    partyName: string;
    dated: Date;
    partyCurdebt: number;
    partyPhone: string;
    sum: number;
    ticketGroupName: TicketGroupName;
    editable: boolean;
    isNotScrollToDetail: boolean
    isNotRemoveDetail: boolean;
}



export interface Sparepart {
    spareId: number;
    spareName: string;
    sparePrice: number;
    currencyCode: string;
}




export enum TicketGroupName {
    "Today",
    "Yesterday",
    "Last Week",
    "Older"
}


