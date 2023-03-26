const { Auction } = require("../models");
const { to, ReE, ReS,ReSOnUpdatingStatuses } = require("../services/util.service");
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/config");
const utilService = require("../services/util.service");
const models = require("../models");
const eventClientService = require("../services/eventClient.service");

const save = async function (req, res) {
  const reqInupt = req.body;
  try {
    var auction = null;
    if (!reqInupt) {
      reqInupt = req;
    }
    const id = reqInupt.id;
    console.info("auctions************reqInupt: ", reqInupt);

    if (id) {
      [err, auction] = await to(Auction.findOne({ where: { id: id } }));
      if (err) utilService.TE(err.message, true);
      console.info("************auction found=" + auction);
    }

    if (!auction) {
      return create(reqInupt, res);
    } else {
      return update(reqInupt, auction, res);
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

const getSaleHistory = async function (req, res) {
  console.log("getSaleHistory Auction comming request.query----****-----", req?.query);
  var sellerId,prodName;
  var sortyBy='Auc_Close_Date',sortDirection='DESC';
  var todayDate,dueDate,prodCatId;
  if (req.query.todayDate) {
    todayDate = req.query.todayDate;
  }
  if (req.query.sortyBy) {
    sortyBy = req.query.sortyBy;
  }
  if (req.query.dueDate) {
    dueDate = req.query.dueDate;
  }
  if (req.query.prodName) {
    prodName = req.query.prodName;
  }  
  if (req.query.prodCatId) {
    prodCatId = req.query.prodCatId;
  }
  if (req.query.sellerId) {
    sellerId = req.query.sellerId;
  }
  if ((req.query.setStatus && req.query.statuses 
    && sellerId && todayDate) || req.query.admin) {
    await updateAllAuctionsStatusesWhenDateIsOver(req, res);
  }
  let id, err, status;
  var tickets = {};
  var ticketResponse = {};
  var pageable = req.pageable;

  if (req.query.id) {
    id = req.query.id;
  }
  if (req.query.status) {
    status = req.query.status;
  }

  var pageNumber = 0;
  var pageSize = 0;
  var sortIndex = "id";
  if (req.query.pageSize) {
    pageSize = req.query.pageSize;
  }
  if (pageSize) {
    pageSize = Number(pageSize);
  }
  if (pageSize == null || pageSize <= 0) {
    pageSize = 1000;
  }
  if (pageable && pageable.pageNumber) {
    pageNumber = pageable.pageNumber;
  }
  if (pageNumber == null || pageNumber <= 0) {
    pageNumber = 0;
  }
  if (req.query.sortIndex) {
    sortIndex = req.query.sortIndex;
  }
  if (req.query.sortDirection) {
    sortDirection = req.query.sortDirection;
  }

  var whereClause = " WHERE 1=1";
  var replacments = {};

  if (id) {
    whereClause += " AND a.ID = :id";
    replacments["id"] = id;
  }
  // if (status) {
  //   whereClause += " AND a.status = :status";
  //   replacments["status"] = status;
  // }
  if(prodName){
    whereClause += " AND a.Prod_Name like :prodName";
    replacments['prodName'] = '%' + prodName + '%';
  }
  if(prodCatId){
    whereClause += " AND a.prod_cat_ID =:prodCatId";
    replacments['prodCatId'] = prodCatId;
  }
  if (status) {
    var array = status.split(",");
    console.log('statuses array after spliting: ',array);
    if(req.query.homeComp==1){
      whereClause += " AND ( a.status in(:status)";
    }
    else{
      whereClause += " AND a.status in(:status)";
    }
    replacments["status"] = array;
  }
  if(dueDate){
    if(req.query.homeComp==1){
      whereClause += " AND a.Auc_Close_Date > :dueDate ) OR (a.status=3 AND a.Auction_Finish_Date > :dueDate)";
    }
    else{
      whereClause += " AND a.Auc_Close_Date > :dueDate";
    }
    replacments["dueDate"] = dueDate;
  }
  if (sellerId) {
    whereClause += " AND a.seller_id = :sellerId";
    replacments["sellerId"] = sellerId;
  }
 
  console.log("whereClause=" + whereClause);
  console.log("replacments=", replacments); 
console.log("query to execute:  SELECT a.* , COUNT(b.auc_id) bidCount FROM auction a  LEFT JOIN bid b ON   a.id =b.auc_id" +
whereClause +
" GROUP BY a.id" +
" ORDER BY a.Auc_Close_Date "+sortDirection+" limit " +
pageNumber * pageSize +
"," +
pageSize,
{ replacements: replacments, type: models.sequelize.QueryTypes.SELECT });

  await models.sequelize
    .query(
      "SELECT a.*,p.prod_cat_name,COUNT(b.auc_id) bidCount FROM auction a LEFT JOIN bid b ON a.id =b.auc_id" +
        " LEFT JOIN product_category p ON a.prod_cat_ID=p.id "+whereClause +
        " GROUP BY a.id" +
        " ORDER BY "+sortyBy+" "+sortDirection+" limit " +
        pageNumber * pageSize +
        "," +
        pageSize,
      { replacements: replacments, type: models.sequelize.QueryTypes.SELECT }
    )
    .then(function (ticketDb) {
      tickets = ticketDb;
    });

  var countDb = await models.sequelize
    .query("SELECT COUNT(*) as count FROM  auction a " + whereClause, {
      replacements: replacments,
      type: models.sequelize.QueryTypes.SELECT,
    })
    .then(function (count) {
      return count;
    });

  console.log("auctionsWithBidsCount:", countDb);

  if (!tickets) return ReE(res, "auction(s) not found", 204);
  ticketResponse.rows = tickets;
  ticketResponse.count = countDb;
  if (countDb.count) {
    ticketResponse.count = countDb.count;
  }

  return ReS(res, ticketResponse);
};
module.exports.getSaleHistory = getSaleHistory;

/** Update all bud statuses when an auction
 * @Disapproved {*} by Admin 
 * @Seller  accepted a bid and rest are  disapproved
 * @Seller deleted auction
 * @Auction expired before selling
 */
const updateAllAuctionsStatusesWhenDateIsOver = async function (req, res) {
  console.log('Auction comming request.query *****',req?.query);
  let setStatus;//the status to set
  var whereClause=" WHERE 1=1 ";
  if(req.query.setStatus){
    setStatus=req.query.setStatus;
  }
  if(!setStatus){
    return ReE(res, "Set status not defined ", 204);
  }
  if(req.query.todayDate){
    whereClause +=" AND Auc_Close_Date <= '"+req.query.todayDate +"' ";
 }
  if(req.query.sellerId){
    whereClause+=" AND Seller_Id="+req.query.sellerId;
  }

  if(req?.query?.statuses){
    whereClause+=" AND status IN ("+req?.query?.statuses.split(',')+")";
  }
  console.log('updateAllAuctionsStatusesWhenDateIsOver whereClause\n',whereClause);
  var affectedRows=0;
  await models.sequelize
    .query(
      "UPDATE auction SET STATUS="+setStatus+whereClause
    )
    .then(function (result) {
      if(result[0].affectedRows){
        affectedRows=result[0].affectedRows;
      }
      //console.log('auction results values',result);
      console.log('auction total affectedRows ',affectedRows);
    });
    //return ReSOnUpdatingStatuses(res, "rows affected",201,affectedRows);
  //return ReS(res, "rows affected",201);
};
module.exports.updateAllAuctionsStatusesWhenDateIsOver = updateAllAuctionsStatusesWhenDateIsOver;

 /**update all bids statuses against an auction when the auction is 
  * @Auction expired 
  * @Disapproved by admin 
  * @Seller accepted a bid and rest are disapproved 
  * @Auction deleted by seller 
  */
const updateAllBidsStatusesWhenDateIsOver = async function (req, res) {
  console.log(
    "\nAuction-bid upading statuses due to date is over---- purchase history comming request.query *****",
    req?.query
  );
  console.log("\n");
    var whereClause = " WHERE 1=1";
  var replacments = {};
  var setExpiredStatusOfBid; //for others whose bids are not approved
  var aucId;
  var bidderId;
  var statuesList;
  var todayDate;
  try {
       
    const id = req?.query?.id;
    if (req?.query?.setExpiredStatusOfBid) {
      setExpiredStatusOfBid =req?.query?.setExpiredStatusOfBid;
    }
    if (req?.query?.todayDate) {
      todayDate = req?.query?.todayDate;
    }
    if (req?.query?.aucId) {
      aucId = req?.query?.aucId;
    }
    if (req.query.statuesList) {
      statuesList = req.query.statuesList;
    }
    if (req?.query?.bidderId) {
      bidderId = req?.query?.bidderId;
    }
    var affectedRows = 0;
    console.log('>>>statuesList='+statuesList);
    await models.sequelize
      .query(
        " UPDATE bid b INNER JOIN auction a ON a.ID = b.Auc_ID " +
          "SET b.status = " +
          setExpiredStatusOfBid +
          " WHERE 1=1 AND a.Auc_Close_Date < '" +
          todayDate +
          "'" +
          " AND b.STATUS IN (" +
          statuesList.split(",") +
          ") AND bidder_id=" +
          bidderId
      )
      .then(function (result) {
        if (result[0].affectedRows) {
          affectedRows = result[0].affectedRows;
        }
        console.log(
          "\nbid total affectedRows in updatinf status due to expiery date",
          affectedRows
        );
        console.log("\n");
      });
  } catch (err) {
    console.log(
      "An error occured while upading statuses due to date is over---- purchase history",
      err
    );
  }
};
module.exports.updateAllBidsStatusesWhenDateIsOver =
  updateAllBidsStatusesWhenDateIsOver;

const getAuctionAllBids = async function (req, res) {
  let id, err;
  var tickets = {};
  var ticketResponse = {};
  // id = req.params.id;
  console.log("req.query:", req.query);

  id = req.query.id;
  var auctionId = req.query.auctionId;
  var pageNumber = 0;
  var pageSize = 0;
  var sortIndex = "id";
  var sortDirection = "DESC";

  pageSize = req.query.pageSize;
  if (pageSize) {
    pageSize = Number(pageSize);
  }
  if (pageSize == null || pageSize <= 0) {
    pageSize = 1000;
  }
  if (req.query.sortIndex) {
    sortIndex = req.query.sortIndex;
  }
  if (req.query.sortDirection) {
    sortDirection = req.query.sortDirection;
  }

  var whereClause = " WHERE 1=1";
  var replacments = {};

  if (id) {
    whereClause += " AND b.ID = :id";
    replacments["id"] = id;
  }
  if (auctionId) {
    whereClause += " AND b.auc_id = :auctionId";
    replacments["auctionId"] = auctionId;
  }
  console.log("whereClause=" + whereClause);
  console.log("replacments=", replacments);

  await models.sequelize
    .query(
      "SELECT b.*,b.status as bidStatus, u.user_fname AS userFirstName, u.user_lname AS userLastName   FROM bid b  LEFT JOIN users u ON   b.bidder_id =u.id  " +
        whereClause +
        " GROUP BY b.id " +
        " ORDER BY b.id DESC  limit " +
        pageNumber * pageSize +
        "," +
        pageSize,
      { replacements: replacments, type: models.sequelize.QueryTypes.SELECT }
    )
    .then(function (ticketDb) {
      tickets = ticketDb;
    });

  var countDb = await models.sequelize
    .query("SELECT COUNT(b.id) as count FROM  bid b " + whereClause, {
      replacements: replacments,
      type: models.sequelize.QueryTypes.SELECT,
    })
    .then(function (count) {
      return count;
    });

  console.log("auctionAllBids:", countDb);

  if (!tickets) return ReE(res, "bid(s) not found", 204);
  ticketResponse.rows = tickets;
  ticketResponse.count = countDb;
  if (countDb.count) {
    ticketResponse.count = countDb.count;
  }

  return ReS(res, ticketResponse);
};
module.exports.getAuctionAllBids = getAuctionAllBids;


const getUserPurchaseHistory = async function (req, res) {
  let id, err;
  var sortColumn="id";
  var tickets = {};
  var ticketResponse = {};
  console.log("\ngetUserPurchaseHistory req.query:", req.query);
  console.log("\n");
  await updateAllBidsStatusesWhenDateIsOver(req,res);
  if(req.query.id){
    id=req.query.id;
}
  if(req.query.sortColumn){
      sortColumn=req.query.sortColumn;
  }
  var bidderId;
  if(req.query.bidderId){
    bidderId = req.query.bidderId;
  }
  var pageNumber = 0;
  var pageSize = 0;
  var sortIndex = "id";
  var sortDirection = "DESC";

  if(req.query.pageSize){
    pageSize = Number(req.query.pageSize);
  }
  
  if (pageSize == null || pageSize <= 0) {
    pageSize = 1000;
  }
  if (req.query.sortIndex) {
    sortIndex = req.query.sortIndex;
  }
  if (req.query.sortDirection) {
    sortDirection = req.query.sortDirection;
  }

  var whereClause = " WHERE 1=1";
  var replacments = {};

  if (id) {
    whereClause += " AND a.ID = :id";
    replacments["id"] = id;
  }
  if (bidderId) {
    whereClause += " AND b.bidder_id = :bidderId";
    replacments["bidderId"] = bidderId;
  }
  console.log("whereClause=" + whereClause);
  console.log("replacments=", replacments);

  await models.sequelize
    .query(
      " SELECT a.*,b.bid_price,b.status as bidStatus,b.id as bidId  FROM auction a  LEFT JOIN bid b ON   a.id =b.auc_id " +
        whereClause +
        " ORDER BY a.id DESC  limit " +
        pageNumber * pageSize +
        "," +
        pageSize,
      { replacements: replacments, type: models.sequelize.QueryTypes.SELECT }
    )
    .then(function (ticketDb) {
      tickets = ticketDb;
    });

  var countDb = await models.sequelize
    .query(" SELECT count(a.id) as count  FROM auction a  LEFT JOIN bid b ON   a.id =b.auc_id  " + whereClause, {
      replacements: replacments,
      type: models.sequelize.QueryTypes.SELECT,
    })
    .then(function (count) {
      return count;
    });

  console.log("getUserBids:", countDb);

  if (!tickets) return ReE(res, "bids(s) not found", 204);
  ticketResponse.rows = tickets;
  ticketResponse.count = countDb;
  if (countDb.count) {
    ticketResponse.count = countDb.count;
  }

  return ReS(res, ticketResponse);
};
module.exports.getUserPurchaseHistory = getUserPurchaseHistory;





const create = async function (reqInupt, res) {
  try {
    var auction;
    const id = reqInupt.id;

    if (id) {
      return ReE(res, "cannot create new for id=" + id);
    }
    var auction = Auction.build({
      aucWinnerFname: utilService.encodeUTF8(reqInupt.aucWinnerFname),
      aucPaymentAmount: utilService.encodeUTF8(reqInupt.aucPaymentAmount),
      minBidIncrement: utilService.encodeUTF8(reqInupt.minBidIncrement),
      sellerId: utilService.encodeUTF8(reqInupt.sellerId),
      prodDescription: utilService.encodeUTF8(reqInupt.prodDescription),
      aucCloseDate: utilService.encodeUTF8(reqInupt.aucCloseDate),
      auctionFinishDate: utilService.encodeUTF8(reqInupt.auctionFinishDate),
      aucPaymentDate: utilService.encodeUTF8(reqInupt.aucPaymentDate),
      prodCatId: utilService.encodeUTF8(reqInupt.prodCatId),
      aucWinnerLname: utilService.encodeUTF8(reqInupt.aucWinnerLname),
      prodStartBidAmount: utilService.encodeUTF8(reqInupt.prodStartBidAmount),
      id: utilService.encodeUTF8(reqInupt.id),
      prodName: utilService.encodeUTF8(reqInupt.prodName),
      quantity: utilService.encodeUTF8(reqInupt.quantity),
      aucStartDate: utilService.encodeUTF8(reqInupt.aucStartDate),
      status: utilService.encodeUTF8(reqInupt.status)
        ? utilService.encodeUTF8(reqInupt.status)
        : 1,
      aucReservePrice: utilService.encodeUTF8(reqInupt.aucReservePrice),
    });

    [err, auction] = await to(auction.save());
    if (err) utilService.TE("error:" + err);
    console.info("auction.id=" + auction.id);
    return ReS(
      res,
      {
        auction: auction,
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

const update = async function (reqInupt, auction, res) {
  try {
    const id = reqInupt.id;

    if (!auction || !auction.id)
      return ReE(res, "cannot save new for id=" + id);

    if (reqInupt.aucWinnerFname) {
      auction.aucWinnerFname = utilService.encodeUTF8(reqInupt.aucWinnerFname);
    }
    if (reqInupt.aucPaymentAmount) {
      auction.aucPaymentAmount = utilService.encodeUTF8(
        reqInupt.aucPaymentAmount
      );
    }
    if (reqInupt.minBidIncrement) {
      auction.minBidIncrement = utilService.encodeUTF8(
        reqInupt.minBidIncrement
      );
    }
    if (reqInupt.sellerId) {
      auction.sellerId = utilService.encodeUTF8(reqInupt.sellerId);
    }
    if (reqInupt.prodDescription) {
      auction.prodDescription = utilService.encodeUTF8(
        reqInupt.prodDescription
      );
    }
    if (reqInupt.aucCloseDate) {
      auction.aucCloseDate = utilService.encodeUTF8(reqInupt.aucCloseDate);
    }
     if (reqInupt.auctionFinishDate) {
       auction.auctionFinishDate = utilService.encodeUTF8(reqInupt.auctionFinishDate);
     }
    if (reqInupt.aucPaymentDate) {
      auction.aucPaymentDate = utilService.encodeUTF8(reqInupt.aucPaymentDate);
    }
    if (reqInupt.prodCatId) {
      auction.prodCatId = utilService.encodeUTF8(reqInupt.prodCatId);
    }
    if (reqInupt.aucWinnerLname) {
      auction.aucWinnerLname = utilService.encodeUTF8(reqInupt.aucWinnerLname);
    }
    if (reqInupt.prodStartBidAmount) {
      auction.prodStartBidAmount = utilService.encodeUTF8(
        reqInupt.prodStartBidAmount
      );
    }
    if (reqInupt.id) {
      auction.id = utilService.encodeUTF8(reqInupt.id);
    }
    if (reqInupt.prodName) {
      auction.prodName = utilService.encodeUTF8(reqInupt.prodName);
    } 
    if (reqInupt.quantity) {
      auction.quantity = utilService.encodeUTF8(reqInupt.quantity);
    }
    if (reqInupt.aucStartDate) {
      auction.aucStartDate = utilService.encodeUTF8(reqInupt.aucStartDate);
    }
    if (reqInupt.status) {
      auction.status = utilService.encodeUTF8(reqInupt.status);
    } else {
      auction.status = 1;
    }
    if (reqInupt.aucReservePrice) {
      auction.aucReservePrice = utilService.encodeUTF8(
        reqInupt.aucReservePrice
      );
    }
    console.info("************saving existing=");
    [err, auction] = await to(auction.save());
    if (err) utilService.TE("error:" + err);

    return ReS(
      res,
      {
        auction: auction,
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
  let id, err, auction;
  id = req.params.id;
  if (id) {
    [err, auction] = await to(Auction.findOne({ where: { id: id } }));
    if (err) return ReE(res, "err finding auction");
    if (!auction) return ReE(res, "auction not found with id: " + id);
    return ReS(res, { auction: auction.toWeb() });
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
      Auction.findAndCountAll({
        where: whereClause,
        order: [[sortIndex, sortDirection]],
        limit: [pageNumber * pageSize, pageSize],
      })
    );
    if (!rows || !rows.count) return ReE(res, "Auction(s) not found", 500);
  } else {
    [count, rows] = await to(
      Auction.findAndCountAll({
        where: whereClause,
        order: [[sortIndex, sortDirection]],
      })
    );
    if (!rows || !rows.count) return ReE(res, "Auction(s) not found", 500);
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

  [err, auction] = await to(Auction.findOne({ where: whereClause }));
  console.info(id + "::auction=" + auction);
  if (auction) {
    return auction;
  } else {
    return null;
  }
};
module.exports.getById = getById;

// const getLastAuctionItem = async function () {
 
//   var whereClause = {};

//   [err, auction] = await to(Auction.findOne({ where: whereClause }));
//   console.info(id + "::auction=" + auction);
//   if (auction) {
//     return auction;
//   } else {
//     return null;
//   }
// };
// module.exports.getLastAuctionItem = getLastAuctionItem;

function getwhereClause(objectInput) {
  var object = objectInput.body;
  if (!object) {
    object = objectInput;
  }
  var whereClause = {};
  if (object.aucWinnerFname) {
    whereClause["aucWinnerFname"] = object.aucWinnerFname;
  }
  if (object.aucPaymentAmount) {
    whereClause["aucPaymentAmount"] = object.aucPaymentAmount;
  }
  if (object.minBidIncrement) {
    whereClause["minBidIncrement"] = object.minBidIncrement;
  }
  if (object.sellerId) {
    whereClause["sellerId"] = object.sellerId;
  }
  if (object.prodDescription) {
    whereClause["prodDescription"] = object.prodDescription;
  }
  if (object.aucCloseDate) {
    whereClause["aucCloseDate"] = object.aucCloseDate;
  }
   if (object.auctionFinishDate) {
     whereClause["auctionFinishDate"] = object.auctionFinishDate;
   }
  if (object.aucPaymentDate) {
    whereClause["aucPaymentDate"] = object.aucPaymentDate;
  }
  if (object.prodCatId) {
    whereClause["prodCatId"] = object.prodCatId;
  }
  if (object.aucWinnerLname) {
    whereClause["aucWinnerLname"] = object.aucWinnerLname;
  }
  if (object.prodStartBidAmount) {
    whereClause["prodStartBidAmount"] = object.prodStartBidAmount;
  }
  if (object.id) {
    whereClause["id"] = object.id;
  }
  if (object.prodName) {
    whereClause["prodName"] = object.prodName;
  }
  if (object.quantity) {
    whereClause["quantity"] = object.quantity;
  }
  if (object.aucStartDate) {
    whereClause["aucStartDate"] = object.aucStartDate;
  }
  if (object.status) {
    whereClause["status"] = object.status;
  }
  if (object.aucReservePrice) {
    whereClause["aucReservePrice"] = object.aucReservePrice;
  }

  return whereClause;
}
