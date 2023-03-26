// import { TicketGroupName } from "./ticket.model";

export class Customer {
    public id: number;
    public referenceCustomerObj: any;
    public card: string;
    public address: string;
    public address2: string;
    public photoNicFrontId: string;
    public referenceCustomerCount: number;
    public debtInstallment: number;
    public name: string;
    public postal: string;
    public country: string;
    public notes: string;
    public firstname: string;
    public trustRating: number;
    public city: string;
    public curdate: Date;
    public searchkey: string;
    public debtInstallmentDueAmount: number;

    public phone2: string;
    public messageSendingMediaId: string;


    public photoNicBackId: string;
    public taxid: string;
    public photoCarId: string;
    public fax: string;
    public visible: boolean;

    public maxdebt: number;
    public taxcategory: string;
    public photoBusinessCardId: string;
    public referenceCustomerId: string;
    public debtInstallmentDueDate: Date;
    public debtTotalInstallments: number;
    public lastTransactionComments: string;
    public lastname: string;
    public debtInstallmentScheduleDays: number;
    public phone: string;
    public curdebt: number;
    public referenceCustomerName: string;
    public region: string;
    public photoOtherId: string;
    public saleTransactionDate: Date;
    public type: number;
    public carRegistrationNo: string;
    public photoProfileId: string;
    public email: string;
    public carDetail: string;
    public createdByDeviceUserId: number;
    public updatedByDeviceUserId: number;
    public serverCreatedTimestamp: Date;
    public serverUpdatedTimestamp: Date;
    public localUpdatedTimestamp: Date;
    public businessId: number;
    public applicationId: number;
    public updatedByDeviceId: number;
    public syncLastChanges: string;
    public syncStatus: string;
    public syncHasConflict: boolean;
    public syncConflicts: string;
    public status: string;
    public nic: string;
    public bookNo: string;
    public pageNo: string;
    public editable: boolean;
    public edited: boolean = false;
    public paymentType: number;
    isNotScrollToDetail: boolean;
    isNotRemoveDetail: boolean;

    // ticketGroupName: TicketGroupName;
    constructor(
    ) { }
}
