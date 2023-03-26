import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { CONTENTS } from '../constants/constants';
@Component({
  selector: 'app-forgott-password',
  templateUrl: './forgott-password.component.html',
  styleUrls: ['./forgott-password.component.css']
})
export class ForgottPasswordComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required,
    Validators.email]),
  });
  msg='';
  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta,
  ) {
  }
  
  ngOnInit(): void {
  this.title.setTitle("Forgot Password");
  this.metadataTags();
}
metadataTags(){
  this.meta.addTags([  
    { name: 'keywords', content: 'Surplus food bidding' },  
    { name: 'robots', content: 'index, follow' },  
    { name: 'writer', content: 'Zia Khan' }, 
    { name: 'description', content: CONTENTS}, 
    { charset: 'UTF-8' }  
  ]);  
}
  submit() {
    console.log('form', this.form);
    this.form.markAllAsTouched();
    if (this.form.valid) {
      Swal.fire('Forgotten Password Request', 'Your forgot password request has been successfully processed, your will receive an email shortly including the password'
      );
    }
  }
  get f(){return this.form.controls;}
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

}
