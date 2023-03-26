import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
const defaultColor = '#4caf50';
const heighlightColor = '#46a14a';
@Component({
    selector: 'footer-comp',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {
    loginUser: any;
    @Output() goToTopEventEmit=new EventEmitter<boolean>();
    @Input() position: string = ''
    constructor(
        private router: Router,
        private title: Title,
        private meta: Meta,
    ) {
    }
    ngOnInit() {
        this.title.setTitle('Food Conservation and Waste Reduction');
    }
    goToTop(){
       this.goToTopEventEmit.emit(true);
    }
}
