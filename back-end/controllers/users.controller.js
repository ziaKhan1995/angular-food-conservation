const { Users } = require("../models");
const { to, ReE, ReS } = require("../services/util.service");
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/config");
const utilService = require("../services/util.service");

const eventClientService = require("../services/eventClient.service");

const login = async function (req, res) {
  try {
    const body = req.body;
    let err, userByEmail;
    let data = body;
    if (body.data) {
      data = body.data;
    }

    console.log("ReqBody:", data);
    if (!data.password) {
      utilService.TE("Invaid Password", "");
    }
    if (!data.userEmail) {
      utilService.TE("Invaid Email", "");
    }

    userByEmail = await getByEmail(data.userEmail);
    console.log("userByEmail:", userByEmail);
    if (!userByEmail) {
      utilService.TE("Invaid Email", "userEmail=" + data.userEmail);
    }
    if (userByEmail.password != data.password) {
      utilService.TE("Invaid Email/Password", "userEmail=" + data.userEmail);
    }

    return utilService.ReS(res, {
      token: userByEmail.getJWT(),
      user: userByEmail.toWeb(),
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

const verify = async function (req, res) {
  try {
    const body = req.body;
    let err, userByEmail, tokenCode, id;
    let data = body;
    if (body.data) {
      data = body.data;
    }
    if (data.tokenCode) {
      tokenCode = data.tokenCode;
    } else {
      utilService.TE("Token code is null", "");
    }
    if (data.id) {
      id = data.id;
    } else {
      utilService.TE("ID not provided", "");
    }
    if (data.userEmail) {
      userByEmail = data.userEmail;
    } else {
      utilService.TE("Email not provided", "");
    }

    var whereClause = {};
    whereClause["id"] = id;
    // whereClause["userEmail"] = userByEmail;
    // whereClause["tokenCode"] = tokenCode;
    var userDb = null;
    var affectedRows = 0;
    console.info("\nverification whereClause", whereClause);
    [err, userDb] = await to(Users.findOne({ where: whereClause }));
    console.info("users found while verifying=", userDb);
    console.info(" error found while verifying=", err);
    console.log("\n");
    if (err) {
      return utilService.ReE(res, "Not found", 500);
    }
    if (!userDb) {
      return utilService.ReE(res, "Not found", 500);
    }
    var userDbData = userDb.dataValues;

    if (!userDbData) {
      return utilService.ReE(res, "Not found", 500);
    }
    var isEmailMatched =
      userDbData.tokenCode && tokenCode && userDbData.tokenCode == tokenCode;
    if (isEmailMatched) {
      console.info(">>>token matched:" + userDbData.tokenCode);
      userDb.status = 2;
      // userDb.emailVerifiedAt = new Date();
      if (data.emailVerifiedAt) {
        userDb.emailVerifiedAt = data.emailVerifiedAt;
      }
    } else {
      console.info(">>>token not matched:" + userDbData.tokenCode);
      userDb.status = 1;
      userDb.emailVerifiedAt = "";
    }
    console.info(">>before update:" + userDbData.id);
    [err, userDbData] = await to(userDb.save());
    if (err) {
      return utilService.ReE(res, err, 500);
    }
    if (!isEmailMatched) {
      return utilService.ReE(res, "Not Varified", 500);
    }
    // userDbData = await update(userDbData, userDbData, res);

    userDbData.password = "";
    userDbData.tokenCode = "";

    return utilService.ReS(
      res,
      {
        user: userDbData,
      },
      200
    );
  } catch (err) {
    console.info("************err= in user verify", err);
    return utilService.ReE(res, err, 500);
  }
};
module.exports.verify = verify;

const save = async function (req, res) {
  const reqInupt = req.body;
  try {
    var users = null;
    if (!reqInupt) {
      reqInupt = req;
    }
    const id = reqInupt.id;

    console.info("************reqInupt: ", reqInupt);

    if (id) {
      [err, users] = await to(Users.findOne({ where: { id: id } }));
      if (err) utilService.TE(err.message, true);
      console.info("************users found=" + users);
    }
    var userByEmail = await getByEmail(reqInupt.userEmail);
    console.log("userByEmail:", userByEmail);
    if (userByEmail) {
      if (!id) {
        utilService.TE(
          "Email already taken",
          "userEmail=" + reqInupt.userEmail
        );
      }
    }
    if (!users) {
      return create(reqInupt, res);
    } else {
      return update(reqInupt, users, res);
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
    var users;
    const id = reqInupt.id;

    if (id) {
      return ReE(res, "cannot create new for id=" + id);
    }
    var users = Users.build({
      userPhoneno: utilService.encodeUTF8(reqInupt.userPhoneno),
      userCity: utilService.encodeUTF8(reqInupt.userCity),
      userLname: utilService.encodeUTF8(reqInupt.userLname),
      userAdminId: utilService.encodeUTF8(reqInupt.userAdminId),
      userCountry: utilService.encodeUTF8(reqInupt.userCountry),
      userStreetno: utilService.encodeUTF8(reqInupt.userStreetno),
      userState: utilService.encodeUTF8(reqInupt.userState),
      id: utilService.encodeUTF8(reqInupt.id),
      userStreetname: utilService.encodeUTF8(reqInupt.userStreetname),
      userEmail: utilService.encodeUTF8(reqInupt.userEmail),
      userFname: utilService.encodeUTF8(reqInupt.userFname),
      password: utilService.encodeUTF8(reqInupt.password),
      tokenCode: utilService.encodeUTF8(reqInupt.tokenCode),
      address: utilService.encodeUTF8(reqInupt.address),
      emailVerifiedAt: utilService.encodeUTF8(reqInupt.emailVerifiedAt),
      localTimestampCreated: utilService.encodeUTF8(
        reqInupt.localTimestampCreated
      ),
      localTimestampUpdated: utilService.encodeUTF8(
        reqInupt.localTimestampUpdated
      ),
      status: utilService.encodeUTF8(reqInupt.status),
      userZipcode: utilService.encodeUTF8(reqInupt.userZipcode),
    });

    [err, users] = await to(users.save());
    if (err) utilService.TE("error:" + err);
    console.info("users.id=" + users.id);
    return ReS(
      res,
      {
        users: users,
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

const update = async function (reqInupt, users, res) {
  try {
    const id = reqInupt.id;

    if (!users || !users.id) return ReE(res, "cannot save new for id=" + id);

    if (reqInupt.userPhoneno) {
      users.userPhoneno = utilService.encodeUTF8(reqInupt.userPhoneno);
    }
    if (reqInupt.userCity) {
      users.userCity = utilService.encodeUTF8(reqInupt.userCity);
    }
    if (reqInupt.userLname) {
      users.userLname = utilService.encodeUTF8(reqInupt.userLname);
    }
    if (reqInupt.userAdminId) {
      users.userAdminId = utilService.encodeUTF8(reqInupt.userAdminId);
    }
    if (reqInupt.address) {
      users.address = utilService.encodeUTF8(reqInupt.address);
    }
    if (reqInupt.emailVerifiedAt) {
      users.emailVerifiedAt = utilService.encodeUTF8(reqInupt.emailVerifiedAt);
    }
    if (reqInupt.localTimestampUpdated) {
      users.localTimestampUpdated = utilService.encodeUTF8(
        reqInupt.localTimestampUpdated
      );
    }
    if (reqInupt.localTimestampCreated) {
      users.localTimestampCreated = utilService.encodeUTF8(
        reqInupt.localTimestampCreated
      );
    }
    if (reqInupt.tokenCode) {
      users.tokenCode = utilService.encodeUTF8(reqInupt.tokenCode);
    }
    if (reqInupt.userCountry) {
      users.userCountry = utilService.encodeUTF8(reqInupt.userCountry);
    }
    if (reqInupt.userStreetno) {
      users.userStreetno = utilService.encodeUTF8(reqInupt.userStreetno);
    }
    if (reqInupt.userState) {
      users.userState = utilService.encodeUTF8(reqInupt.userState);
    }
    if (reqInupt.id) {
      users.id = utilService.encodeUTF8(reqInupt.id);
    }
    if (reqInupt.userStreetname) {
      users.userStreetname = utilService.encodeUTF8(reqInupt.userStreetname);
    }
    if (reqInupt.userEmail) {
      users.userEmail = utilService.encodeUTF8(reqInupt.userEmail);
    }
    if (reqInupt.userFname) {
      users.userFname = utilService.encodeUTF8(reqInupt.userFname);
    }
    if (reqInupt.status) {
      users.status = utilService.encodeUTF8(reqInupt.status);
    }
    if (reqInupt.userZipcode) {
      users.userZipcode = utilService.encodeUTF8(reqInupt.userZipcode);
    }
    if (reqInupt.password) {
      users.password = utilService.encodeUTF8(reqInupt.password);
    }
    console.info("************saving existing=");
    [err, users] = await to(users.save());
    if (err) utilService.TE("error:" + err);

    return ReS(
      res,
      {
        users: users,
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
  let id, err, users;
  id = req.params.id;
  if (id) {
    [err, users] = await to(Users.findOne({ where: { id: id } }));
    if (err) return ReE(res, "err finding users");
    if (!users) return ReE(res, "users not found with id: " + id);
    return ReS(res, { users: users.toWeb() });
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
      Users.findAndCountAll({
        where: whereClause,
        order: [[sortIndex, sortDirection]],
        limit: [pageNumber * pageSize, pageSize],
      })
    );
    if (!rows || !rows.count) return ReE(res, "Users(s) not found", 500);
  } else {
    [count, rows] = await to(
      Users.findAndCountAll({
        where: whereClause,
        order: [[sortIndex, sortDirection]],
      })
    );
    if (!rows || !rows.count) return ReE(res, "Users(s) not found", 500);
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

  [err, users] = await to(Users.findOne({ where: whereClause }));
  console.info(id + "::users=" + users);
  if (users) {
    return users;
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
  whereClause["userEmail"] = userEmail;

  [err, users] = await to(Users.findOne({ where: whereClause }));
  console.info(userEmail + "::users=" + users);
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
  if (object.userPhoneno) {
    whereClause["userPhoneno"] = object.userPhoneno;
  }
  if (object.userCity) {
    whereClause["userCity"] = object.userCity;
  }
  if (object.userLname) {
    whereClause["userLname"] = object.userLname;
  }
  if (object.userAdminId) {
    whereClause["userAdminId"] = object.userAdminId;
  }
  if (object.address) {
    whereClause["address"] = object.address;
  }
  if (object.emailVerifiedAt) {
    whereClause["emailVerifiedAt"] = object.emailVerifiedAt;
  }
  if (object.localTimestampUpdated) {
    whereClause["localTimestampUpdated"] = object.localTimestampUpdated;
  }
  if (object.localTimestampCreated) {
    whereClause["localTimestampCreated"] = object.localTimestampCreated;
  }
  if (object.tokenCode) {
    whereClause["tokenCode"] = object.tokenCode;
  }
  if (object.userCountry) {
    whereClause["userCountry"] = object.userCountry;
  }
  if (object.userStreetno) {
    whereClause["userStreetno"] = object.userStreetno;
  }
  if (object.userState) {
    whereClause["userState"] = object.userState;
  }
  if (object.id) {
    whereClause["id"] = object.id;
  }
  if (object.userStreetname) {
    whereClause["userStreetname"] = object.userStreetname;
  }
  if (object.userEmail) {
    whereClause["userEmail"] = object.userEmail;
  }
  if (object.userFname) {
    whereClause["userFname"] = object.userFname;
  }
  if (object.status) {
    whereClause["status"] = object.status;
  }
  if (object.userZipcode) {
    whereClause["userZipcode"] = object.userZipcode;
  }

  return whereClause;
}
