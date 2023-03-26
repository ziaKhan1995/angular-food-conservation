import { Component, Inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
	selector: 'yes-no-dialog-dialog',
	templateUrl: 'yes-no-dialog.component.html',
	styleUrls: ['yes-no-dialog.component.css']
})
export class YesNoDialogComponent implements OnInit, AfterViewInit,OnDestroy {
	data: any
	constructor(
		private _mdr: MatDialogRef<YesNoDialogComponent>,
		@Inject(MAT_DIALOG_DATA) data: any) {
		if (data) {
			this.data = data;
			console.log('_mdr data passed', this.data);
		}
	}

	ngOnInit() {
   
	}
	ngAfterViewInit() {
	}
	ngOnDestroy(): void {
		
	}
	sayNoAndCloseDialogCancel() {
		this._mdr.close(false);
	}
	sayYesAndCloseDialogCancel() {
		this._mdr.close(true);
	}
	
}
