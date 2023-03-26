function CustomerPaymentType(code, text) {
	this.code = code;
	this.text = text;
}

let CUSTOMER_PAYMENT_TYPE = {};


CUSTOMER_PAYMENT_TYPE.ZERO = new CustomerPaymentType(0, 'Zero');
CUSTOMER_PAYMENT_TYPE.GIVEN_TO_CUSTOMER = new CustomerPaymentType(1, 'Given');
CUSTOMER_PAYMENT_TYPE.RECEIVED_FROM_CUSTOMER = new CustomerPaymentType(2, 'Received');

module.exports = CUSTOMER_PAYMENT_TYPE;