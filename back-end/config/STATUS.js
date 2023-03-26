
function Status(code, text) {
	this.code = code;
	this.text = text;
}

let STATUS = {} //Make this global to use all over the application

STATUS.SUCCESS = new Status(1,'Success');
STATUS.PENDING = new Status(2,'Pending');
STATUS.DELETED = new Status(3,'Deleted');

STATUS.INCOMPLETE = new Status(501,'INCOMPLETE');

module.exports = STATUS;
