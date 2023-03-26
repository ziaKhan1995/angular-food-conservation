/*
SQLyog Community v12.4.3 (64 bit)
MySQL - 5.7.10-log : Database - fcwr
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`fcwr` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `fcwr`;

/*Table structure for table `Administrator` */

DROP TABLE IF EXISTS `Administrator`;

CREATE TABLE `Administrator` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Admin_FName` varchar(20) NOT NULL,
  `Admin_LName` varchar(20) NOT NULL,
  `Admin_StreetNo` int(11) NOT NULL,
  `Admin_StreetName` varchar(100) NOT NULL,
  `Admin_City` varchar(50) NOT NULL,
  `Admin_State` varchar(20) NOT NULL,
  `Amin_zipcode` int(11) NOT NULL,
  `Admin_Country` varchar(40) NOT NULL,
  `Admin_Email` varchar(40) NOT NULL,
  `Admin_PhoneNo` int(11) NOT NULL,
  `STATUS` int(11) DEFAULT NULL,
  `password` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `Administrator` */

LOCK TABLES `Administrator` WRITE;

insert  into `Administrator`(`ID`,`Admin_FName`,`Admin_LName`,`Admin_StreetNo`,`Admin_StreetName`,`Admin_City`,`Admin_State`,`Amin_zipcode`,`Admin_Country`,`Admin_Email`,`Admin_PhoneNo`,`STATUS`,`password`) values (1,'Zia','Uddin',1,'Stree1','Islamabad','Islamabad',44000,'PK','zia@gmail.com',300000220,1,'1234');

UNLOCK TABLES;

/*Table structure for table `Auction` */

DROP TABLE IF EXISTS `Auction`;

CREATE TABLE `Auction` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Prod_Name` varchar(40) NOT NULL,
  `Seller_ID` int(11) NOT NULL,
  `Auc_Winner_FName` varchar(20) DEFAULT NULL,
  `Auc_Close_Date` varchar(25) NOT NULL,
  `status` int(2) DEFAULT NULL,
  `Auc_Winner_LName` varchar(20) DEFAULT NULL,
  `Auc_Start_Date` varchar(25) NOT NULL,
  `Auc_Reserve_Price` int(11) NOT NULL,
  `Auc_Payment_Date` varchar(25) DEFAULT NULL,
  `Quantity` varchar(100) DEFAULT NULL,
  `Auc_Payment_Amount` int(11) DEFAULT NULL,
  `Prod_Description` varchar(400) DEFAULT NULL,
  `Prod_Start_Bid_Amount` int(11) NOT NULL,
  `Min_Bid_Increment` int(11) DEFAULT NULL,
  `Prod_Cat_ID` int(11) NOT NULL,
  `Auction_Finish_Date` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`ID`,`Prod_Start_Bid_Amount`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;

/*Data for the table `Auction` */

LOCK TABLES `Auction` WRITE;

insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (14,'Coca Cola',2,'faisal','2022-11-06 07:00',3,'zulfiqar','2022-10-27 09:50:00',10500,'2022-10-27 10:10:13',NULL,12000,'This product is available in safe mode and its due date is guaranteed.',11000,NULL,1,NULL);
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (17,'Eggs',2,'arshad','2022-11-11 15:00',3,'Khan','2022-10-30 14:04:00',5000,'2022-11-08 15:11:26',NULL,6000,'This product is available in safe mode and its due date is guaranteed.',5000,NULL,1,NULL);
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (19,'Breads',4,'Zia','2022-11-09 14:54',3,'Khan','2022-10-31 14:54:00',7000,'2022-11-04 12:11:53',NULL,7500,'This product is available in safe mode and its due date is guaranteed',7000,NULL,2,NULL);
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (28,'coca',2,'arshad','2022-11-19 07:00',3,'Khan','2022-11-18 04:55:25',8000,'2022-11-18 05:11:20',NULL,6000,'This product is available in safe mode and its due date is guaranteed.',8000,NULL,1,NULL);
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (49,'Coke',9,'','2022-12-15 14:00',4,'','2022-12-14 22:52',600,'',NULL,NULL,'This product is available in safe mode and its due date is guaranteed.',600,NULL,1,'');
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (51,'ASDFGHJK',4,'arshad','2022-12-23 22:00',3,'Khan','2022-12-23 14:50',780,'2022-12-23T12:45:37.624Z',NULL,1000,'This product is available in safe mode and its due date is guaranteed.',780,NULL,2,'2022-12-23 14:50');
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (52,'Bread',4,'','2023-01-09 00:48',4,'','2022-12-23 18:37',499,NULL,NULL,NULL,'This product is available in safe mode and its due date is guaranteed.',499,NULL,2,'2022-12-30 18:37');
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (53,'qwertyuio',4,'Zia','2022-12-24 02:07',3,'Khan','2022-12-24 02:07',1150,'2022-12-23T21:05:08.473Z',NULL,1260,'This product is available in safe mode and its due date is guaranteed.',1150,NULL,2,'2022-12-24 01:07');
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (55,'qwertyuio',8,'','2022-12-27 11:39',4,'','2022-12-24 01:33',2100,NULL,NULL,NULL,'This product is available in safe mode and its due date is guaranteed.',2100,NULL,2,'2022-12-24 01:33');
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (56,'Olper Milk',10,'','2022-12-27 12:00',4,'','2022-12-25 23:55',5000,NULL,NULL,NULL,'This product is available in safe mode and its due date is guaranteed.',5000,NULL,2,'2022-12-25 23:55');
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (58,'lkjhgfdsa',2,'','2022-12-27 11:15',6,'','2022-12-27 11:13',600,NULL,NULL,NULL,'This product is available in safe mode and its due date is guaranteed.',60,NULL,2,'2022-12-27 11:13');
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (60,'Milk Pack',10,'yousaf','2022-12-30 12:00',3,'jan','2022-12-27 12:24',2000,'2022-12-27T07:26:48.504Z',NULL,2100,'This product is available in safe mode and its due date is guaranteed.',2000,NULL,2,'2022-12-30 12:24');
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (63,'Product',2,'faisal','2022-12-31 02:22',3,'zulfiqar','2022-12-30 10:19',666,'2022-12-30T05:39:37.010Z','200 packs of juice',30,'This product is available in safe mode and its due date is guaranteed.',666,NULL,2,'2023-01-01 10:39');
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (64,'Milk Pack',10,'','2023-01-18 23:17',6,'','2023-01-15 23:22',11000,NULL,'200 bundles each having 10 items',NULL,'This product is available in safe mode and its due date is guaranteed.',11000,NULL,2,NULL);
insert  into `Auction`(`ID`,`Prod_Name`,`Seller_ID`,`Auc_Winner_FName`,`Auc_Close_Date`,`status`,`Auc_Winner_LName`,`Auc_Start_Date`,`Auc_Reserve_Price`,`Auc_Payment_Date`,`Quantity`,`Auc_Payment_Amount`,`Prod_Description`,`Prod_Start_Bid_Amount`,`Min_Bid_Increment`,`Prod_Cat_ID`,`Auction_Finish_Date`) values (65,'Milk Pack',10,'yousaf','2023-01-18 23:15',3,'jan','2023-01-15 23:25',11000,'2023-01-15T18:27:54.339Z','200 bundles each having 10 items',12500,'This product is available in safe mode and its due date is guaranteed.',11000,NULL,2,'2023-01-17 23:27');

UNLOCK TABLES;

/*Table structure for table `Bid` */

DROP TABLE IF EXISTS `Bid`;

CREATE TABLE `Bid` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Bid_Price` int(11) DEFAULT NULL,
  `Bidder_ID` int(11) NOT NULL,
  `Auc_ID` int(11) NOT NULL,
  `Seller_ID` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `Bid_Time` time DEFAULT NULL,
  `Bid_Date` date DEFAULT NULL,
  `Bid_Comment` varchar(200) DEFAULT NULL,
  `Bid_Number` int(11) DEFAULT NULL,
  KEY `id` (`id`),
  KEY `bid_fk_auction` (`Auc_ID`),
  KEY `bid_fk_seller` (`Seller_ID`),
  KEY `bid_fk_bidder` (`Bidder_ID`),
  CONSTRAINT `bid_fk_auction` FOREIGN KEY (`Auc_ID`) REFERENCES `Auction` (`ID`),
  CONSTRAINT `bid_fk_bidder` FOREIGN KEY (`Bidder_ID`) REFERENCES `users` (`ID`),
  CONSTRAINT `bid_fk_seller` FOREIGN KEY (`Seller_ID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

/*Data for the table `Bid` */

LOCK TABLES `Bid` WRITE;

insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (13,12000,4,14,2,4,'15:10:00','2022-10-27','',NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (14,7500,2,19,4,4,'20:10:21','2022-10-31',NULL,NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (15,5000,4,17,2,4,'00:11:26','2022-11-07',NULL,NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (17,6000,8,17,2,3,'00:11:35','2022-11-07',NULL,NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (18,6000,8,28,2,3,'10:11:17','2022-11-18',NULL,NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (19,600,2,49,9,4,'22:12:03','2022-12-14',NULL,NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (20,700,4,49,9,4,'23:12:07','2022-12-14',NULL,NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (25,900,2,51,4,4,'14:58:47','2022-12-23',NULL,NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (26,1000,8,51,4,3,'15:00:32','2022-12-23',NULL,NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (27,1200,8,53,4,4,'01:07:00','2022-12-24','',NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (28,1260,2,53,4,3,'01:08:00','2022-12-24','',NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (30,6000,2,56,10,4,'14:00:00','2022-12-26','',NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (33,600,2,52,4,4,'02:59:00','2022-12-27','',NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (36,500,10,52,4,4,'12:16:00','2022-12-27','',NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (37,2100,9,60,10,3,'12:25:00','2022-12-27','',NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (40,30,4,63,2,3,'10:38:00','2022-12-30','',NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (41,10000,4,65,10,4,'23:25:00','2023-01-15','',NULL);
insert  into `Bid`(`id`,`Bid_Price`,`Bidder_ID`,`Auc_ID`,`Seller_ID`,`status`,`Bid_Time`,`Bid_Date`,`Bid_Comment`,`Bid_Number`) values (42,12500,9,65,10,3,'23:26:00','2023-01-15','',NULL);

UNLOCK TABLES;

/*Table structure for table `Feedback` */

DROP TABLE IF EXISTS `Feedback`;

CREATE TABLE `Feedback` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Fdb_Time` time NOT NULL,
  `Fdb_Date` date NOT NULL,
  `Satisfaction_rating` int(5) DEFAULT NULL,
  `Seller_Cooperation` int(5) NOT NULL,
  `Overall_Rating` int(5) NOT NULL,
  `Seller_ID` int(11) unsigned DEFAULT NULL,
  `Buyer_ID` int(11) DEFAULT NULL,
  `Auc_ID` int(11) NOT NULL,
  `Comments` varchar(100) DEFAULT NULL,
  `status` int(2) DEFAULT NULL,
  `Shipping_Delivery` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fd_fk_seller` (`Seller_ID`),
  KEY `fd_fk_buyyer` (`Buyer_ID`),
  KEY `fd_fk_Auc_ID` (`Auc_ID`),
  CONSTRAINT `fd_fk_Auc_ID` FOREIGN KEY (`Auc_ID`) REFERENCES `Auction` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `Feedback` */

LOCK TABLES `Feedback` WRITE;

insert  into `Feedback`(`ID`,`Fdb_Time`,`Fdb_Date`,`Satisfaction_rating`,`Seller_Cooperation`,`Overall_Rating`,`Seller_ID`,`Buyer_ID`,`Auc_ID`,`Comments`,`status`,`Shipping_Delivery`) values (3,'19:11:49','2022-11-05',5,3,4,4,2,19,'checking for test',1,NULL);
insert  into `Feedback`(`ID`,`Fdb_Time`,`Fdb_Date`,`Satisfaction_rating`,`Seller_Cooperation`,`Overall_Rating`,`Seller_ID`,`Buyer_ID`,`Auc_ID`,`Comments`,`status`,`Shipping_Delivery`) values (4,'06:56:03','2022-11-18',3,3,2,2,8,17,'',1,NULL);

UNLOCK TABLES;

/*Table structure for table `Product` */

DROP TABLE IF EXISTS `Product`;

CREATE TABLE `Product` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Prod_Name` varchar(40) NOT NULL,
  `Prod_Description` varchar(400) NOT NULL,
  `Prod_Start_Bid_Amount` int(11) NOT NULL,
  `Min_Bid_Increment` int(11) DEFAULT NULL,
  `User_ID` int(11) DEFAULT NULL,
  `Prod_Cat_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `product_fk_seller` (`User_ID`),
  KEY `prod_fk_prodcategory` (`Prod_Cat_ID`),
  CONSTRAINT `prod_fk_prodcategory` FOREIGN KEY (`Prod_Cat_ID`) REFERENCES `Product_Category` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `Product` */

LOCK TABLES `Product` WRITE;

UNLOCK TABLES;

/*Table structure for table `Product_Category` */

DROP TABLE IF EXISTS `Product_Category`;

CREATE TABLE `Product_Category` (
  `ID` int(11) NOT NULL,
  `Prod_Cat_Name` varchar(30) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `Product_Category` */

LOCK TABLES `Product_Category` WRITE;

insert  into `Product_Category`(`ID`,`Prod_Cat_Name`) values (1,'Cooked Food');
insert  into `Product_Category`(`ID`,`Prod_Cat_Name`) values (2,'Processed Food');

UNLOCK TABLES;

/*Table structure for table `test` */

DROP TABLE IF EXISTS `test`;

CREATE TABLE `test` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `numbr` int(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `test` */

LOCK TABLES `test` WRITE;

UNLOCK TABLES;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `User_FName` varchar(20) NOT NULL,
  `User_LName` varchar(20) NOT NULL,
  `User_Email` varchar(40) NOT NULL,
  `password` varchar(30) DEFAULT NULL,
  `STATUS` int(11) DEFAULT NULL,
  `User_StreetNo` int(11) NOT NULL,
  `User_StreetName` varchar(100) NOT NULL,
  `User_City` varchar(50) NOT NULL,
  `User_State` int(11) NOT NULL,
  `User_Zipcode` int(11) DEFAULT NULL,
  `User_Country` varchar(40) NOT NULL,
  `User_PhoneNo` varchar(15) NOT NULL,
  `Admin_ID` int(11) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `Token_Code` bigint(20) DEFAULT NULL,
  `Email_Verified_Date` varchar(20) DEFAULT NULL,
  `local_timestamp_created` varchar(20) DEFAULT NULL,
  `local_timestamp_updated` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `users_fk_admin` (`Admin_ID`),
  CONSTRAINT `users_fk_admin` FOREIGN KEY (`Admin_ID`) REFERENCES `Administrator` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

LOCK TABLES `users` WRITE;

insert  into `users`(`ID`,`User_FName`,`User_LName`,`User_Email`,`password`,`STATUS`,`User_StreetNo`,`User_StreetName`,`User_City`,`User_State`,`User_Zipcode`,`User_Country`,`User_PhoneNo`,`Admin_ID`,`address`,`Token_Code`,`Email_Verified_Date`,`local_timestamp_created`,`local_timestamp_updated`) values (2,'Zia','Khan19','ziauddin.khan1233@gmail.com','1234',1,238,'Mansha Yad Road','1',54,NULL,'Pakistan','308958735',NULL,NULL,123,NULL,NULL,NULL);
insert  into `users`(`ID`,`User_FName`,`User_LName`,`User_Email`,`password`,`STATUS`,`User_StreetNo`,`User_StreetName`,`User_City`,`User_State`,`User_Zipcode`,`User_Country`,`User_PhoneNo`,`Admin_ID`,`address`,`Token_Code`,`Email_Verified_Date`,`local_timestamp_created`,`local_timestamp_updated`) values (4,'faisal','zulfiqar','faisal@gmail.com','qwer',1,84,'F-8','1',54,NULL,'Pakistan','3283942',NULL,NULL,0,NULL,NULL,NULL);
insert  into `users`(`ID`,`User_FName`,`User_LName`,`User_Email`,`password`,`STATUS`,`User_StreetNo`,`User_StreetName`,`User_City`,`User_State`,`User_Zipcode`,`User_Country`,`User_PhoneNo`,`Admin_ID`,`address`,`Token_Code`,`Email_Verified_Date`,`local_timestamp_created`,`local_timestamp_updated`) values (8,'arshad','Khan','arshad@gmail.com','1234',1,56,'Mansha Yad Road','1',54,NULL,'Pakistan','32333232',NULL,NULL,0,NULL,NULL,NULL);
insert  into `users`(`ID`,`User_FName`,`User_LName`,`User_Email`,`password`,`STATUS`,`User_StreetNo`,`User_StreetName`,`User_City`,`User_State`,`User_Zipcode`,`User_Country`,`User_PhoneNo`,`Admin_ID`,`address`,`Token_Code`,`Email_Verified_Date`,`local_timestamp_created`,`local_timestamp_updated`) values (9,'yousaf','jan','yousaf@gmail.com','1234',1,5,'Mansha Yad Road','1',54,NULL,'Pakistan','042849242',NULL,NULL,0,NULL,NULL,NULL);
insert  into `users`(`ID`,`User_FName`,`User_LName`,`User_Email`,`password`,`STATUS`,`User_StreetNo`,`User_StreetName`,`User_City`,`User_State`,`User_Zipcode`,`User_Country`,`User_PhoneNo`,`Admin_ID`,`address`,`Token_Code`,`Email_Verified_Date`,`local_timestamp_created`,`local_timestamp_updated`) values (10,'Zia','Khan','ziakhan@gmail.com','1234',1,238,'Mansha Yad Road','1',54,NULL,'Pakistan','034829842',NULL,'G-7/3-4 ',0,NULL,NULL,NULL);
insert  into `users`(`ID`,`User_FName`,`User_LName`,`User_Email`,`password`,`STATUS`,`User_StreetNo`,`User_StreetName`,`User_City`,`User_State`,`User_Zipcode`,`User_Country`,`User_PhoneNo`,`Admin_ID`,`address`,`Token_Code`,`Email_Verified_Date`,`local_timestamp_created`,`local_timestamp_updated`) values (12,'Zia','Khan78','ziauddin@gmail.com','Zoakhan=-0',1,4324,'Mansha Yad Road','1',54,NULL,'Pakistan','3198381',NULL,'G-7/3-4',0,NULL,NULL,NULL);
insert  into `users`(`ID`,`User_FName`,`User_LName`,`User_Email`,`password`,`STATUS`,`User_StreetNo`,`User_StreetName`,`User_City`,`User_State`,`User_Zipcode`,`User_Country`,`User_PhoneNo`,`Admin_ID`,`address`,`Token_Code`,`Email_Verified_Date`,`local_timestamp_created`,`local_timestamp_updated`) values (24,'Zia','Kr','ziauddin.foryou@gmail.com','1234',2,4324,'Mansha Yad Road','1',54,NULL,'Pakistan','03489605703',NULL,'G-7/3-4',47124059,'2022-12-29 22:43','2022-12-29 22:41',NULL);
insert  into `users`(`ID`,`User_FName`,`User_LName`,`User_Email`,`password`,`STATUS`,`User_StreetNo`,`User_StreetName`,`User_City`,`User_State`,`User_Zipcode`,`User_Country`,`User_PhoneNo`,`Admin_ID`,`address`,`Token_Code`,`Email_Verified_Date`,`local_timestamp_created`,`local_timestamp_updated`) values (25,'Akbar','Jan','akbarjan.mcs.j2ee@gmail.com','Akbar=-09',2,4324,'Mansha Yad Road','1',54,NULL,'Pakistan','03015329335',NULL,'G-7/3-4',22585395,'2022-12-30 00:12','2022-12-29 22:47',NULL);

UNLOCK TABLES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
