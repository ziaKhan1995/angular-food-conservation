const { TE, to } = require("../services/util.service");

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define(
    "Auction",
    {
      aucWinnerFname: { type: DataTypes.STRING, field: "Auc_Winner_FName" },
      aucPaymentAmount: {
        type: DataTypes.BIGINT(22),
        field: "Auc_Payment_Amount",
      },
      minBidIncrement: {
        type: DataTypes.BIGINT(22),
        field: "Min_Bid_Increment",
      },
      sellerId: { type: DataTypes.BIGINT(22), field: "Seller_ID" },
      quantity: { type: DataTypes.BIGINT(22), field: "Quantity" },
      prodDescription: { type: DataTypes.STRING, field: "Prod_Description" },
      aucCloseDate: { type: DataTypes.STRING, field: "Auc_Close_Date" },
      aucPaymentDate: { type: DataTypes.STRING, field: "Auc_Payment_Date" },
      prodCatId: { type: DataTypes.BIGINT(22), field: "Prod_Cat_ID" },
      aucWinnerLname: { type: DataTypes.STRING, field: "Auc_Winner_LName" },
      prodStartBidAmount: {
        type: DataTypes.BIGINT(22),
        field: "Prod_Start_Bid_Amount",
      },
      prodName: { type: DataTypes.STRING, field: "Prod_Name" },
      aucStartDate: { type: DataTypes.STRING, field: "Auc_Start_Date" },
      auctionFinishDate: { type: DataTypes.STRING, field: "Auction_Finish_Date" },
      aucReservePrice: {
        type: DataTypes.BIGINT(22),
        field: "Auc_Reserve_Price",
      },

      status: { type: DataTypes.STRING, field: "STATUS" },
    },
    { tableName: "Auction", timestamps: false }
  );

  Model.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return Model;
};
