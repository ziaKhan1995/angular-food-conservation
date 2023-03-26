const express = require("express");
const router = express.Router();
const custom = require("./../middleware/custom");

const passport = require("passport");
const path = require("path");
const CONFIG = require("../config/config");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // callback(null, 'D:\\akbar\\readingmine\\uploads\\');
    var uploadPath = CONFIG.UPLOADS_PATH;
    if (!uploadPath) {
      uploadPath = your_uploads_path;
    }
    console.info("uploadPath=========" + uploadPath);
    callback(null, uploadPath);
  },
  filename: function (req, file, callback) {
    // callback(null, file.fieldname + '-' + Date.now()+'.jpeg');
    callback(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

require("./../middleware/passport")(passport);
/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({
    status: "success",
    message: "Parcel Pending API",
    data: { version_number: "v1.0.0" },
  });
});

//********* API DOCUMENTATION **********
router.use(
  "/docs/api.json",
  express.static(path.join(__dirname, "/../public/v1/documentation/api.json"))
);
router.use(
  "/docs",
  express.static(path.join(__dirname, "/../public/v1/documentation/dist"))
);
module.exports = router;

//router.get('/dash', passport.authenticate('jwt', { session: false }), HomeController.Dashboard)

const AdministratorController = require("../controllers/administrator.controller");

const UsersController = require("../controllers/users.controller");

const ProductCategoryController = require("../controllers/productcategory.controller");
//  const ProductController = require('../controllers/product.controller');
const AuctionController = require("../controllers/auction.controller");
const FeedbackController = require("../controllers/feedback.controller");
const BidController = require("../controllers/bid.controller");
/*CONTROLLER-IMPORT*/

router.post("/administrator/save", AdministratorController.save);
router.post("/administrator/list_post", AdministratorController.get);
router.post("/administrator/login", AdministratorController.login);

router.post("/users/save", UsersController.save);
router.post("/users/list_post", UsersController.get);
router.post("/users/login", UsersController.login);
router.post("/users/verify", UsersController.verify);

router.post("/productcategory/save", ProductCategoryController.save);
router.post("/productcategory/list_post", ProductCategoryController.get);

//  router.post('/product/save', ProductController.save);
// router.post('/product/list_post', ProductController.get);

router.post("/auction/save", AuctionController.save);
router.post("/auction/list_post", AuctionController.get);
router.get("/auction/userPurchaseHistory", AuctionController.getUserPurchaseHistory);
router.get("/auction/saleHistory", AuctionController.getSaleHistory);
router.get("/auction/auctionAllBids", AuctionController.getAuctionAllBids);
//router.get("/auction/getLastItem", AuctionController.getLastAuctionItem);
 router.get("/auction/updateStatuses", AuctionController.updateAllAuctionsStatusesWhenDateIsOver);
// router.get("/auction/updateBidStatuses", AuctionController.updateBidStatuses);


router.post("/feedback/save", FeedbackController.save);
router.post("/feedback/list_post", FeedbackController.get);

router.post("/bid/save", BidController.save);
router.post("/bid/list_post", BidController.get);

/*ROUTES-END*/
