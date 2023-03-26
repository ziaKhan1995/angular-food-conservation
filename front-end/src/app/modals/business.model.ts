export class Business {
    id: number;
    address: string;
    timeDiffernceInMillisec: number;
    debtTotalInstallments: number;
    sendReminderEmailDueDebtToCustomer: string;
    parentId: string;
    sendReminderEmailDueDebtBeforeDaysToCustomer: string;
    sendSummaryDaySaleToBusinessOwner: string;
    sendEmailSaleToCustomer: string;
    sendEmailReceiveMoneyToBusinessOwner: string;
    isAutoCalculateBuyPrice: string;
    sendReminderEmailDueDebtBeforeDays: number;
    sendEmailReceiveMoneyToCustomer: string;
    isShowSaleWizardButton: string;
    isShowSaleWizardButtonBool: boolean;
    debtInstallmentScheduleDays: number;
    sendEmailSaleToBusinessOwner: string;
    name: string;
    typeId: string;
    categoryId: string;
    contactNo: string;
    sendSummaryDaySaletime: Date;
    latitude: number
    country: string;
    sendReminderEmailDueDebtToBusinessOwner: string;
    dateFormat: string;
    countryDialingCode: string;
    emailId: string;
    description: string;
    autoCalculateBuyPricePercentage: number;
    isShowAdjustment: string;
    isShowAdjustmentBool: boolean;
    isShowInstallment: string;
    isShowInstallmentBool: boolean;
    countryCode: string;
    currency: string;
    sendSummaryDaysaleToBusinessOwner: string;
    longitude: number;
    sendEmailLoginToBusinessOwner: string;


    createdByDeviceUserId: number;
    updatedByDeviceUserId: number;
    serverCreatedTimestamp: Date;
    serverUpdatedTimestamp: Date;
    localUpdatedTimestamp: Date;
    localUpdatedTimestampStr: string;
    businessId: number;
    applicationId: number;
    updatedByDeviceId: number;
    syncLastChanges: string;
    syncStatus: string;
    syncHasConflict: boolean
    syncConflicts: string;
    status: string;

}


export enum TicketGroupName {
    "Today",
    "Yesterday",
    "Last Week",
    "Older"
}

export enum AttachmentGroupName {
    "IN TRANSIT",
    "ACKNOWLEDGED",
    "IN LAB",
    "IN QC",
    "QC VERIFIED",
    "DISPATCH"
}

