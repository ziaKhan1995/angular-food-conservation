const { ProductCategory } = require("../models");
const { to, ReE, ReS } = require("../services/util.service");
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/config");
const utilService = require("../services/util.service");

const eventClientService = require("../services/eventClient.service");

const save = async function (req, res) {
  const reqInupt = req.body;
  try {
    var productCategory = null;
    if (!reqInupt) {
      reqInupt = req;
    }
    const id = reqInupt.id;
    console.info("************reqInupt: ", reqInupt);

    if (id) {
      [err, productCategory] = await to(
        ProductCategory.findOne({ where: { id: id } })
      );
      if (err) utilService.TE(err.message, true);
      console.info("************productCategory found=" + productCategory);
    }

    if (!productCategory) {
      return create(reqInupt, res);
    } else {
      return update(reqInupt, productCategory, res);
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
    var productCategory;
    const id = reqInupt.id;

    if (id) {
      return ReE(res, "cannot create new for id=" + id);
    }
    var productCategory = ProductCategory.build({
      id: utilService.encodeUTF8(reqInupt.id),
      prodCatName: utilService.encodeUTF8(reqInupt.prodCatName),
      status: utilService.encodeUTF8(reqInupt.status)
        ? utilService.encodeUTF8(reqInupt.status)
        : 1,
    });

    [err, productCategory] = await to(productCategory.save());
    if (err) utilService.TE("error:" + err);
    console.info("productCategory.id=" + productCategory.id);
    return ReS(
      res,
      {
        productCategory: productCategory,
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

const update = async function (reqInupt, productCategory, res) {
  try {
    const id = reqInupt.id;

    if (!productCategory || !productCategory.id)
      return ReE(res, "cannot save new for id=" + id);

    if (reqInupt.id) {
      productCategory.id = utilService.encodeUTF8(reqInupt.id);
    }
    if (reqInupt.prodCatName) {
      productCategory.prodCatName = utilService.encodeUTF8(
        reqInupt.prodCatName
      );
    }
    if (reqInupt.status) {
      productCategory.status = utilService.encodeUTF8(reqInupt.status);
    } else {
      productCategory.status = 1;
    }
    console.info("************saving existing=");
    [err, productCategory] = await to(productCategory.save());
    if (err) utilService.TE("error:" + err);

    return ReS(
      res,
      {
        productCategory: productCategory,
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
  let id, err, productCategory;
  id = req.params.id;
  if (id) {
    [err, productCategory] = await to(
      ProductCategory.findOne({ where: { id: id } })
    );
    if (err) return ReE(res, "err finding productCategory");
    if (!productCategory)
      return ReE(res, "productCategory not found with id: " + id);
    return ReS(res, { productCategory: productCategory.toWeb() });
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
  var count,rows;
  if (isPageable) {
    [count, rows] = await to(
      ProductCategory.findAndCountAll({
        where: whereClause,
        order: [[sortIndex, sortDirection]],
        limit: [pageNumber * pageSize, pageSize],
      })
    );
    if (!rows || !rows.count)
      return ReE(res, "ProductCategory(s) not found", 500);
  } else {
    [count, rows] = await to(
      ProductCategory.findAndCountAll({
        where: whereClause,
        order: [[sortIndex, sortDirection]],
      })
    );
    if (!rows || !rows.count)
      return ReE(res, "ProductCategory(s) not found", 500);
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

  [err, productCategory] = await to(
    ProductCategory.findOne({ where: whereClause })
  );
  console.info(id + "::productCategory=" + productCategory);
  if (productCategory) {
    return productCategory;
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
  if (object.id) {
    whereClause["id"] = object.id;
  }
  if (object.prodCatName) {
    whereClause["prodCatName"] = object.prodCatName;
  }
  if (object.status) {
    whereClause["status"] = object.status;
  }

  return whereClause;
}
