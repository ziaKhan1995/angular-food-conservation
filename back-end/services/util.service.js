const { to } = require('await-to-js');
const pe = require('parse-error');
const utf8 = require('utf8');
//const BusinessController = require('../controllers/business.controller');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');
module.exports.to = async (promise) => {
    let err, res;
    [err, res] = await to(promise);
    if (err) return [pe(err)];

    return [null, res];
};

module.exports.Rto = async (promise) => {
    let err, res;
    [err, res] = await to(promise);
    if (err) return [pe(err)];

    return [null, res];
};

module.exports.ReE = function (res, err, code) {
    console.error('error', err);
    if (typeof err == 'object' && typeof err.message != 'undefined') {
        err = err.message;
    }
    if (err.message) {
        err = err.message;
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json({ success: false, error: err });
};
module.exports.ReSOnUpdatingStatuses = function (res, mesg, code,n) {
    console.log('mesg----', mesg);
    if (typeof mesg == 'object' && typeof mesg.message != 'undefined') {
        mesg = mesg.message;
    }
    if (mesg.message) {
        mesg = mesg.message;
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json({ success: true, message: mesg,affectedRows:n });
};

module.exports.ReS = function (res, data, code) { // Success Web Response
    let send_data = { success: true };

    if (typeof data == 'object') {
        send_data = Object.assign(data, send_data);//merge the objects
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    let resp = res.json(send_data);
    return resp;
};

module.exports.ReSImage = function (res, data) { // Success Web Response
    res.responseType = "arraybuffer";
    res.contentType('image/jpeg');
    res.end(data, 'binary');
};

module.exports.TE = function (err_message, log) { // TE stands for Throw Error
    console.log('err_message::', err_message);
    if (log && log === true) {
        console.error(err_message);
    }

    throw new Error(err_message);
};

function TE1(err_message, log) { // TE stands for Throw Error
    console.log('err_message::', err_message);
    if (log && log === true) {
        console.error(err_message);
    }

    throw new Error(err_message);
};



module.exports.starred = function (str) { // 
    if (!str) {
        return str;
    }
    if (str.length < 7) {
        return str;
    }
    return str[0] + str[1] + str[2] + new Array(str.length - 6).join('*') + str[str.length - 3] + str[str.length - 2] + str[str.length - 1]


    // var result = str.replace(/^(.)(.+)(.)$/, (whole, first, middle, last) => {
    //     return first + new Array(middle.length).fill('*').join('') + last
    // })

    // return result;
};


module.exports.TError = function (err, log) { // TE stands for Throw Error
    if (log && log === true) {
        console.error(err.message);
    }

    throw err;
};

module.exports.encodeUTF8 = encodeUTF8 = function (value) {
    if (!value) {
        return value;
    }
    if (isNumeric(value)) {
        return value;
    }
    if (isNaN(value)) {
        return utf8.encode(value);
    }

    return value;
};

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


module.exports.random6Digits = async function () {
    var len = 6;
    let result = Math.floor(Math.random() * Math.pow(10, len));
    return (result.toString().length < len) ? zeroPad(result, len) : result;
}


function zeroPad(num, numZeros) {
    var n = Math.abs(num);
    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
    var zeroString = Math.pow(10, zeros).toString().substr(1);
    if (num < 0) {
        zeroString = '-' + zeroString;
    }

    return zeroString + n;
}

module.exports.convertUTCDateToLocalDate = async function (dateStr) {
    var date = new Date(dateStr);
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}

module.exports.getTimeDifferenceInMilliSeconds = async function (businessId, localUpdateTimestamp) {
   
    return 0;
}

module.exports.getServeDate = async function (businessId, localUpdateTimestamp) {
    var diff_ms = await this.getTimeDifferenceInMilliSeconds(businessId, localUpdateTimestamp);

    // Calculate the difference in milliseconds
    if (diff_ms) {
        var date2_ms = new Date().getTime();
        var newDateMilliseconds = date2_ms + diff_ms;
        var date2_ms = new Date(newDateMilliseconds);
        return date2_ms;
    }

    return new Date();
}

module.exports.getLocalDate = async function (businessId, serverUpdateTimestamp) {
    var diff_ms = await this.getTimeDifferenceInMilliSeconds(businessId, serverUpdateTimestamp);

    // Calculate the difference in milliseconds
    if (diff_ms) {
        var date2_ms = new Date().getTime();
        var newDateMilliseconds = date2_ms + diff_ms;
        var date2_ms = new Date(newDateMilliseconds);
        return date2_ms;
    }

    return new Date();
}

module.exports.getBusinessId = async function (req) {
    if (!req.headers.authorization) {
        throw new Error("Authentication error");
    }
    var authorization = req.headers.authorization.split(' ')[1];
    var jwtDecoded = jwt.verify(authorization, CONFIG.jwt_encryption);

    var businessId = req.query.businessId;
    if (!businessId && jwtDecoded) {
        businessId = jwtDecoded.b_id;
    }
    if (!businessId) {
        return ReE(res, "Bad request, incomplete: ", 400);
    }
    return businessId;
}

module.exports.getUserId = async function (req) {
    // console.log('req:', req);
    if (!req.headers.authorization) {
        return ReE(res, "Authentication error: ", 403);
    }
    var authorization = req.headers.authorization.split(' ')[1];
    var jwtDecoded = jwt.verify(authorization, CONFIG.jwt_encryption);

    var userId = req.query.userId;
    if (!userId && jwtDecoded) {
        userId = jwtDecoded.user_id;
    }
    if (!userId) {
        return ReE(res, "Bad request, incomplete: ", 400);
    }
    return userId;
}

module.exports.getGuid = async function (businessId, userId) {
    var guid = "";
    if (businessId) {
        guid += businessId;
    }
    if (userId) {
        guid += userId;
    }
    var r = Math.random().toString().slice(2, 7);
    guid += r;
    return guid;
}




