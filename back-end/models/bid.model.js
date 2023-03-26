const { TE, to } = require("../services/util.service");

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define(
    "Bid",
    {
      sellerId: { type: DataTypes.BIGINT(22), field: "Seller_ID" },
      bidTime: { type: DataTypes.TIME, field: "Bid_Time" },
      bidComment: { type: DataTypes.STRING, field: "Bid_Comment" },
      aucId: { type: DataTypes.BIGINT(22), field: "Auc_ID" },
      bidderId: { type: DataTypes.BIGINT(22), field: "Bidder_ID" },
      bidPrice: { type: DataTypes.BIGINT(22), field: "Bid_Price" },
      bidDate: { type: DataTypes.DATE, field: "Bid_Date" },
      bidNumber: { type: DataTypes.BIGINT(22), field: "Bid_Number" },

      status: { type: DataTypes.STRING, field: "STATUS" },
    },
    { tableName: "Bid", timestamps: false }
  );

  Model.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return Model;
};
