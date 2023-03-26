function CustomerType(code, text) {
	this.code = code;
	this.text = text;
}

let CUSTOMER_TYPE = {};

CUSTOMER_TYPE.CUSTOMER = new CustomerType(1, 'Customer');
CUSTOMER_TYPE.SUPPLIER = new CustomerType(2, 'Supplier');
CUSTOMER_TYPE.MONEY_PARTY = new CustomerType(3, 'MoneyParty');



module.exports = CUSTOMER_TYPE;