const { Feedback } = require("../models");
const { to, ReE, ReS } = require("../services/util.service");
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/config");
const utilService = require("../services/util.service");

const eventClientService = require("../services/eventClient.service");

const save = async function (req, res) {
  const reqInupt = req.body;
  try {
    var feedback = null;
    if (!reqInupt) {
      reqInupt = req;
    }
    const id = reqInupt.id;
    console.info("************reqInupt: ", reqInupt);

    if (id) {
      [err, feedback] = await to(Feedback.findOne({ where: { id: id } }));
      if (err) utilService.TE(err.message, true);
      console.info("************feedback found=" + feedback);
    }

    if (!feedback) {
      return create(reqInupt, res);
    } else {
      return update(reqInupt, feedback, res);
    }
  } catch (err) {
    if (reqInupt) {
      eventClientService.printErrorAndsendEmailToAdmin(
        err,
        reqInupt.id,
        reqInupt.businessId,
        reqInupt.id
      );
    } else {
      eventClientService.printErrorAndsendEmailToAdmin(err, null, null, null);
    }

    return ReE(res, err, 500);
  }
};
module.exports.save = save;

const create = async function (reqInupt, res) {
  try {
    var feedback;
    const id = reqInupt.id;

    if (id) {
      return ReE(res, "cannot create new for id=" + id);
    }
    var feedback = Feedback.build({
      overallRating: utilService.encodeUTF8(reqInupt.overallRating),
      sellerId: utilService.encodeUTF8(reqInupt.sellerId),
      shippingDelivery: utilService.encodeUTF8(reqInupt.shippingDelivery),
      sellerCooperation: utilService.encodeUTF8(reqInupt.sellerCooperation),
      fdbDate: utilService.encodeUTF8(reqInupt.fdbDate),
      id: utilService.encodeUTF8(reqInupt.id),
      aucId: utilService.encodeUTF8(reqInupt.aucId),
      comments: utilService.encodeUTF8(reqInupt.comments),
      status: utilService.encodeUTF8(reqInupt.status)
        ? utilService.encodeUTF8(reqInupt.status)
        : 1,
      fdbTime: utilService.encodeUTF8(reqInupt.fdbTime),
      satisfactionRating: utilService.encodeUTF8(reqInupt.satisfactionRating),
      buyerId: utilService.encodeUTF8(reqInupt.buyerId),
    });

    [err, feedback] = await to(feedback.save());
    if (err) utilService.TE("error:" + err);
    console.info("feedback.id=" + feedback.id);
    return ReS(
      res,
      {
        feedback: feedback,
      },
      201
    );
  } catch (err) {
    if (reqInupt) {
      eventClientService.printErrorAndsendEmailToAdmin(
        err,
        reqInupt.id,
        reqInupt.businessId,
        reqInupt.id
      );
    } else {
      eventClientService.printErrorAndsendEmailToAdmin(err, null, null, null);
    }
    return ReE(res, err, 500);
  }
};
module.exports.create = create;

const update = async function (reqInupt, feedback, res) {
  try {
    const id = reqInupt.id;

    if (!feedback || !feedback.id)
      return ReE(res, "cannot save new for id=" + id);

    if (reqInupt.overallRating) {
      feedback.overallRating = utilService.encodeUTF8(reqInupt.overallRating);
    }
    if (reqInupt.sellerId) {
      feedback.sellerId = utilService.encodeUTF8(reqInupt.sellerId);
    }  
      if (reqInupt.comments) {
      feedback.comments = utilService.encodeUTF8(reqInupt.comments);
    }
    if (reqInupt.shippingDelivery) {
      feedback.shippingDelivery = utilService.encodeUTF8(
        reqInupt.shippingDelivery
      );
    }
    if (reqInupt.sellerCooperation) {
      feedback.sellerCooperation = utilService.encodeUTF8(
        reqInupt.sellerCooperation
      );
    }
   
    if (reqInupt.aucId) {
      feedback.aucId = utilService.encodeUTF8(reqInupt.aucId);
    }
    if (reqInupt.id) {
      feedback.id = utilService.encodeUTF8(reqInupt.id);
    }
    if (reqInupt.status) {
      feedback.status = utilService.encodeUTF8(reqInupt.status);
    } else {
      feedback.status = 1;
    }
    if (reqInupt.fdbTime) {
      feedback.fdbTime = utilService.encodeUTF8(reqInupt.fdbTime);
    }
    if (reqInupt.satisfactionRating) {
      feedback.satisfactionRating = utilService.encodeUTF8(
        reqInupt.satisfactionRating
      );
    }
    if (reqInupt.buyerId) {
      feedback.buyerId = utilService.encodeUTF8(reqInupt.buyerId);
    }
    console.info("************saving existing=");
    [err, feedback] = await to(feedback.save());
    if (err) utilService.TE("error:" + err);

    return ReS(
      res,
      {
        feedback: feedback,
      },
      201
    );
  } catch (err) {
    if (reqInupt) {
      eventClientService.printErrorAndsendEmailToAdmin(
        err,
        reqInupt.id,
        reqInupt.businessId,
        reqInupt.id
      );
    } else {
      eventClientService.printErrorAndsendEmailToAdmin(err, null, null, null);
    }
    return ReE(res, err, 500);
  }
};
module.exports.update = update;

const get = async function (req, res) {
  console.log('feedback comming request.query----****-----',req?.query);
  let id, err, feedback;
  id = req.params.id;
  if (id) {
    [err, feedback] = await to(Feedback.findOne({ where: { id: id } }));
    if (err) return ReE(res, "err finding feedback");
    if (!feedback) return ReE(res, "feedback not found with id: " + id);
    return ReS(res, { feedback: feedback.toWeb() });
  }
  var whereClause = getwhereClause(req);
  var pageable = req.pageable;
  if (req.body) {
    pageable = req.body.pageable;
  }
  var isPageable = false;
  var pageNumber = 0;
  var pageSize = 0;
  var sortIndex = "id";
  var sortDirection = "ASC";
  if (pageable) {
    isPageable = true;
    pageNumber = pageable.pageNumber;
    if (pageNumber == null || pageNumber <= 0) {
      pageNumber = 0;
    }
    pageSize = pageable.pageSize;
    if (pageSize == null || pageSize <= 0) {
      isPageable = false;
    }
    if (pageable.sortIndex) {
      sortIndex = pageable.sortIndex;
    }
    if (pageable.sortDirection) {
      sortDirection = pageable.sortDirection;
    }
  }
  if (isPageable) {
    [count, rows] = await to(
      Feedback.findAndCountAll({
        where: whereClause,
        order: [[sortIndex, sortDirection]],
        limit: [pageNumber * pageSize, pageSize],
      })
    );
    if (!rows || !rows.count) return ReE(res, "Feedback(s) not found", 500);
  } else {
    [count, rows] = await to(
      Feedback.findAndCountAll({
        where: whereClause,
        order: [[sortIndex, sortDirection]],
      })
    );
    if (!rows || !rows.count) return ReE(res, "Feedback(s) not found", 500);
  }
  return ReS(res, rows);
};
module.exports.get = get;

const getById = async function (id) {
  if (!id) {
    return null;
  }
  var whereClause = {};
  whereClause["id"] = id;

  [err, feedback] = await to(Feedback.findOne({ where: whereClause }));
  console.info(id + "::feedback=" + feedback);
  if (feedback) {
    return feedback;
  } else {
    return null;
  }
};
module.exports.getById = getById;

function getwhereClause(objectInput) {
  var object = objectInput.body;
  if (!object) {
    object = objectInput;
  }
  var whereClause = {};
  if (object.overallRating) {
    whereClause["overallRating"] = object.overallRating;
  }
  if (object.sellerId) {
    whereClause["sellerId"] = object.sellerId;
  }
  if (object.aucId) {
    whereClause["aucId"] = object.aucId;
  }
  if (object.shippingDelivery) {
    whereClause["shippingDelivery"] = object.shippingDelivery;
  }
  if (object.sellerCooperation) {
    whereClause["sellerCooperation"] = object.sellerCooperation;
  }
  if (object.fdbDate) {
    whereClause["fdbDate"] = object.fdbDate;
  }
  if (object.id) {
    whereClause["id"] = object.id;
  }
  if (object.status) {
    whereClause["status"] = object.status;
  }
  if (object.fdbTime) {
    whereClause["fdbTime"] = object.fdbTime;
  }
  if (object.satisfactionRating) {
    whereClause["satisfactionRating"] = object.satisfactionRating;
  }
  if (object.buyerId) {
    whereClause["buyerId"] = object.buyerId;
  }

  return whereClause;
}
