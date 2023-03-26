export var endpoints = {
	//admins api's

	admin_save: 'administrator/save',
	admin_login: 'administrator/login',

	//user (sellers and buyers) api's
	user_save: 'users/save',
	users_list_post: 'users/list_post',
	users_login: "users/login",
	users_verify: "users/verify",
	auction_userPurchaseHistory:'auction/userPurchaseHistory',
	auction_saleHistory:'auction/saleHistory',
	auction_auctionAllBids:'auction/auctionAllBids',

	//auctions api's
	auction_save: 'auction/save',
	auction_list_post: 'auction/list_post',
	auction_set_status_post: 'auction/set_status_post',
	auction_updateStatuses: 'auction/updateStatuses',
	//bid_list_post: 'bid/list_post',

	//bid api's
	bid_save:'bid/save',
	bid_list_post:'bid/list_post',

	//product categ
	productcategory_list_post:'productcategory/list_post',
	//feedback
	feedback_save:'feedback/save',
	feedback_list_post:'feedback/list_post',
	
	//images
	mediaSave: 'media/saveimg',
	notification: {
		contactUs: 'your contacing api',
		send_code: 'your code api',

	},
}