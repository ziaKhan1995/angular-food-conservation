const { People } = require('../models');
const validator = require('validator');
const { to, TE } = require('../services/util.service');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');
const utilService = require('../services/util.service');
const { Op } = require('sequelize')

const getUniqueKeyFromBody = function (body) {// this is so they can send in 3 options unique_key, email, or phone and it will work

    // from 
    let data = body;
    if (body.data) {
        data = body.data
    }
    let unique_key = data.unique_key;
    if (typeof unique_key === 'undefined') {
        if (typeof data.name != 'undefined') {
            unique_key = data.name
        } else if (typeof data.phone != 'undefined') {
            unique_key = data.phone
        } else if (typeof data.email != 'undefined') {
            unique_key = data.email
        } else {
            unique_key = null;
        }
    }

    return unique_key;
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const createUser = async (userInfo) => {
    let unique_key, auth_info, err;

    auth_info = {};
    auth_info.status = 'create';

    unique_key = getUniqueKeyFromBody(userInfo);
    if (!unique_key) utilService.TE('An email or phone number was not entered.');

    if (validator.isEmail(unique_key)) {
        auth_info.method = 'email';
        userInfo.email = unique_key;

        [err, user] = await to(People.create(userInfo));
        if (err) utilService.TE('user already exists with that email');

        return user;

    } else if (validator.isMobilePhone(unique_key, 'any')) {//checks if only phone number was sent
        auth_info.method = 'phone';
        userInfo.phone = unique_key;

        [err, user] = await utilService.to(People.create(userInfo));
        if (err) utilService.TE('user already exists with that phone number');

        return user;
    } else {
        utilService.TE('A valid email or phone number was not entered.');
    }
}
module.exports.createUser = createUser;

const authUser = async function (userInfo) {//returns token
    let unique_key;
    let auth_info = {};
    auth_info.status = 'login';

    var sortIndex = 'id';
    var sortDirection = 'DESC';
    unique_key = getUniqueKeyFromBody(userInfo);

    if (!unique_key) utilService.TE('Please enter an email or phone number to login');


    if (!userInfo.apppassword) utilService.TE('Please enter a password to login');

    console.log('unique_key::' + unique_key);
    let user;
    if (userInfo.name) {
        auth_info.method = 'name';
        var whereClause = {};
        whereClause['name'] = unique_key;
        whereClause['businessId'] = { [Op.ne]: null };
        //ignore deleted
        whereClause['status'] = { [Op.not]: '3' };

        [err, user] = await utilService.to(People.findOne({ where: whereClause, order: [[sortIndex, sortDirection]] }));
        if (err) utilService.TE(err.message);
        // console.log('user>>>>>>>>>', user);

        if (!user) {
            var whereClause = {};
            whereClause['email'] = unique_key;
            whereClause['businessId'] = { [Op.ne]: null };
            //ignore deleted
            whereClause['status'] = { [Op.not]: '3' };

            [err, user] = await utilService.to(People.findOne({ where: whereClause, order: [[sortIndex, sortDirection]] }));
            if (err) utilService.TE(err.message);
        }
        if (!user) {
            var whereClause = {};
            whereClause['phone_number'] = unique_key;
            whereClause['businessId'] = { [Op.ne]: null };
            //ignore deleted
            whereClause['status'] = { [Op.not]: '3' };

            [err, user] = await utilService.to(People.findOne({ where: whereClause, order: [[sortIndex, sortDirection]] }));
            if (err) utilService.TE(err.message);
        }


    } else if (validator.isEmail(unique_key)) {
        auth_info.method = 'email';

        [err, user] = await utilService.to(People.findOne({ where: { email: unique_key } }));
        if (err) utilService.TE(err.message);

    } else if (validator.isMobilePhone(unique_key, 'any')) {//checks if only phone number was sent
        auth_info.method = 'phone';

        [err, user] = await utilService.to(People.findOne({ where: { phone: unique_key } }));
        if (err) utilService.TE(err.message);

    } else {
        utilService.TE('A valid email or phone number was not entered');
    }

    if (!user) utilService.TE('Not registered');
    // console.info('user:', user);

    [err, user] = await utilService.to(user.comparePassword(userInfo.apppassword));

    if (err) utilService.TE(err.message);
    user['apppassword'] = null;
    return user;

}
module.exports.authUser = authUser;

const isSuperAdmin = async function (jwtToken) {
    jwtToken = jwtToken.split(' ')[1];
    var jwtDecoded = jwt.verify(jwtToken, CONFIG.jwt_encryption);
    var roleId = jwtDecoded.role_id;

    console.info("roleId=" + roleId);

    if (CONFIG.super_admin_roleId == roleId) {
        return true;
    }
    return false;

}
module.exports.isSuperAdmin = isSuperAdmin;

const getUserId = async function (jwtToken) {
    jwtToken = jwtToken.split(' ')[1];
    var jwtDecoded = jwt.verify(jwtToken, CONFIG.jwt_encryption);
    var user_id = jwtDecoded.user_id;

    console.info("user_id=" + user_id);

    return user_id;

}
module.exports.getUserId = getUserId;