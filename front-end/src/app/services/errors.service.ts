import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2'
//import { HTTP_UNAUTHORIZED_STATUS,HTTP_ERR_SESSION_EXPIRED, HTTP_ERR_SERVER_DOWN } from '../constants/http.status.codes';

@Injectable({ providedIn: 'root' })
export class ErrorsService {


	constructor() {
	}

	emitErrorMessage(err: any) {
		var msg: any = {};
		msg['type'] = 'ERROR';
		if (!err) {
			msg['message'] = 'Uknown Error';
			msg['title'] = 'Error';
			Swal.fire(msg['title'], msg['message'], 'error');
			return;
		}
		console.log('err.status', err.status);
		if (err.status != null && err.status == '0') {
			msg['title'] = 'You are Offline';
			msg['message'] = 'Check Your Internet Connection';
			Swal.fire(msg['title'], msg['message'], 'error');
			return;
		}
		// if (err.status == HTTP_UNAUTHORIZED_STATUS && err.error && err.error.AuthenticationException) {
		// 	Swal.fire('Error', err.error.AuthenticationException, 'error');
		// 	return;
		// }
		try {
			console.log('emitErrorMessage::', err);
		} catch (e) {

		}

		msg['title'] = "Error";
		if (err.message) {
			msg['message'] = err.message;
		}
		if (err.error && err.error.error) {
			msg['message'] = err.error.error;
		}

		if (err.error && err.error.message) {
			msg['message'] = err.error.message;
		}
		if (err.error && err.error.length > 0) {
			msg['message'] = err.error[0].response;
		}

		if (msg['message'] == null && err.code && err.response) {
			msg['message'] = err.code + err.response;
		} else if (msg['message'] == null && err) {
			msg['message'] = err;
		}

		Swal.fire(msg['title'], msg['message'], 'error');

	}
	emitPlainErrorMessage(err: any) {
		var msg: any = {};
		msg['type'] = 'error';
		msg['title'] = "Error";
		msg['message'] = err;
		//   console.log(" messageEmitter called for message ::: "+msg);
		Swal.fire(msg['title'], msg['message'], msg['type']);

	}

	emitSuccessMessage(message: any) {
		var msg: any = {};
		msg['type'] = 'success';
		msg['TITLE'] = "SUCCESS";
		msg['message'] = message;
		Swal.fire(msg['title'], msg['message'], msg['type']);
	}

	emitWariningMessage(message: any) {
		var msg: any = {};
		msg['type'] = 'warning';
		msg['TITLE'] = "WARNING";
		msg['message'] = message;
		Swal.fire(msg['title'], msg['message'], msg['type']);
	}
	emitImageError(url){
		Swal.fire({
			imageUrl: url,
			imageAlt: 'The uploaded picture',
			showConfirmButton:false
		  })
	}
	handleErrorShowErrorMsg(error: any) {
		console.log('error::', error);
		if (!error) {
			return;
		}
		this.handleErrorStatus(error.status);
		this.emitErrorMessage(error);
	}
	handleErrorShowErrorMsgWithTopError(error: any) {
		console.log('error::', error);
		if (!error) {
			return;
		}
		this.handleErrorStatus(error.status);
		this.emitErrorMessage(error);
	}

	handleErrorUndefinedShowErrorMsgWithTopError() {
		this.handleErrorStatus(403);
		this.emitErrorMessage("Unknown Error");
	}

	handleErrorShowStatusMsg(error: any) {
		console.log('error::', error);
		if (!error) {
			return;
		}
		this.handleErrorStatusShowMsg(error.status);
	}

	handleErrorStatus(status: number,) {
		var statusStr = status + '';
		console.log('status::', status);
		if (status == null) {
			//statusStr = HTTP_ERR_SESSION_EXPIRED;
		}


		// if (HTTP_ERR_SERVER_DOWN === statusStr) {
		// 	return;
		// }

	}
	emitWarningMessage(message: any) {
		var msg: any = {};
		msg['type'] = 'warning';
		msg['TITLE'] = "WARNING";
		msg['message'] = message;
		Swal.fire(msg['title'], msg['message'], msg['type']);
	}

	handleErrorStatusShowMsg(status: number) {
		console.log('status::', status);
		this.handleErrorStatus(status);
		this.emitPlainErrorMessage("Error " + status);
	}
	showSwalToastMessage(iconType: SweetAlertIcon, text: string,
		pos?: SweetAlertPosition, _timer?: number) {
		const Toast = Swal.mixin({
			toast: true,
			position: pos ? pos : 'top-end',
			showConfirmButton: false,
			showCloseButton: true,
			timer: _timer ? _timer : 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer)
				toast.addEventListener('mouseleave', Swal.resumeTimer)
			}
		})

		Toast.fire({
			icon: iconType,
			title: text
		});
	}
}