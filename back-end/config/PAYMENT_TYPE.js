function PaymentType(code) {
	this.code = code;
}


let PAYMENT_TYPE = {};

PAYMENT_TYPE.CASH = new PaymentType('cash');
PAYMENT_TYPE.ADJUSTMENT = new PaymentType('adjustment');
PAYMENT_TYPE.DEBTT = new PaymentType('debt');
PAYMENT_TYPE.BALANCE = new PaymentType('balance');
PAYMENT_TYPE.PAYABLE = new PaymentType('payable');
PAYMENT_TYPE.DEBT_PAID = new PaymentType('debtpaid');
PAYMENT_TYPE.PREPAY = new PaymentType('prepay');

module.exports = PAYMENT_TYPE;