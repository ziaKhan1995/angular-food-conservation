const { Bid } = require("../models");
const { to, ReE, ReS } = require("../services/util.service");
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/config");
const utilService = require("../services/util.service");

const eventClientService = require("../services/eventClient.service");

const save = async function (req, res) {
  console.info("\nbid save comming query", req.query);
  console.info("\n");
  const reqInupt = req.body;
  var whereClause = " WHERE 1=1";
  var replacments = {};
  var setUpdateStatusForOthers;//for others whose bids are not approved
  var aucId;
  var bidderId;
  try {
    var bid = null;
    if (!reqInupt) {
      reqInupt = req;
    }
    const id = reqInupt.id;
    console.info("\n----Bid comming request: ", reqInupt);
    console.info("\n");
    if(reqInupt.updateOtherBidStatuses){
      if(reqInupt.updateOtherBidStatusesTo){
        setUpdateStatusForOthers=reqInupt.updateOtherBidStatusesTo;
      }
      if(reqInupt.aucId){
        aucId=reqInupt.aucId;
      }
      if(reqInupt.bidderId){
        bidderId=reqInupt.bidderId;
      }
      var affectedRows=0;
      //UPDATE bid SET STATUS=4 WHERE Auc_ID=51 AND STATUS!=3 AND bidder_id!=8
      console.log("\nQuery for updating bids status that are  not approved: UPDATE bid SET STATUS="+
      setUpdateStatusForOthers+" WHERE 1=1 AND Auc_ID="+aucId+
      " AND STATUS!=3 bidder_id!="+bidderId+"\n");
      await Bid.sequelize
        .query(
          "UPDATE bid SET STATUS="+setUpdateStatusForOthers+" WHERE 1=1 AND Auc_ID="+aucId+
          " AND STATUS!=3 AND bidder_id!="+bidderId
        )
        .then(function (result) {
          if(result[0].affectedRows){
            affectedRows=result[0].affectedRows;
          }
          console.log('\nbid total affectedRows ',affectedRows);
          console.log('\n');
        });
    }

    if (id) {
      [err, bid] = await to(Bid.findOne({ where: { id: id } }));
      if (err) utilService.TE(err.message, true);
      console.info("************bid found=" + bid);
    }

    if (!bid) {
      return create(reqInupt, res);
    } else {
      return update(reqInupt, bid, res);
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
    var bid;
    const id = reqInupt.id;

    if (id) {
      return ReE(res, "cannot create new for id=" + id);
    }
    var bid = Bid.build({
      sellerId: utilService.encodeUTF8(reqInupt.sellerId),
      bidTime: utilService.encodeUTF8(reqInupt.bidTime),
      bidComment: utilService.encodeUTF8(reqInupt.bidComment),
      aucId: utilService.encodeUTF8(reqInupt.aucId),
      bidderId: utilService.encodeUTF8(reqInupt.bidderId),
      bidPrice: utilService.encodeUTF8(reqInupt.bidPrice),
      id: utilService.encodeUTF8(reqInupt.id),
      bidDate: utilService.encodeUTF8(reqInupt.bidDate),
      status: utilService.encodeUTF8(reqInupt.status)
        ? utilService.encodeUTF8(reqInupt.status)
        : 1,
      bidNumber: utilService.encodeUTF8(reqInupt.bidNumber),
    });

    [err, bid] = await to(bid.save());
    if (err) utilService.TE("error:" + err);
    console.info("bid.id=" + bid.id);
    return ReS(
      res,
      {
        bid: bid,
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

const update = async function (reqInupt, bid, res) {
  try {
    const id = reqInupt.id;

    if (!bid || !bid.id) return ReE(res, "cannot save new for id=" + id);

    if (reqInupt.sellerId) {
      bid.sellerId = utilService.encodeUTF8(reqInupt.sellerId);
    }
    if (reqInupt.bidTime) {
      bid.bidTime = utilService.encodeUTF8(reqInupt.bidTime);
    }
    if (reqInupt.bidComment) {
      bid.bidComment = utilService.encodeUTF8(reqInupt.bidComment);
    }
    if (reqInupt.aucId) {
      bid.aucId = utilService.encodeUTF8(reqInupt.aucId);
    }
    if (reqInupt.bidderId) {
      bid.bidderId = utilService.encodeUTF8(reqInupt.bidderId);
    }
    if (reqInupt.bidPrice) {
      bid.bidPrice = utilService.encodeUTF8(reqInupt.bidPrice);
    }
    if (reqInupt.id) {
      bid.id = utilService.encodeUTF8(reqInupt.id);
    }

    if (reqInupt.bidDate) {
      bid.bidDate = utilService.encodeUTF8(reqInupt.bidDate);
    } 
    if (reqInupt.status) {
      bid.status = utilService.encodeUTF8(reqInupt.status);
    } else {
      bid.status = 1;
    }
    if (reqInupt.bidNumber) {
      bid.bidNumber = utilService.encodeUTF8(reqInupt.bidNumber);
    }
    console.info("************saving existing=");
    [err, bid] = await to(bid.save());
    if (err) utilService.TE("error:" + err);

    return ReS(
      res,
      {
        bid: bid,
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
  let id, err, bid;
  id = req.params.id;
  if (id) {
    [err, bid] = await to(Bid.findOne({ where: { id: id } }));
    if (err) return ReE(res, "err finding bid");
    if (!bid) return ReE(res, "bid not found with id: " + id);
    return ReS(res, { bid: bid.toWeb() });
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
      Bid.findAndCountAll({
        where: whereClause,
        order: [[sortIndex, sortDirection]],
        limit: [pageNumber * pageSize, pageSize],
      })
    );
    if (!rows || !rows.count) return ReE(res, "Bid(s) not found", 500);
  } else {
    [count, rows] = await to(
      Bid.findAndCountAll({
        where: whereClause,
        order: [[sortIndex, sortDirection]],
      })
    );
    if (!rows || !rows.count) return ReE(res, "Bid(s) not found", 500);
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

  [err, bid] = await to(Bid.findOne({ where: whereClause }));
  console.info(id + "::bid=" + bid);
  if (bid) {
    return bid;
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
  if (object.sellerId) {
    whereClause["sellerId"] = object.sellerId;
  }
  if (object.bidTime) {
    whereClause["bidTime"] = object.bidTime;
  }
  if (object.aucId) {
    whereClause["aucId"] = object.aucId;
  }
  if (object.bidderId) {
    whereClause["bidderId"] = object.bidderId;
  }
  if (object.bidPrice) {
    whereClause["bidPrice"] = object.bidPrice;
  }
  if (object.id) {
    whereClause["id"] = object.id;
  }
  if (object.bidDate) {
    whereClause["bidDate"] = object.bidDate;
  }
  if (object.status) {
    whereClause["status"] = object.status;
  }
  if (object.bidNumber) {
    whereClause["bidNumber"] = object.bidNumber;
  }

  return whereClause;
}
