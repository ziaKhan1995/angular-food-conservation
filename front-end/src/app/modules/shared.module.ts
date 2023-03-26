import { NgModule } from "@angular/core";
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { FlexLayoutModule } from "@angular/flex-layout";
import { CountdownModule } from 'ngx-countdown';
import { CommonModule } from '@angular/common';
import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from "ng-lazyload-image";
import { WebcamModule } from 'ngx-webcam';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgFileDragDropModule } from 'ng-file-drag-drop';
import {NgxImageCompressService} from "ngx-image-compress";
import { MatTabsModule } from '@angular/material/tabs';
import { HttpService } from "../shared/http.service";
import { HttpClientModule } from "@angular/common/http";
import { MatDividerModule } from "@angular/material/divider";
import { NgxShimmeringLoaderModule } from "ngx-shimmering-loader";
import {MatBadgeModule} from '@angular/material/badge';
import {CdkAccordionModule} from '@angular/cdk/accordion';

@NgModule({
	declarations: [
	],
	imports: [
    HttpClientModule
	],
	exports: [
    CdkAccordionModule,
	FlexLayoutModule,
    //mat modules
    MatSlideToggleModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatSidenavModule,
    FormsModule,
    MatTooltipModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatDialogModule,
    MatCardModule,
	CountdownModule,
    CommonModule,
    MatBadgeModule,
    LazyLoadImageModule,
    WebcamModule,
    ImageCropperModule,
    NgFileDragDropModule,
    MatTabsModule,
    MatDividerModule,
    NgxShimmeringLoaderModule,
    //NgXCreditCardsModule
	],
	providers: [
		NgxImageCompressService,
        HttpService,
        HttpClientModule,
        //{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }
	],
})
export class SharedModule { }
