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
const ticketSaleEmail = require('../services/ticketSaleEmail.service');
const eventClientService = require('../services/eventClient.service');
const ticketPaymentFromCustomerEmail = require('../services/ticketPaymentFromCustomerEmail.service');
var dateFormat = require('dateformat');


const getBusinessOwnerTicketEmailTemplate = async (ticket) => {
    if (ticket.tickettype != null && ticket.tickettype == TICKET_TYPE.RECEIPT_NORMAL.code) {
        return await ticketSaleEmail.getNewSaleTickeEmailTemplate(ticket);
    } else if (ticket.tickettype != null && ticket.tickettype == TICKET_TYPE.RECEIPT_FROM_CUSTOMER.code) {
        return await ticketPaymentFromCustomerEmail.getReceivePaymentEmailToBusinessOwner(ticket)
    }

}
module.exports.getBusinessOwnerTicketEmailTemplate = getBusinessOwnerTicketEmailTemplate;

const sendEmailToBusinessOwner = async (ticket) => {
    console.info('sendEmailToBusinessOwner.ticket',ticket);
    if (!ticket) {
          console.info('**********!ticket=TRUE *sendEmailToBusinessOwner.ticket.tickettype='+ticket.tickettype);
        return;
    }
     console.info('***********sendEmailToBusinessOwner.ticket.tickettype='+ticket.tickettype);
    if (ticket.tickettype != null && ticket.tickettype === TICKET_TYPE.RECEIPT_NORMAL.code) {
        //  actionId, entityId, email, title, body, businessId, peopleId
        eventClientService.sendEmailSchedule(PUSH_NOTIFICATION.SEND_EMAIL_SALE_TO_BUSINESS_OWNER.actionId,
            ticket.id, null,
            PUSH_NOTIFICATION.SEND_EMAIL_SALE_TO_BUSINESS_OWNER.title,null,
            ticket.businessId, ticket.person);

    } else if (ticket.tickettype != null && ticket.tickettype === TICKET_TYPE.RECEIPT_FROM_CUSTOMER.code) {
        eventClientService.sendEmailSchedule(PUSH_NOTIFICATION.SEND_EMAIL_RECEVIE_MONEY_TO_BUSINESS_OWNER.actionId,
            ticket.id, null,
            PUSH_NOTIFICATION.SEND_EMAIL_RECEVIE_MONEY_TO_BUSINESS_OWNER.title,null,
            ticket.businessId, ticket.person);
    }

}

module.exports.sendEmailToBusinessOwner = sendEmailToBusinessOwner;



