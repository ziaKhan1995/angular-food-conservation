const { TE, to } = require("../services/util.service");
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/config");
const utilService = require("../services/util.service");

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define(
    "Users",
    {
      userPhoneno: { type: DataTypes.STRING, field: "User_PhoneNo" },
      userCity: { type: DataTypes.STRING, field: "User_City" },
      userLname: { type: DataTypes.STRING, field: "User_LName" },
      userAdminId: { type: DataTypes.BIGINT(22), field: "Admin_ID" },
      userCountry: { type: DataTypes.STRING, field: "User_Country" },
      userStreetno: { type: DataTypes.BIGINT(22), field: "User_StreetNo" },
      userState: { type: DataTypes.BIGINT(22), field: "User_State" },
      tokenCode: { type: DataTypes.BIGINT(22), field: "Token_Code" },
      userStreetname: { type: DataTypes.STRING, field: "User_StreetName" },
      userEmail: { type: DataTypes.STRING, field: "User_Email" },
      userFname: { type: DataTypes.STRING, field: "User_FName" },
      userZipcode: { type: DataTypes.BIGINT(22), field: "User_Zipcode" },
      password: { type: DataTypes.STRING, field: "password" },
      address: { type: DataTypes.STRING, field: "address" },
      emailVerifiedAt: { type: DataTypes.STRING, field: "Email_Verified_Date" },
      localTimestampCreated: { type: DataTypes.STRING, field: "local_timestamp_created" },
      localTimestampUpdated: { type: DataTypes.STRING, field: "local_timestamp_updated" },

      status: { type: DataTypes.STRING, field: "STATUS" },
    },
    { tableName: "Users", timestamps: false }
  );

  Model.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  Model.prototype.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return (
      "Bearer " +
      jwt.sign({ id: this.id, email: this.userEmail }, CONFIG.jwt_encryption, {
        expiresIn: expiration_time,
      })
    );
  };

  return Model;
};
