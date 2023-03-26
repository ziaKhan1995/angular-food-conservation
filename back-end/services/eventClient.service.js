const { User } = require('../models');
const validator = require('validator');
const { to, TE } = require('../services/util.service');
const jwt = require('jsonwebtoken');
const request = require('request')
const CONFIG = require('../config/config');
const CONTACT_US_TYPE = require('../config/CONTACT_US_TYPE');
const PUSH_NOTIFICATION = require('../config/PUSH_NOTIFICATION');
const SENDING_MEDIA_TYPE = require('../config/SENDING_MEDIA_TYPE');
//const PeopleController = require('../controllers/people.controller');
//const BusinessController = require('../controllers/business.controller');

const printErrorAndsendEmailToAdmin = async (errorInput, entityId, businessId, peopleId) => {

    var errorTrace = '';
    var errorMessage = '';
    if (errorInput) {
        errorTrace = errorInput.stack;
        errorMessage = errorInput.message;
    }

    sendEmailSchedule(PUSH_NOTIFICATION.SERVER_ERROR.actionId, entityId, null,
        CONTACT_US_TYPE.SERVER_EXCEPTION + " " + errorMessage, errorTrace, businessId, peopleId)

}
module.exports.printErrorAndsendEmailToAdmin = printErrorAndsendEmailToAdmin;


const sendEmailSchedule = async (actionId, entityId, email, title, body, businessId, peopleId) => {
    var msgLog = null;
    /////
}
module.exports.sendEmailSchedule = sendEmailSchedule;

const getEmail = async (peopleId) => {
    if (!peopleId) {
        return null;
    }
  // var people = await PeopleController.getById(peopleId);
  //  email = people.email;
    return '';
}

