const { TE, to } = require("../services/util.service");
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/config");
const utilService = require("../services/util.service");

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define(
    "Administrator",
    {
      adminFname: { type: DataTypes.STRING, field: "Admin_FName" },
      adminLname: { type: DataTypes.STRING, field: "Admin_LName" },
      adminStreetname: { type: DataTypes.STRING, field: "Admin_StreetName" },
      adminPhoneno: { type: DataTypes.BIGINT(22), field: "Admin_PhoneNo" },
      aminZipcode: { type: DataTypes.BIGINT(22), field: "Amin_zipcode" },
      adminState: { type: DataTypes.STRING, field: "Admin_State" },
      adminCountry: { type: DataTypes.STRING, field: "Admin_Country" },
      adminCity: { type: DataTypes.STRING, field: "Admin_City" },
      adminEmail: { type: DataTypes.STRING, field: "Admin_Email" },
      adminStreetno: { type: DataTypes.BIGINT(22), field: "Admin_StreetNo" },
      password: { type: DataTypes.STRING, field: "password" },

      status: { type: DataTypes.STRING, field: "STATUS" },
    },
    { tableName: "Administrator", timestamps: false }
  );

  Model.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  Model.prototype.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return (
      "Bearer " +
      jwt.sign({ id: this.id, email: this.adminEmail }, CONFIG.jwt_encryption, {
        expiresIn: expiration_time,
      })
    );
  };

  return Model;
};
