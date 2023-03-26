
function Status(code, text) {
	this.code = code;
	this.text = text;
}

let EMAIL_VERIFY_STATUS = {} //Make this global to use all over the application

EMAIL_VERIFY_STATUS.SUCCESS = new Status(1, 'Success');
EMAIL_VERIFY_STATUS.PENDING = new Status(2, 'Pending');
EMAIL_VERIFY_STATUS.ERROR = new Status(3, 'Error');

EMAIL_VERIFY_STATUS.DONT_HAVE_EMAIL = new Status(4, 'INCOMPLETE');

EMAIL_VERIFY_STATUS.REMIND_LATER = new Status(5, 'Remind Later');

EMAIL_VERIFY_STATUS.isValid = function (status) {
	if (!status) {
		return false;
	}
	if (status === EMAIL_VERIFY_STATUS.SUCCESS.code
		|| status === EMAIL_VERIFY_STATUS.PENDING.code
		|| status === EMAIL_VERIFY_STATUS.ERROR.code
		|| status === EMAIL_VERIFY_STATUS.DONT_HAVE_EMAIL.code
		|| status === EMAIL_VERIFY_STATUS.REMIND_LATER.code) {
		return true;
	}
	return false;
}
EMAIL_VERIFY_STATUS.isNotValid = function (status) {
	return !this.isValid(status);
}
module.exports = EMAIL_VERIFY_STATUS;


