const { User } = require('../models');
const validator = require('validator');
const { to, TE } = require('../services/util.service');
const jwt = require('jsonwebtoken');
const request = require('request')
const CONFIG = require('../config/config');
const CONTACT_US_TYPE = require('../config/CONTACT_US_TYPE');
const EMAIL_TEMPLATE_PURPOSE_TYPES = require('../config/EMAIL_TEMPLATE_PURPOSE_TYPES');
const PUSH_NOTIFICATION = require('../config/PUSH_NOTIFICATION');
const BUSINESS_SETTINGS_DEFAULT = require('../config/BUSINESS_SETTINGS_DEFAULT');
const TICKET_TYPE = require('../config/TICKET_TYPE');

const PeopleController = require('../controllers/people.controller');
const BusinessController = require('../controllers/business.controller');
const ReceiptsController = require('../controllers/receipts.controller');
const CustomersController = require('../controllers/customers.controller');
const TicketlinesController = require('../controllers/ticketlines.controller');
const PaymentsController = require('../controllers/payments.controller');
const EmailTemplatesController = require('../controllers/emailTemplates.controller');
const IncompleteTicketError = require('../services/CustomError');
var dateFormat = require('dateformat');

const getReceivePaymentEmailToBusinessOwner = async (ticket) => {
    var business = await BusinessController.getById(ticket.businessId);
    if (!business) {
        console.info('********businessis null');
        throw new Error('businessis null');
    }
    var receipt = await ReceiptsController.getById(ticket.id);
    if (!receipt) {
        console.info('********receipt null');
        throw new IncompleteTicketError('receipt null');
    }
    var people = await PeopleController.getById(ticket.person);
    // console.log("people: ", people);
    if (!people) {
        console.info('********people null');
        throw new Error('people null');
    }
    // if (ticket.customer) {
    var customer = await CustomersController.getById(ticket.customer);
    if (!customer) {
        console.info('********customer null');
        throw new Error('customer null');
    }

    [count, resultPayments] = await PaymentsController.getPaymentsByTicketId(ticket.id);
    if (!resultPayments || !resultPayments.count) {
        console.info('********no payments found');
        // return 'payments null';
        throw new IncompleteTicketError('payments null');
    }

    var emailTemplates = await EmailTemplatesController.getEmailTemplatesByMediaPurposeId(
        EMAIL_TEMPLATE_PURPOSE_TYPES.EMAIL_RECEIVE_PAYMENT_TO_BUSINESS_OWNER.code);
    if (!emailTemplates) {
        console.info('********template null');
        throw new Error('template null');
    }

    var template = emailTemplates.media.toString();
    // console.info('********template =' + template);
    template = template.replace("$$BusinessName$$", business.name == null ? "N/A" : business.name);
    template = template.replace("$$address$$", business.address == null ? "N/A" : business.address);
    template = template.replace("$$email$$", business.emailId == null ? "N/A" : business.emailId);
    template = template.replace("$$phone$$",
        business.contactNo == null ? "N/A" : business.contactNo);

    template = template.replace("$$receipt$$", ticket.id);

    template = template.replace("$$datetime$$", dateFormat(receipt.datenew));
    template = template.replace("$$savedby$$",
        people.name == null ? people.email : people.name);

    var currency = await BusinessController.findCurrency(business);
    // console.info('currency',currency);
    var customerrow = "";
    var customerdebtrow = "";
    if (customer != null) {
        customerrow = "<tr class='service'> "
            + "<td class='tableitem'><p class='itemtext'><strong>Customer</strong></p></td><td></td>"
            + "<td class='tableitem' ><p class='itemtext'>" + customer.name + ", "
            + customer.phone + "</p></td>" + "</tr>";

        // Formats.setCurrencyPattern(currency);
        var debt = customer.curdebt + ' ' + currency;
        customerdebtrow = "<tr class='service'> "
            + " <td class='tableitem'><p class='itemtext'><strong>Customer debt</strong></p></td><td></td>"
            + "<td class='tableitem'><p class='itemtext'>" + debt + "</p></td>" + " </tr>";
    }
    template = template.replace("$$customerrow$$", customerrow);
    template = template.replace("$$customerdebtrow$$", customerdebtrow);

    var paymentRows = "";
    var totalAmount = 0.0;

    var rowsPayments = resultPayments.rows;
    for (let i = 0; i < resultPayments.count; i++) {
        var payment = rowsPayments[i];
        // console.info('payment',payment);
        totalAmount = totalAmount + payment.total;
        var price = payment.total + ' ' + currency;
        paymentRows = paymentRows + "<tr class='tabletitle'>" + " " + " <td class='Rate'><h2>"
            + payment.payment + "</h2></td><td></td>" + " <td class='payment'><h2>" + price
            + "</h2></td>" + " </tr>";
    }
    template = template.replace("$$paymentsrows$$", paymentRows);
    var totalAmountStr = totalAmount + ' ' + currency;
    template = template.replace("$$totalamount$$", totalAmountStr);

    return template;

}

module.exports.getReceivePaymentEmailToBusinessOwner = getReceivePaymentEmailToBusinessOwner;


