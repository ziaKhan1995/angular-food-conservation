export class Account {
    constructor(
        public id: number,
        public version: string,
        public email: string,
        public name: string,
        public expiry: number,
        public fullName: string,
        public token: string,
        // public silentLogin: boolean,
        public businessId: number,
        public companyId: number,
        public companyName: string,
        public businessUnitId: number,
        public businessUnitName: string,
        public roleId: number

    ) { }
}
