export const SMALL_SCREEN_SIZE = 768;
export const DEFAULT_IMAGE = "assets/camera.png";
export const DEFAULT_USER_IMAGE = "assets/user.png";
export const LOADER = "assets/loading.gif";
export const NOT_FOUND_IMAGE = "assets/error-image.png";
export const LARGE_LOADER = "assets/largeLoader.gif";
export const ERROR_MESSAGE = "An error occurred";
export const ERROR_MESSAGE_TRY_LATER = "An error occurred. Please ty again later";

export const DESC_HINTS = "A precise description stand out. It should " +
	"be short and to the point. " +
	"Don't waste your time coming up with multiple paragraphs because bidders simply " +
	"will not read them.";
export const CONTENTS = "FC&Wr is the best place to sell and buy surplus food on bidding to avoid big losses";

//function to avoid wrong digit input
export function onInputKeyDown(e: any,showConsole?:boolean): void {
	if(showConsole==true){
		console.log('key pressed',e);
	}
	if (!e) { return; }
	if ((e.code === 'Minus' && e.keyCode == 189 && e.key === '-') ||
		(e.keyCode == 187 && e.key === '+') ||
		(e.code === 'KeyE' && e.keyCode == 69 && e.key === 'e') ||
		(e.code == "NumpadSubtract" && e.key == '-' && e.keyCode == 109) ||
		(e.code == "NumpadAdd" && e.key == '+' && e.keyCode == 107) ||
		(e.code == "NumpadDivide" && e.key == '/' && e.keyCode == 111) ||
		(e.code == "NumpadMultiply" && e.key == '*' && e.keyCode == 106)
	) {
		e.preventDefault();
	}
}

/*
No.0 usER*****************
*/
//function to set status value for ANY USER against
export const USER_STATUS = {
	USER_CREATED_BUT_NOT_VERIFIED_STATUS:1,
	USER_CREATED_AND_VERIFIED_STATUS:2,
	USER_AUCTION_VIOLETION_STATUS:3,
	USER_BIDDING_VIOLETION_STATUS:4,
};

/*
No.1 PURCHASER*****************
*/
//function to set status value for puchaser against any bid
export const PURCHASER_BID_STATUS = {
	BID_INITIAL_PLACED_STATUS: 1,
	BID_CHECKOUT_CONFIRMED_BY_PURCHASER_STATUS: 3,
	BID_NOT_APPROVED_BY_SELLER_STATUS: 4,
	BID_DISAPPROVED_BY_ADMIN_STATUS: 5,
	BID_SOMETHING_ELSE_ERROR_STATUS: 6,
};
//function to set status value for puchaser feedback 
//against an auction item purchased
export const PURCHASER_FEEDBACK_STATUS = {
	FEEDBACK_INITIAL_PLACED_STATUS: 1,
	FEEDBACK_MODIFIED_STATUS: 2,
	FEEDBACK_REJECTED_BY_ADMIN_STATUS: 3,
	FEEDBACK_NORMAL_STATUS: 4,
	FEEDBACK_VALUEABLE_STATUS: 5,
	FEEDBACK_SOMETHING_ELSE_STATUS: 6,
};
//Color for [[ PURCHASER ]] status of auction bid 
export function getBidColorByCode(code): any {
	if (code == 1) {
		return "#444";//grey-like color
	}
	if (code == 2) {
		return "#1a73e8";//blue,case when bid approved by seller and you have to checkout
	}
	if (code == 3) {
		return "#23ad5c";//green, you won after checkout
	}
	if (code == 4 || code==5) {
		return "red";//disapproved by admin or seller
	}
	return "initial";
}
//Text for [[ PURCHASER ]] status of auction bid
export function getBidTextByCode(code): any {
	if (code == "1") {
		return "Waiting/pending"; //wait for admin to verify
	}
	if (code == "2") {
		return "Congrats! You win. click to proceed";//admin accepted your bid from all
	}
	if (code == "3") {
		return "You won this item";//you won after checkout
	}
	if (code == "4") {
		return "Not Approved";//disapproved by seller
	}
	if (code == "5") {
		return "Bid cancelled by admin";//disapproved by admin
	}
	return "";
}
//get emoji for [[ PURCHASER ]] auction bid
export function getBidEmojirByCode(code) {
	if (code == "1") {
		return "query_builder";//pending icon
	}
	if (code == "2") {
		return "sentiment_satisfied_alt";//smily emoji
	}
	if (code == "3") {
		return "sentiment_satisfied_alt";//smily emoji
	}
	if (code == "4" || code == "5") {
		return "sentiment_very_dissatisfied";//sad emoji
	}
	return "info_outline";
}
//Text for [[ PURCHASER as buyer/bidder ]] status
export function getBuyerTextByCode(code): any {
	if (code == "1") {
		return " Okay, No violations"; //
	}
	if (code == "2") {
		return "Auction violetions"; //
	}
	if (code == "3") {
		return "Biddding violetions"; //
	}
	return "";
}

/*
No.2 SELLER*********************************

This fuction tell [[ SELLER ]] about a specfic bid(from bids table of an 
 auction) details against an auction */
export const SELLER_AUCTION_STATUS = {
	AUCTION_NEW_CREATED_AND_IN_BIDDING_STATUS: 1,//CREATED AND PLACED FOR BIDDING
	AUCTION_BID_APPROVED_AND_BUYER_HAS_NOT_PAID_STATUS: 2,//bid approved but not paid by buyer
	AUCTION_SOLD_STATUS: 3,//sold, buyer has piad/checkout confirmed
	AUCTION_EXPIRED_STATUS: 4,//unsold within due date
	AUCTION_DISAPPROVED_BY_ADMIN_STATUS: 5,
	AUCTION_DELETED_BY_SELLER_STATUS: 6,
	AUCTION_SOMETHING_ELSE_ERROR_STATUS: 7,
};
export const SELLER_AUCTION_BID_STATUS = {
	AUCTION_BID_APPROVED_AND_CHECKOUT_PENDING_STATUS:2,
	//AUCTION_BID_ACCEPTED_AND_BUYER_HAS_PAID_STATUS:3,
	AUCTION_BID_ACCEPTED_BUT_BUYER_HAS_NOT_PAID_STATUS:4,
	AUCTION_BID_DISAPPROVED_BY_ADMIN_STATUS:5,
	AUCTION_BID_SOMETHING_ELSE_ERROR_STATUS: 6,
};
export function getBidActionTextByStatus(code) {
	if (code == 1) {
		return "Click to approve";
	}
	if (code == 2) {
		return "Approved. Bidder Checkout Pending";
	}
	if (code == 3) {
		return "Bid accepted and buyer has paid";
	}
	if (code == 4) {
		return "A bid is already accepted";
	}
	if (code == 5) {
		return "Bid Accepted but buyer has not paid";
	}
	if (code == 6) {
		return "Bid disapproved by admin";
	}
	return "";
}

//Text for SELLER status of auction
export function auctionStatus(code) {
	if (code == 1) {
		return "In bidding";//currently in bidding 
	}
	if (code == 2) {
		return "Bid Approved";//sonly bid approved but buyer has not paid
	}
	if (code == 3) {
		return "Sold";//sold within due date
	}
	if (code == 4) {
		return "Expired(Unsold within due date)";//not sold within due date
	}
	if (code == 5) {
		return "Disapproved by Admin";
	}
	if (code == 6) {
		return "Deleted by seller";
	}
	return "";
}

/*
No.3 ADMIN*************************************
*/
export function getAdminActionTextByCode(code){

}