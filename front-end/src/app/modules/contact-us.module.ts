import { NgModule } from '@angular/core';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { ContactUsComponent } from './../contact-us/contact-us.component';
import { ContactUsRoutingModule } from './contact-us-routing.module';
import { SharedModule } from './shared.module';

@NgModule({
    declarations: [
        ContactUsComponent
    ],
    imports: [
ContactUsRoutingModule,
        SharedModule
    ],
    exports: [

    ],
    providers: [
        {
        provide: MAT_RADIO_DEFAULT_OPTIONS,
        useValue: { color: 'primary' },
        }
    ],
    bootstrap: [
    ]
})
export class ContactUsModule { }
