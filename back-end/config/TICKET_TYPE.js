function TicketType(code, text) {
	this.code = code;
	this.text = text;
}

let TICKET_TYPE = {};


TICKET_TYPE.RECEIPT_NORMAL = new TicketType(0, 'RECEIPT_NORMA');
TICKET_TYPE.RECEIPT_REFUND = new TicketType(1, 'RECEIPT_REFUND');
TICKET_TYPE.RECEIPT_FROM_CUSTOMER = new TicketType(2, 'RECEIPT_FROM_CUSTOMER');

TICKET_TYPE.RECEIPT_NOSALE = new TicketType(3, 'RECEIPT_NOSALE');
TICKET_TYPE.RECEIPT_PREVIOUS_DEBT = new TicketType(4, 'RECEIPT_PREVIOUS_DEBT');

TICKET_TYPE.RECEIPT_PURCHASE = new TicketType(5, 'Purchase');
TICKET_TYPE.RECEIPT_PAID_TO_SUPPLIER = new TicketType(6, 'Paid');
TICKET_TYPE.RECEIPT_PRODUCT_INITIAL_STOCK = new TicketType(7, 'Initial Stock');
TICKET_TYPE.RECEIPT_PREVIOUS_BALANCE_SUPPLIER = new TicketType(8, 'PreviousBalance');
TICKET_TYPE.EXPENSE = new TicketType(9, 'Expense');
TICKET_TYPE.NET_PROFIT = new TicketType(10, 'Net Profit');
TICKET_TYPE.TOTAL_RECEIVALBE = new TicketType(11, 'Total Receivable');
TICKET_TYPE.TOTAL_PAYVALBE = new TicketType(12, 'Total Payable');
TICKET_TYPE.ORDER = new TicketType(13, 'Order');

TICKET_TYPE.PAID_MONEY = new TicketType(14, 'Given');
TICKET_TYPE.RECEIVED_MONEY = new TicketType(15, 'Received');

module.exports = TICKET_TYPE;