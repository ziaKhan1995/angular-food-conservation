const { TE, to } = require("../services/util.service");

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define(
    "ProductCategory",
    {
      prodCatName: { type: DataTypes.STRING, field: "Prod_Cat_Name" }
    },
    { tableName: "Product_Category", timestamps: false }
  );

  Model.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return Model;
};
