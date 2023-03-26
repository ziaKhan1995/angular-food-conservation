
function Media(code, text) {
	this.code = code;
	this.text = text;
}
let SENDING_MEDIA_TYPE = {};

SENDING_MEDIA_TYPE.PUSH_FIREBASE_APNS = new Media(1, "Firebase");
SENDING_MEDIA_TYPE.EMAIL = new Media(2, "Email");

module.exports = SENDING_MEDIA_TYPE;
