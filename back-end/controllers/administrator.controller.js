const { Administrator } = require("../models");
const { to, ReE, ReS } = require("../services/util.service");
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/config");
const utilService = require("../services/util.service");

const eventClientService = require("../services/eventClient.service");

const login = async function (req, res) {
  try {
    const body = req.body;
    let err, adminEmail;
    let data = body;
    if (body.data) {
      data = body.data;
    }

    console.log("ReqBody:", data);
    if (!data.password) {
      utilService.TE("Invaid Password", "");
    }
    if (!data.adminEmail) {
      utilService.TE("Invaid Email", "");
    }

    adminEmail = await getByEmail(data.adminEmail);
    console.log("adminEmail:", adminEmail);
    if (!adminEmail) {
      utilService.TE("Invaid Email", "adminEmail=" + data.adminEmail);
    }
    if (adminEmail.password != data.password) {
      utilService.TE("Invaid Email/Password", "adminEmail=" + data.adminEmail);
    }

    return utilService.ReS(res, {
      token: adminEmail.getJWT(),
      user: adminEmail.toWeb(),
    });
  } catch (err) {
    // if (reqInput) {
    //     eventClientService.printErrorAndsendEmailToAdmin(err, reqInput.id, reqInput.businessId, reqInput.id);
    // } else {
    //     eventClientService.printErrorAndsendEmailToAdmin(err, null, null, null);
    // }
    console.info("************err=", err);
    // return utilService.ReE(res, err, 401);
    return utilService.ReE(res, err, 500);
  }
};
module.exports.login = login;

const save = async function (req, res) {
  try {
    var administrator = null;
    const reqInupt = req.body;
    const id = reqInupt.id;

    if (id) {
      [err, administrator] = await to(
        Administrator.findOne({ where: { id: id } })
      );
      if (err) utilService.TE(err.message, true);
      console.info("************administrator found=" + administrator);
    }

    if (!administrator) {
      return create(reqInupt, res);
    } else {
      return update(reqInupt, administrator, res);
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
    var administrator;
    const id = reqInupt.id;

    if (id) {
      return ReE(res, "cannot create new for id=" + id);
    }
    var administrator = Administrator.build({
      adminFname: utilService.encodeUTF8(reqInupt.adminFname),
      adminLname: utilService.encodeUTF8(reqInupt.adminLname),
      adminStreetname: utilService.encodeUTF8(reqInupt.adminStreetname),
      adminPhoneno: utilService.encodeUTF8(reqInupt.adminPhoneno),
      id: utilService.encodeUTF8(reqInupt.id),
      aminZipcode: utilService.encodeUTF8(reqInupt.aminZipcode),
      adminState: utilService.encodeUTF8(reqInupt.adminState),
      adminCountry: utilService.encodeUTF8(reqInupt.adminCountry),
      adminCity: utilService.encodeUTF8(reqInupt.adminCity),
      status: utilService.encodeUTF8(reqInupt.status)
        ? utilService.encodeUTF8(reqInupt.status)
        : 1,
      adminEmail: utilService.encodeUTF8(reqInupt.adminEmail),
      adminStreetno: utilService.encodeUTF8(reqInupt.adminStreetno),
    });

    [err, administrator] = await to(administrator.save());
    if (err) utilService.TE("error:" + err);
    console.info("administrator.id=" + administrator.id);
    return ReS(
      res,
      {
        administrator: administrator,
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

const update = async function (reqInupt, administrator, res) {
  try {
    const id = reqInupt.id;

    if (!administrator || !administrator.id)
      return ReE(res, "cannot save new for id=" + id);

    if (reqInupt.adminFname) {
      administrator.adminFname = utilService.encodeUTF8(reqInupt.adminFname);
    }
    if (reqInupt.adminLname) {
      administrator.adminLname = utilService.encodeUTF8(reqInupt.adminLname);
    }
    if (reqInupt.adminStreetname) {
      administrator.adminStreetname = utilService.encodeUTF8(
        reqInupt.adminStreetname
      );
    }
    if (reqInupt.adminPhoneno) {
      administrator.adminPhoneno = utilService.encodeUTF8(
        reqInupt.adminPhoneno
      );
    }
    if (reqInupt.id) {
      administrator.id = utilService.encodeUTF8(reqInupt.id);
    }
    if (reqInupt.aminZipcode) {
      administrator.aminZipcode = utilService.encodeUTF8(reqInupt.aminZipcode);
    }
    if (reqInupt.adminState) {
      administrator.adminState = utilService.encodeUTF8(reqInupt.adminState);
    }
    if (reqInupt.adminCountry) {
      administrator.adminCountry = utilService.encodeUTF8(
        reqInupt.adminCountry
      );
    }
    if (reqInupt.adminCity) {
      administrator.adminCity = utilService.encodeUTF8(reqInupt.adminCity);
    }
    if (reqInupt.status) {
      administrator.status = utilService.encodeUTF8(reqInupt.status);
    } else {
      administrator.status = 1;
    }
    if (reqInupt.adminEmail) {
      administrator.adminEmail = utilService.encodeUTF8(reqInupt.adminEmail);
    }
    if (reqInupt.adminStreetno) {
      administrator.adminStreetno = utilService.encodeUTF8(
        reqInupt.adminStreetno
      );
    }
    console.info("************saving existing=");
    [err, administrator] = await to(administrator.save());
    if (err) utilService.TE("error:" + err);

    return ReS(
      res,
      {
        administrator: administrator,
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
  let id, err, administrator;
  id = req.params.id;
  if (id) {
    [err, administrator] = await to(
      Administrator.findOne({ where: { id: id } })
    );
    if (err) return ReE(res, "err finding administrator");
    if (!administrator)
      return ReE(res, "administrator not found with id: " + id);
    return ReS(res, { administrator: administrator.toWeb() });
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
      Administrator.findAndCountAll({
        where: whereClause,
        order: [[sortIndex, sortDirection]],
        limit: [pageNumber * pageSize, pageSize],
      })
    );
    if (!rows || !rows.count)
      return ReE(res, "Administrator(s) not found", 500);
  } else {
    [count, rows] = await to(
      Administrator.findAndCountAll({
        where: whereClause,
        order: [[sortIndex, sortDirection]],
      })
    );
    if (!rows || !rows.count)
      return ReE(res, "Administrator(s) not found", 500);
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

  [err, administrator] = await to(
    Administrator.findOne({ where: whereClause })
  );
  console.info(id + "::administrator=" + administrator);
  if (administrator) {
    return administrator;
  } else {
    return null;
  }
};
module.exports.getById = getById;

const getByEmail = async function (userEmail) {
  if (!userEmail) {
    return null;
  }
  var whereClause = {};
  whereClause["adminEmail"] = userEmail;

  [err, users] = await to(Administrator.findOne({ where: whereClause }));
  console.info(userEmail + "::Administrators=" + users);
  if (users) {
    return users;
  } else {
    return null;
  }
};
module.exports.getByEmail = getByEmail;

function getwhereClause(objectInput) {
  var object = objectInput.body;
  if (!object) {
    object = objectInput;
  }
  var whereClause = {};
  if (object.adminFname) {
    whereClause["adminFname"] = object.adminFname;
  }
  if (object.adminLname) {
    whereClause["adminLname"] = object.adminLname;
  }
  if (object.adminStreetname) {
    whereClause["adminStreetname"] = object.adminStreetname;
  }
  if (object.adminPhoneno) {
    whereClause["adminPhoneno"] = object.adminPhoneno;
  }
  if (object.id) {
    whereClause["id"] = object.id;
  }
  if (object.aminZipcode) {
    whereClause["aminZipcode"] = object.aminZipcode;
  }
  if (object.adminState) {
    whereClause["adminState"] = object.adminState;
  }
  if (object.adminCountry) {
    whereClause["adminCountry"] = object.adminCountry;
  }
  if (object.adminCity) {
    whereClause["adminCity"] = object.adminCity;
  }
  if (object.status) {
    whereClause["status"] = object.status;
  }
  if (object.adminEmail) {
    whereClause["adminEmail"] = object.adminEmail;
  }
  if (object.adminStreetno) {
    whereClause["adminStreetno"] = object.adminStreetno;
  }

  return whereClause;
}
