
function PushNotification(actionId, title, message, repeatCount,
	repeatIntervalInMinutes, typeId, sendTargetTypeId, landingScreenId,
	sendingMediaTypeId) {
	this.actionId = actionId;
	this.title = title;
	this.message = message;
	this.repeatCount = repeatCount;
	this.repeatIntervalInMinutes = repeatIntervalInMinutes;
	this.typeId = typeId;
	this.sendTargetTypeId = sendTargetTypeId;
	this.landingScreenId = landingScreenId;
	this.sendingMediaTypeId = sendingMediaTypeId;
}


let PUSH_NOTIFICATION = {}

PUSH_NOTIFICATION.FORGOT_PASSWORD = new PushNotification(1, "FCWR forgot password",
	"You have requested to reset your password on FCWR app. Kindly use the following password to log in to the app.",
	1, 0, 1, 1, 1, 2);


PUSH_NOTIFICATION.USER_LOGGIN = new PushNotification(2, "FCWR User Login", "You login on FCWR app<<LOGINTIME>>.", 1, 0, 1, 1, 1, 2);
PUSH_NOTIFICATION.BUSINESS_INCOMPLETE = new PushNotification(3, "Incomplete business detail", "please complete your business detail.", 3, 1440, 2, 1, 2, 2);
PUSH_NOTIFICATION.SEND_EMAIL_SALE_TO_BUSINESS_OWNER = new PushNotification(4, "FCWR New Sale", "New sale done.", 1, 0, 1, 1, 2, 2);
PUSH_NOTIFICATION.SEND_EMAIL_SALE_TO_CUSTOMER = new PushNotification(5, "FCWR New Sale", "new sale done.", 1, 0, 1, 1, 2, 2);
PUSH_NOTIFICATION.SEND_EMAIL_RECEVIE_MONEY_TO_BUSINESS_OWNER = new PushNotification(6, "FCWR Receive", "Receive money.", 1, 0, 1, 1, 2, 2);
PUSH_NOTIFICATION.SEND_EMAIL_RECEVIE_MONEY_TO_CUSTOMER = new PushNotification(7, "FCWR Receive", "Receive money.", 1, 0, 1, 1, 2, 2);
PUSH_NOTIFICATION.CONTACT_US = new PushNotification(8, "Contact us", "Contact us.", 1, 0, 1, 1, 2, 2);
PUSH_NOTIFICATION.PAYMENT_FROM_CUSTOMER_REMINDER = new PushNotification(9, "Payment reminder", "You need to collect payment from <<CUSTOMER_COUNT>>", 1, 0,
	4, 1, 3, 1);
PUSH_NOTIFICATION.STOCK_REMINDER = new PushNotification(10, "Stock reminder", " The product <<PRODUCT_NAME>>", 1, 0, 4, 1, 4, 1);
PUSH_NOTIFICATION.SALE = new PushNotification(11, "Sale reminder",
	" No Sale from <<DAYS>>, add sale. if sale added goto sync settings menu->Sync all to secure/backup your data",
	1, 0, 4, 1, 1, 1);
PUSH_NOTIFICATION.PAYMENT_TO_SUPPLIER_REMINDER = new PushNotification(12, "Payable reminder", "You need to pay to <<SUPPLIER_NAME>>", 1, 0, 4, 1, 3, 1);
PUSH_NOTIFICATION.DAILY_SALE_SUMMARY = new PushNotification(13, "Sale summary", "Today sale: <<TODAY_SALE>>", 1, 0, 4, 1, 5, 1);
PUSH_NOTIFICATION.DAIL_SALE_REMINDER = new PushNotification(14, "Add sale", "You can add your <<TODAY>> sale now", 1, 0, 4, 1, 2, 1);
PUSH_NOTIFICATION.BUSINESS_INFO = new PushNotification(15, "Business info", "Business info.", 1, 0, 1, 1, 2, 2);

PUSH_NOTIFICATION.SERVER_ERROR = new PushNotification(16, "Server error", "Server error", 1, 0, 1, 1, 2, 2);
PUSH_NOTIFICATION.APP_ERROR = new PushNotification(17, "App error", "App error", 1, 0, 1, 1, 2, 2);

PUSH_NOTIFICATION.EMAIL_VERIFY_CODE = new PushNotification(18, "Email verification code",
	"Your email verification code:",
	1, 0, 1, 1, 1, 2);


module.exports = PUSH_NOTIFICATION;


/**
 *
 * public static enum NOTIFICATION_TYPE {
		SERVICE(1), INCOMPETE_INFO(2), REPEAT_SCHEDULE(3),

		//   e.g daily 10,18 hours local time,

		DAILY_SPCIFIC_HOURS_SCHEDULE(4),
		//   e.g SUNDAY, FRIDAY : 10 hour local time,
		WEEK_DAYS_SPCIFIC_HOURS_SCHEDULE(5),
		GET_QUOTE_BYCUSTOMER(5);

	}

	public static enum SEND_TARGET_TYPE {
		SINGLE(1),

		BUSINESS_ALL_USERS(2),

		BUSINESS_ALL_CUSTOMERS(3),

		BUSINESS_ALL_USERS_EXCEPT_BUSINESS_OWNER(4),
		TO_ADMINS(5);;

	}

	public static enum LANDING_SCREEN {
		LOGIN(1), HOME(2), PAYMENT_REMINDER(3), STOCK_REMINDER(4), PROFIT(5),
		 NO-LANDING-SCREEN(6);

	}

	public static enum SENDING_MEDIA_TYPE_ID {
		PUSH_FIREBASE_APNS(1),
		EMAIL(2);


	}
 */

