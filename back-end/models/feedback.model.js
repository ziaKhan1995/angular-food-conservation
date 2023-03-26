const { TE, to } = require("../services/util.service");

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define(
    "Feedback",
    {
      overallRating: { type: DataTypes.BIGINT(22), field: "Overall_Rating" },
      sellerId: { type: DataTypes.BIGINT(22), field: "Seller_ID" },
      shippingDelivery: {
        type: DataTypes.BIGINT(22),
        field: "Shipping_Delivery",
      },
      sellerCooperation: {
        type: DataTypes.BIGINT(22),
        field: "Seller_Cooperation",
      },
      fdbDate: { type: DataTypes.DATE, field: "Fdb_Date" },
      fdbTime: { type: DataTypes.TIME, field: "Fdb_Time" },
      satisfactionRating: {
        type: DataTypes.BIGINT(22),
        field: "Satisfaction_rating",
      },
      buyerId: { type: DataTypes.BIGINT(22), field: "Buyer_ID" },
     aucId: { type: DataTypes.BIGINT(22), field: "Auc_ID" },

      status: { type: DataTypes.STRING, field: "STATUS" },
      comments: { type: DataTypes.BIGINT(22), field: "Comments" }
    },
    { tableName: "Feedback", timestamps: false },
    
  );

  Model.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return Model;
};
